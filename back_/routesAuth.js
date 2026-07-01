// routesAuth.js
import express from "https://esm.sh/express@5.2.1?target=deno";
import pool from "./db.js";
import { sendPasswordEmail } from "./emailService.js";

const router = express.Router();
const tokensRecuperacion = {};

router.post("/login", async (req, res) => {
  const { nombre, contrasena } = req.body;
  if (!nombre || !contrasena) return res.status(400).json({ error: "Campos requeridos" });

  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT id, nombre, correo, contrasena, tiene_permisos FROM usuarios WHERE nombre = ?", [nombre]);

    if (rows.length === 0 || rows[0].contrasena !== contrasena) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    res.json({ mensaje: "Login exitoso", usuario: rows[0] });
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (conn) conn.release();
  }
});

router.post("/olvidar-contrasena", async (req, res) => {
  const { correo } = req.body;
  if (!correo) return res.status(400).json({ error: "El correo es requerido" });

  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT id FROM usuarios WHERE correo = ?", [correo]);

    if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    const tokenrecuperar = Math.random().toString(36).substring(2);
    tokensRecuperacion[tokenrecuperar] = correo;

    await sendPasswordEmail(correo, tokenrecuperar);
    res.json({ mensaje: "Correo de recuperación enviado exitosamente" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "No se pudo enviar el correo" });
  } finally {
    if (conn) conn.release();
  }
});

router.post("/restablecer-contrasena", async (req, res) => {
  const { tokenrecuperar, nuevaContrasena } = req.body;
  if (!tokenrecuperar || !nuevaContrasena) {
    return res.status(400).json({ error: "El tokenrecuperar y la nueva contraseña son requeridos" });
  }

  const correoUsuario = tokensRecuperacion[tokenrecuperar];
  if (!correoUsuario) {
    return res.status(400).json({ error: "El token es inválido o no existe en el registro" });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("UPDATE usuarios SET contrasena = ? WHERE correo = ?", [nuevaContrasena, correoUsuario]);
    delete tokensRecuperacion[tokenrecuperar];
    res.json({ mensaje: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
