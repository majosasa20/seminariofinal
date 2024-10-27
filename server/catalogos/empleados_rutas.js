const express = require("express");
const router = express.Router();

// Exporta una función que recibe la conexión a la base de datos
module.exports = (db) => {
    
    // Ruta para crear un empleado
    router.post("/create", async (req, res) => {
        const { NombreTrabajador, CodTipoIdentificacion, NumIdentificacion, DireccionTrabajador, CodPuestoTrabajador,
            TelefonoTrabajador, EstadoTrabajador} = req.body;
    
        try {
            // Paso 1: Obtener el nuevo ID
            const [rows] = await db.query('SELECT IFNULL(MAX(idTrabajador), 0) + 1 AS nuevoId FROM cat_trabajadores');
            const nuevoId = rows[0].nuevoId; // Obtener el valor de 'nuevoId'
    
            // Paso 2: Insertar el nuevo registro
            await db.query(
                `INSERT INTO cat_trabajadores (idTrabajador, NombreTrabajador, CodTipoIdentificacion, NumIdentificacion, DireccionTrabajador, CodPuestoTrabajador,
                TelefonoTrabajador, EstadoTrabajador) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
                [nuevoId, NombreTrabajador, CodTipoIdentificacion, NumIdentificacion, DireccionTrabajador, CodPuestoTrabajador,
                TelefonoTrabajador, EstadoTrabajador]
            );
    
            return res.status(200).send({ message: "Empleado registrado exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al registrar el empleado." });
        }
    });
    
    // Ruta para obtener los empleados
    router.get("/get", async (req, res) => {
        try {
            const [result] = await db.query(`SELECT idTrabajador, NombreTrabajador, CodTipoIdentificacion, NumIdentificacion, DireccionTrabajador, CodPuestoTrabajador,
                TelefonoTrabajador, EstadoTrabajador FROM cat_trabajadores where EstadoTrabajador = 1`);
            return res.status(200).send(result); // Envía el resultado directamente
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al obtener los empleados." });
        }
    });

    // Ruta para buscar empleados por nombre
    router.get("/get/search", async (req, res) => {
        const { NombreTrabajador } = req.query; // Obtener el nombre del query
        try {
            // Usar una consulta SQL para buscar empleados por nombre
            const [result] = await db.query(
                `SELECT idTrabajador, NombreTrabajador, CodTipoIdentificacion, NumIdentificacion, DireccionTrabajador, CodPuestoTrabajador,
                TelefonoTrabajador, EstadoTrabajador FROM cat_trabajadores WHERE EstadoTrabajador=1 and NombreTrabajador LIKE ?`,
                [`%${NombreTrabajador}%`] // Utiliza LIKE para búsqueda parcial
            );
            return res.status(200).send(result);
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al buscar empleados." });
        }
    });

    router.get("/getid", async (req, res) => {
        const { idTrabajador } = req.query; 
        try {
            const [result] = await db.query(
                `SELECT idTrabajador, NombreTrabajador, CodTipoIdentificacion, NumIdentificacion, DireccionTrabajador, CodPuestoTrabajador,
                TelefonoTrabajador, EstadoTrabajador FROM cat_trabajadores WHERE EstadoTrabajador=1 and idTrabajador = ?`,
                [idTrabajador]
            );
            return res.status(200).send(result);
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al buscar empleados." });
        }
    });


    router.post("/delete", async (req, res) => {
        const { idTrabajador } = req.body;
      
        try {
            await db.query('update cat_trabajadores set EstadoTrabajador = 0 WHERE idTrabajador = ?', [idTrabajador]);
            return res.status(200).send({ message: "Empleado eliminado exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al eliminar el empleado." });
        }
    });
    
    router.post("/update", async (req, res) => {
        const { idTrabajador, NombreTrabajador, CodTipoIdentificacion, NumIdentificacion, DireccionTrabajador, CodPuestoTrabajador,
            TelefonoTrabajador, EstadoTrabajador } = req.body;      
        try {
            const [result] = await db.query(
                `UPDATE cat_trabajadores SET NombreTrabajador = ?, CodTipoIdentificacion = ?, NumIdentificacion = ?, DireccionTrabajador = ?, CodPuestoTrabajador = ?,
                    TelefonoTrabajador = ?, EstadoTrabajador = ? WHERE idTrabajador = ?`,
                [NombreTrabajador, CodTipoIdentificacion, NumIdentificacion, DireccionTrabajador, CodPuestoTrabajador,
                    TelefonoTrabajador, EstadoTrabajador, idTrabajador]
            );
          
            // Verifica si se afectaron filas (si se actualizó algo)
            if (result.affectedRows > 0) {
                return res.status(200).send({ message: "empleado actualizado exitosamente." });
            } else {
                return res.status(404).send({ message: "empleado no encontrado." });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al actualizar el empleado." });
        }
    });
    
    // Devuelve el router con todas las rutas
    return router;
};
