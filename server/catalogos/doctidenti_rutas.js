const express = require("express");
const router = express.Router();

// Exporta una función que recibe la conexión a la base de datos
module.exports = (db) => {
    
    // Ruta para crear un puesto
    router.post("/create", async (req, res) => {
        const { descripcionidentificacion } = req.body;
    
        try {
            // Paso 1: Obtener el nuevo ID
            const [rows] = await db.query('SELECT IFNULL(MAX(id_tipoidentificacion), 0) + 1 AS nuevoId FROM cat_tipoidentificacion');
            const nuevoId = rows[0].nuevoId; // Obtener el valor de 'nuevoId'
    
            // Paso 2: Insertar el nuevo registro
            await db.query(
                'INSERT INTO cat_tipoidentificacion (id_tipoidentificacion, descripcionidentificacion, estadoidentificacion) VALUES (?, ?, 1)',
                [nuevoId, descripcionidentificacion]
            );
    
            return res.status(200).send({ message: "Documento registrado exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al registrar el documento." });
        }
    });
    
    // Ruta para obtener los documentos
    router.get("/getdocumento", async (req, res) => {
        try {
            const [result] = await db.query('SELECT id_tipoidentificacion, descripcionidentificacion, estadoidentificacion FROM cat_tipoidentificacion');
            return res.status(200).send(result); // Envía el resultado directamente
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al obtener los documentos." });
        }
    });

    router.post("/deleteDocumento", async (req, res) => {
        const { id_tipoidentificacion } = req.body;  // Cambia idpuesto a idDocumento
        try {
            await db.query('DELETE FROM cat_tipoidentificacion WHERE id_tipoidentificacion = ?', [id_tipoidentificacion]);  
            return res.status(200).send({ message: "Documento eliminado exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al eliminar el documento." });
        }
    });
    
    
    router.post("/updateDocumento", async (req, res) => {
        const {  descripcionidentificacion, estadoidentificacion,id_tipoidentificacion } = req.body;  
        try {
            const [result] = await db.query(
                'UPDATE cat_tipoidentificacion SET descripcionidentificacion = ?, estadoidentificacion = ? WHERE id_tipoidentificacion = ?',
                [descripcionidentificacion, estadoidentificacion,id_tipoidentificacion ] 
            );
          
            if (result.affectedRows > 0) {
                return res.status(200).send({ message: "Documento actualizado exitosamente." });
            } else {
                return res.status(404).send({ message: "Documento no encontrado." });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al actualizar el documento." });
        }
    });
    
    
    // Devuelve el router con todas las rutas
    return router;
};
