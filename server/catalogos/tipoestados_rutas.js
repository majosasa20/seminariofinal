const express = require("express");
const router = express.Router();

// Exporta una función que recibe la conexión a la base de datos
module.exports = (db) => {
    
    // Ruta para crear un puesto
    router.post("/create", async (req, res) => {
        const { DescripcionTipoEstado } = req.body;
    
        try {
            // Paso 1: Obtener el nuevo ID
            const [rows] = await db.query('SELECT IFNULL(MAX(idTipoEstado), 0) + 1 AS nuevoId FROM cat_tipoestadosproyecto');
            const nuevoId = rows[0].nuevoId; // Obtener el valor de 'nuevoId'
    
            // Paso 2: Insertar el nuevo registro
            await db.query(
                'INSERT INTO cat_tipoestadosproyecto (idTipoEstado, DescripcionTipoEstado, estadoTipo) VALUES (?, ?, 1)',
                [nuevoId, DescripcionTipoEstado]
            );
    
            return res.status(200).send({ message: "Tipo estado registrado exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al registrar el tipo estado." });
        }
    });
    
    // Ruta para obtener los documentos
    router.get("/get", async (req, res) => {
        try {
            const [result] = await db.query('select idTipoEstado, DescripcionTipoEstado, estadoTipo from cat_tipoestadosproyecto');
            return res.status(200).send(result); 
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al obtener los tipos estados." });
        }
    });

    router.post("/delete", async (req, res) => {
        const { idTipoEstado } = req.body;  // Cambia idpuesto a idDocumento
        try {
            await db.query('DELETE FROM cat_tipoestadosproyecto WHERE idTipoEstado = ?', [idTipoEstado]);  
            return res.status(200).send({ message: "Tipo estado eliminado exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al eliminar el tipo estado." });
        }
    });
    
    
    router.post("/update", async (req, res) => {
        const { idTipoEstado, DescripcionTipoEstado, estadoTipo } = req.body;  
        try {
            const [result] = await db.query(
                'UPDATE cat_tipoestadosproyecto SET DescripcionTipoEstado = ?, estadoTipo = ? WHERE idTipoEstado = ?',
                [DescripcionTipoEstado, estadoTipo, idTipoEstado] 
            );
          
            if (result.affectedRows > 0) {
                return res.status(200).send({ message: "Tipo estado actualizado exitosamente." });
            } else {
                return res.status(404).send({ message: "Tipo estado no encontrado." });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al actualizar el tipo estado." });
        }
    });
    
    
    // Devuelve el router con todas las rutas
    return router;
};
