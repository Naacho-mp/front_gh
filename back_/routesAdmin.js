// routesAdmin.js
import express from "https://esm.sh/express@5.2.1?target=deno";
import pool from "./db.js";
import { adminHtml } from "./adminHtml.js";

const router = express.Router();

router.get("/admin", (req, res) => {
  res.send(adminHtml);
});

router.post("/crear-usuario", async (req, res) => {
  const { adminNombre, adminContrasena, nuevoNombre, nuevoCorreo, nuevaContrasena, nuevoTienePermisos } = req.body;

  if (!adminNombre || !adminContrasena || !nuevoNombre || !nuevoCorreo || !nuevaContrasena) {
    return res.status(400).json({ error: "Campos requeridos faltantes" });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const adminRows = await conn.query("SELECT contrasena, tiene_permisos FROM usuarios WHERE nombre = ?", [adminNombre]);

    if (adminRows.length === 0 || adminRows[0].contrasena !== adminContrasena) {
      return res.status(401).json({ error: "Credenciales de administrador inválidas" });
    }

    if (adminRows[0].tiene_permisos !== 1) {
      return res.status(403).json({ error: "No tienes permisos de administrador para realizar esta acción" });
    }

    const userExists = await conn.query("SELECT id FROM usuarios WHERE correo = ? OR nombre = ?", [nuevoCorreo, nuevoNombre]);
    if (userExists.length > 0) {
      return res.status(400).json({ error: "El correo o el nombre ya están registrados" });
    }

    const tienePermisosValor = nuevoTienePermisos === true || nuevoTienePermisos === 1 ? 1 : 0;
    await conn.query(
      "INSERT INTO usuarios (nombre, correo, contrasena, tiene_permisos) VALUES (?, ?, ?, ?)",
      [nuevoNombre, nuevoCorreo, nuevaContrasena, tienePermisosValor]
    );

    res.status(201).json({ mensaje: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("Error del servidor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
