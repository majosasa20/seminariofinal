const express = require("express");
const router = express.Router();

// Exporta una función que recibe la conexión a la base de datos
module.exports = (db) => {
    
    // Ruta para crear una excepción
    router.post("/createexcepcion", async (req, res) => {
        const { CodUsuario, VentanaSistema, AccionEjecutada, mensajeExcepcion } = req.body;
        
        try {
            const [rows] = await db.query('SELECT IFNULL(MAX(idExcepcion), 0) + 1 AS nuevoId FROM excepcionsistema');
            const nuevoId = rows[0].nuevoId;

            await db.query(
                `INSERT INTO excepcionsistema (idExcepcion, CodUsuario, VentanaSistema, AccionEjecutada, mensajeExcepcion, fechaExcepcion) 
                VALUES (?, ?, ?, ?, ?, CURDATE())`,
                [nuevoId, CodUsuario, VentanaSistema, AccionEjecutada, mensajeExcepcion]
            );

            return res.status(200).send({ message: "Excepción registrada exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al registrar la excepción." });
        }
    });
    
    // Ruta para obtener todas las excepciones
    router.get("/getexcepcion", async (req, res) => {
        try {
            const [result] = await db.query(`
                SELECT idExcepcion, CodUsuario, VentanaSistema, AccionEjecutada, mensajeExcepcion, 
                DATE_FORMAT(fechaExcepcion, '%d-%m-%Y') AS fechaExcepcion 
                FROM excepcionsistema`);
            return res.status(200).send(result);
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al obtener las excepciones." });
        }
    });

    router.post("/createprueba", async (req, res) => {
        const { CodUsuario, VentanaSistema, AccionEjecutada, MensajePrueba } = req.body;
        
        try {
            const [rows] = await db.query('SELECT IFNULL(MAX(idPrueba), 0) + 1 AS nuevoId FROM pruebassistema');
            const nuevoId = rows[0].nuevoId;

            await db.query(
                `INSERT INTO pruebassistema (idPrueba, CodUsuario, VentanaSistema, AccionEjecutada, MensajePrueba, FechaPrueba) 
                VALUES (?, ?, ?, ?, ?, CURDATE())`,
                [nuevoId, CodUsuario, VentanaSistema, AccionEjecutada, MensajePrueba]
            );

            return res.status(200).send({ message: "Prueba registrada exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al registrar la prueba." });
        }
    });
    
    // Ruta para obtener todas las pruebas
    router.get("/getprueba", async (req, res) => {
        try {
            const [result] = await db.query(`
                SELECT idPrueba, CodUsuario, VentanaSistema, AccionEjecutada, MensajePrueba, 
                DATE_FORMAT(FechaPrueba, '%d-%m-%Y') AS FechaPrueba 
                FROM pruebassistema`);
            return res.status(200).send(result);
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al obtener las pruebas." });
        }
    });

    return router;
};
