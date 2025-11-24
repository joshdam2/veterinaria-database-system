import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// ----- RUTAS DE PRUEBA -----
app.get("/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ ok: true, time: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ------------------ DUEÑOS ------------------
app.get("/duenos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Duenos ORDER BY id_dueno");
    res.json({ ok: true, duenos: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.post("/duenos", async (req, res) => {
  try {
    const { nombre, telefono, correo, direccion } = req.body;
    const result = await pool.query(
      "INSERT INTO Duenos (nombre, telefono, correo, direccion) VALUES ($1,$2,$3,$4) RETURNING *",
      [nombre, telefono, correo, direccion]
    );
    res.json({ ok: true, dueno: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.put("/duenos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, correo, direccion } = req.body;
    const result = await pool.query(
      "UPDATE Duenos SET nombre=$1, telefono=$2, correo=$3, direccion=$4 WHERE id_dueno=$5 RETURNING *",
      [nombre, telefono, correo, direccion, id]
    );
    res.json({ ok: true, dueno: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.delete("/duenos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM Duenos WHERE id_dueno=$1", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ------------------ MASCOTAS ------------------
app.get("/mascotas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Mascotas ORDER BY id_mascota");
    res.json({ ok: true, mascotas: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.post("/mascotas", async (req, res) => {
  try {
    const { id_dueno, nombre, especie, raza, edad, genero } = req.body;
    const result = await pool.query(
      "INSERT INTO Mascotas (id_dueno, nombre, especie, raza, edad, genero) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [id_dueno, nombre, especie, raza, edad, genero]
    );
    res.json({ ok: true, mascota: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.put("/mascotas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { id_dueno, nombre, especie, raza, edad, genero } = req.body;
    const result = await pool.query(
      "UPDATE Mascotas SET id_dueno=$1, nombre=$2, especie=$3, raza=$4, edad=$5, genero=$6 WHERE id_mascota=$7 RETURNING *",
      [id_dueno, nombre, especie, raza, edad, genero, id]
    );
    res.json({ ok: true, mascota: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.delete("/mascotas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM Mascotas WHERE id_mascota=$1", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ------------------ VETERINARIOS ------------------
app.get("/veterinarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Veterinarios ORDER BY id_veterinario");
    res.json({ ok: true, veterinarios: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.post("/veterinarios", async (req, res) => {
  try {
    const { nombre, especialidad, telefono, correo } = req.body;
    const result = await pool.query(
      "INSERT INTO Veterinarios (nombre, especialidad, telefono, correo) VALUES ($1,$2,$3,$4) RETURNING *",
      [nombre, especialidad, telefono, correo]
    );
    res.json({ ok: true, veterinario: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.put("/veterinarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, especialidad, telefono, correo } = req.body;
    const result = await pool.query(
      "UPDATE Veterinarios SET nombre=$1, especialidad=$2, telefono=$3, correo=$4 WHERE id_veterinario=$5 RETURNING *",
      [nombre, especialidad, telefono, correo, id]
    );
    res.json({ ok: true, veterinario: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.delete("/veterinarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM Veterinarios WHERE id_veterinario=$1", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ------------------ SERVICIOS ------------------
app.get("/servicios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Servicios ORDER BY id_servicio");
    res.json({ ok: true, servicios: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.post("/servicios", async (req, res) => {
  try {
    const { nombre_servicio, descripcion, costo, duracion_minutos } = req.body;
    const result = await pool.query(
      "INSERT INTO Servicios (nombre_servicio, descripcion, costo, duracion_minutos) VALUES ($1,$2,$3,$4) RETURNING *",
      [nombre_servicio, descripcion, costo, duracion_minutos]
    );
    res.json({ ok: true, servicio: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.put("/servicios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_servicio, descripcion, costo, duracion_minutos } = req.body;
    const result = await pool.query(
      "UPDATE Servicios SET nombre_servicio=$1, descripcion=$2, costo=$3, duracion_minutos=$4 WHERE id_servicio=$5 RETURNING *",
      [nombre_servicio, descripcion, costo, duracion_minutos, id]
    );
    res.json({ ok: true, servicio: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.delete("/servicios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM Servicios WHERE id_servicio=$1", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ------------------ CITAS ------------------
app.get("/citas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Citas ORDER BY id_cita");
    res.json({ ok: true, citas: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.post("/citas", async (req, res) => {
  try {
    const { id_mascota, id_veterinario, id_servicio, fecha, hora, estado } = req.body;
    const result = await pool.query(
      "INSERT INTO Citas (id_mascota, id_veterinario, id_servicio, fecha, hora, estado) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [id_mascota, id_veterinario, id_servicio, fecha, hora, estado]
    );
    res.json({ ok: true, cita: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.put("/citas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { id_mascota, id_veterinario, id_servicio, fecha, hora, estado } = req.body;
    const result = await pool.query(
      "UPDATE Citas SET id_mascota=$1, id_veterinario=$2, id_servicio=$3, fecha=$4, hora=$5, estado=$6 WHERE id_cita=$7 RETURNING *",
      [id_mascota, id_veterinario, id_servicio, fecha, hora, estado, id]
    );
    res.json({ ok: true, cita: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.delete("/citas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM Citas WHERE id_cita=$1", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ------------------ PAGOS ------------------
app.get("/pagos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Pagos ORDER BY id_pago");
    res.json({ ok: true, pagos: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.post("/pagos", async (req, res) => {
  try {
    const { id_cita, monto, metodo_pago, fecha_pago, estado } = req.body;
    const result = await pool.query(
      "INSERT INTO Pagos (id_cita, monto, metodo_pago, fecha_pago, estado) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [id_cita, monto, metodo_pago, fecha_pago, estado]
    );
    res.json({ ok: true, pago: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.put("/pagos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { id_cita, monto, metodo_pago, fecha_pago, estado } = req.body;
    const result = await pool.query(
      "UPDATE Pagos SET id_cita=$1, monto=$2, metodo_pago=$3, fecha_pago=$4, estado=$5 WHERE id_pago=$6 RETURNING *",
      [id_cita, monto, metodo_pago, fecha_pago, estado, id]
    );
    res.json({ ok: true, pago: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});
app.delete("/pagos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM Pagos WHERE id_pago=$1", [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ----- SERVIDOR -----
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));