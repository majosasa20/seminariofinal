const express = require("express");
const router = express.Router();

// Exporta una función que recibe la conexión a la base de datos
module.exports = (db) => {
    
    // Ruta para crear un puesto
    router.post("/create", async (req, res) => {
        const { DescripcionEstado, TipoEstado } = req.body;
    
        try {
            // Paso 1: Obtener el nuevo ID
            const [rows] = await db.query('SELECT IFNULL(MAX(idEstadoProyecto), 0) + 1 AS nuevoId FROM cat_estadosproyecto');
            const nuevoId = rows[0].nuevoId; // Obtener el valor de 'nuevoId'
    
            // Paso 2: Insertar el nuevo registro
            await db.query(
                'INSERT INTO cat_estadosproyecto (idEstadoProyecto, DescripcionEstado, TipoEstado, estadoBool) VALUES (?,?, ?, 1)',
                [nuevoId, DescripcionEstado, TipoEstado]
            );
    
            return res.status(200).send({ message: "Estado registrado exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al registrar el estado." });
        }
    });
    
    // Ruta para obtener los documentos
    router.get("/get", async (req, res) => {
        try {
            const [result] = await db.query(`select idEstadoProyecto, DescripcionEstado, TipoEstado, b.DescripcionTipoEstado DescTipoEstado, estadoBool 
                from cat_estadosproyecto a inner join cat_tipoestadosproyecto b on a.TipoEstado = b.idTipoEstado
                order by idEstadoProyecto`);
            return res.status(200).send(result); 
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al obtener los estados." });
        }
    });

    router.get("/getestadoproyecto", async (req, res) => {
        try {
            const [result] = await db.query(`SELECT a.idEstadoProyecto, a.DescripcionEstado, a.TipoEstado, b.DescripcionTipoEstado AS DescTipoEstado, a.estadoBool 
                FROM cat_estadosproyecto a 
                INNER JOIN cat_tipoestadosproyecto b ON a.TipoEstado = b.idTipoEstado 
                WHERE b.DescripcionTipoEstado = 'Proyecto' AND a.estadoBool = 1
                ORDER BY idEstadoProyecto`);
            return res.status(200).send(result); 
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al obtener los estados." });
        }
    });

    router.get("/getestadotarea", async (req, res) => {
        try {
            const [result] = await db.query(`SELECT a.idEstadoProyecto, a.DescripcionEstado, a.TipoEstado, b.DescripcionTipoEstado AS DescTipoEstado, a.estadoBool 
                FROM cat_estadosproyecto a 
                INNER JOIN cat_tipoestadosproyecto b ON a.TipoEstado = b.idTipoEstado 
                WHERE b.DescripcionTipoEstado = 'Tareas' AND a.estadoBool = 1
                ORDER BY idEstadoProyecto`);
            return res.status(200).send(result); 
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al obtener los estados." });
        }
    });

    router.post("/delete", async (req, res) => {
        const { idEstadoProyecto } = req.body;  
        try {
            await db.query('DELETE FROM cat_estadosproyecto WHERE idEstadoProyecto = ?', [idEstadoProyecto]);  
            return res.status(200).send({ message: "Estado eliminado exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al eliminar el estado." });
        }
    });
    
    
    router.post("/update", async (req, res) => {
        const { idEstadoProyecto, DescripcionEstado, TipoEstado, estadoBool } = req.body;  
        try {
            const [result] = await db.query(
                'UPDATE cat_estadosproyecto SET DescripcionEstado = ?, TipoEstado = ?, estadoBool = ? WHERE idEstadoProyecto = ?',
                [DescripcionEstado, TipoEstado, estadoBool, idEstadoProyecto] 
            );
          
            if (result.affectedRows > 0) {
                return res.status(200).send({ message: "Estado actualizado exitosamente." });
            } else {
                return res.status(404).send({ message: "Estado no encontrado." });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al actualizar el estado." });
        }
    });
    
    
    // Devuelve el router con todas las rutas
    return router;
};
