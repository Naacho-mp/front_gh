// crud.js
import express from "https://esm.sh/express@5.2.1?target=deno";
import pool from "./db.js"; // Apunta directamente al db.js que está en la raíz

const router = express.Router();

// ==========================================
// CRUD: SECCIÓN
// ==========================================

// 1. CREATE - Crear sección
router.post("/secciones", async (req, res) => {
  const { codigo_ramo, numero_seccion, estudiantes_inscritos } = req.body;
  
  if (!codigo_ramo || !numero_seccion) {
    return res.status(400).json({ error: "Código de ramo y número de sección son requeridos" });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const inscritos = estudiantes_inscritos || 0;
    
    await conn.query(
      "INSERT INTO seccion (codigo_ramo, numero_seccion, estudiantes_inscritos) VALUES (?, ?, ?)",
      [codigo_ramo, numero_seccion, inscritos]
    );
    
    res.status(201).json({ mensaje: "Sección creada exitosamente" });
  } catch (error) {
    console.error("Error al crear sección:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (conn) conn.release();
  }
});

// 2. READ - Obtener todas las secciones
router.get("/secciones", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM seccion");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener secciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (conn) conn.release();
  }
});

// 3. UPDATE - Actualizar sección por ID
router.put("/secciones/:id", async (req, res) => {
  const { id } = req.params;
  const { codigo_ramo, numero_seccion, estudiantes_inscritos } = req.body;

  if (!codigo_ramo || !numero_seccion) {
    return res.status(400).json({ error: "Código de ramo y número de sección son requeridos" });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const inscritos = estudiantes_inscritos || 0;
    
    const result = await conn.query(
      "UPDATE seccion SET codigo_ramo = ?, numero_seccion = ?, estudiantes_inscritos = ? WHERE id_seccion = ?",
      [codigo_ramo, numero_seccion, inscritos, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Sección no encontrada" });
    }

    res.json({ mensaje: "Sección actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar sección:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (conn) conn.release();
  }
});

// 4. DELETE - Eliminar sección por ID
router.delete("/secciones/:id", async (req, res) => {
  const { id } = req.params;

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM seccion WHERE id_seccion = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Sección no encontrada" });
    }

    res.json({ mensaje: "Sección eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar sección:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (conn) conn.release();
  }
});


// ==========================================
// CRUD: SALA
// ==========================================

// 1. CREATE - Crear sala
router.post("/salas", async (req, res) => {
  const { nombre_sala, tipo_de_sala, capacidad } = req.body;

  if (!nombre_sala || tipo_de_sala === undefined || !capacidad) {
    return res.status(400).json({ error: "Todos los campos de la sala son requeridos" });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const tipoValor = tipo_de_sala ? 1 : 0;

    await conn.query(
      "INSERT INTO sala (nombre_sala, tipo_de_sala, capacidad) VALUES (?, ?, ?)",
      [nombre_sala, tipoValor, capacidad]
    );

    res.status(201).json({ mensaje: "Sala creada exitosamente" });
  } catch (error) {
    console.error("Error al crear sala:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (conn) conn.release();
  }
});

// 2. READ - Obtener todas las salas
router.get("/salas", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM sala");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener salas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (conn) conn.release();
  }
});

// 3. UPDATE - Actualizar sala por ID
router.put("/salas/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre_sala, tipo_de_sala, capacidad } = req.body;

  if (!nombre_sala || tipo_de_sala === undefined || !capacidad) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const tipoValor = tipo_de_sala ? 1 : 0;

    const result = await conn.query(
      "UPDATE sala SET nombre_sala = ?, tipo_de_sala = ?, capacidad = ? WHERE id_sala = ?",
      [nombre_sala, tipoValor, capacidad, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Sala no encontrada" });
    }

    res.json({ mensaje: "Sala actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar sala:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (conn) conn.release();
  }
});

// 4. DELETE - Eliminar sala por ID
router.delete("/salas/:id", async (req, res) => {
  const { id } = req.params;

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM sala WHERE id_sala = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Sala no encontrada" });
    }

    res.json({ mensaje: "Sala eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar sala:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
