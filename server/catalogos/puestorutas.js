const express = require("express");
const router = express.Router();

// Exporta una función que recibe la conexión a la base de datos
module.exports = (db) => {
    
    // Ruta para crear un puesto
    router.post("/create", async (req, res) => {
        const { descripcionpuesto } = req.body;
    
        try {
            // Paso 1: Obtener el nuevo ID
            const [rows] = await db.query('SELECT IFNULL(MAX(idpuesto), 0) + 1 AS nuevoId FROM cat_puestosfuncion');
            const nuevoId = rows[0].nuevoId; // Obtener el valor de 'nuevoId'
    
            // Paso 2: Insertar el nuevo registro
            await db.query(
                'INSERT INTO cat_puestosfuncion (idpuesto, descripcionpuesto, estadopuesto) VALUES (?, ?, 1)',
                [nuevoId, descripcionpuesto]
            );
    
            return res.status(200).send({ message: "Puesto registrado exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al registrar el puesto." });
        }
    });
    
    // Ruta para obtener los puestos
    router.get("/getpuesto", async (req, res) => {
        try {
            const [result] = await db.query('SELECT idpuesto, descripcionpuesto, estadopuesto FROM cat_puestosfuncion');
            return res.status(200).send(result); // Envía el resultado directamente
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al obtener los puestos." });
        }
    });

    router.post("/delete", async (req, res) => {
        const { idpuesto } = req.body;
      
        try {
            await db.query('DELETE FROM cat_puestosfuncion WHERE idpuesto = ?', [idpuesto]);
            return res.status(200).send({ message: "Puesto eliminado exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al eliminar el puesto." });
        }
    });
    
    router.post("/update", async (req, res) => {
        const { idpuesto, descripcionpuesto, estadopuesto } = req.body;      
        try {
            const [result] = await db.query(
                'UPDATE cat_puestosfuncion SET descripcionpuesto = ?, estadopuesto = ? WHERE idpuesto = ?',
                [descripcionpuesto, estadopuesto, idpuesto]
            );
          
            // Verifica si se afectaron filas (si se actualizó algo)
            if (result.affectedRows > 0) {
                return res.status(200).send({ message: "Puesto actualizado exitosamente." });
            } else {
                return res.status(404).send({ message: "Puesto no encontrado." });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al actualizar el puesto." });
        }
    });
    
    // Devuelve el router con todas las rutas
    return router;
};
