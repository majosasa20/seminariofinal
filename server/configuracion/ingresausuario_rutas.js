const express = require("express");
const router = express.Router();

// Exporta una función que recibe la conexión a la base de datos
module.exports = (db) => {
    
    // Ruta para crear un empleado
    router.post("/create", async (req, res) => {
        const { NombreCompleto,
            rolUAdmin,
            correoUsuario,
            TelefonoUsuario,
            contraseniaUser
            } = req.body;
   
        try {            
            const [rows] = await db.query('SELECT IFNULL(MAX(idUsuario), 0) + 1 AS nuevoId FROM usuariossistema');
            const nuevoId = rows[0].nuevoId; 
                
            await db.query(
                `INSERT INTO usuariossistema (idUsuario, NombreCompleto, fechaAlta, correoUsuario, TelefonoUsuario,
            contraseniaUser, FechaBaja, rolUAdmin, EstadoUsuario) VALUES (?, ?, CURDATE(), ?, ?, ?, '9999-01-01', ?, 1)`,
                [nuevoId, NombreCompleto, correoUsuario, TelefonoUsuario,
                    contraseniaUser, rolUAdmin]
            );
    
            return res.status(200).send({ message: "Usuario registrado exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al registrar el usuario." });
        }
    });
    
    router.get("/get", async (req, res) => {
        try {
            const [result] = await db.query(`SELECT idUsuario, NombreCompleto,DATE_FORMAT(fechaAlta, '%d-%m-%Y') AS fechaAlta, correoUsuario, TelefonoUsuario,
            contraseniaUser, DATE_FORMAT(FechaBaja, '%d-%m-%Y') AS FechaBaja, rolUAdmin, EstadoUsuario from usuariossistema where EstadoUsuario = 1`);
            return res.status(200).send(result); 
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al obtener los usuarios." });
        }
    });

    router.get("/getUsuarios", async (req, res) => {
        const { EstadoUsuario } = req.query; // Cambia de req.body a req.query
        try {
            const [result] = await db.query(`SELECT idUsuario, NombreCompleto, DATE_FORMAT(fechaAlta, '%d-%m-%Y') AS fechaAlta, correoUsuario, TelefonoUsuario,
                contraseniaUser, DATE_FORMAT(FechaBaja, '%d-%m-%Y') AS FechaBaja, rolUAdmin, EstadoUsuario 
                FROM usuariossistema 
                WHERE EstadoUsuario = ?`, 
            [EstadoUsuario]);
            return res.status(200).send(result); 
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al obtener los usuarios." });
        }
    });
    

    router.get("/get/search", async (req, res) => {
        const { NombreCompleto } = req.query; 
        try {
            
            const [result] = await db.query(
                `SELECT idUsuario, NombreCompleto, DATE_FORMAT(fechaAlta, '%d-%m-%Y') AS fechaAlta, correoUsuario, TelefonoUsuario,
            contraseniaUser, DATE_FORMAT(FechaBaja, '%d-%m-%Y') AS FechaBaja, rolUAdmin, EstadoUsuario from usuariossistema where EstadoUsuario = 1 and NombreCompleto LIKE ?`,
                [`%${NombreCompleto}%`] 
            );
            return res.status(200).send(result);
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al buscar usuarios." });
        }
    });


    router.post("/delete", async (req, res) => {
        const { idUsuario } = req.body;
      
        try {
            await db.query('update usuariossistema set EstadoUsuario = 0, fechaBaja = CURDATE() WHERE idUsuario = ?', [idUsuario]);
            return res.status(200).send({ message: "Usuario eliminado exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al eliminar el usuario." });
        }
    });
    
    router.post("/update", async (req, res) => {
        const { idUsuario, NombreCompleto,
            rolUAdmin,
            correoUsuario,
            EstadoUsuario,
            TelefonoUsuario,
            contraseniaUser} = req.body;    
        try {
            const [result] = await db.query(
                `UPDATE usuariossistema SET NombreCompleto = ?, correoUsuario = ?, TelefonoUsuario = ?,
            contraseniaUser = ?, rolUAdmin = ?, EstadoUsuario=? WHERE idUsuario = ?`,
                [NombreCompleto, correoUsuario, TelefonoUsuario,
                    contraseniaUser, rolUAdmin,EstadoUsuario, idUsuario]
            );
          

            if (result.affectedRows > 0) {
                return res.status(200).send({ message: "cliente actualizado exitosamente." });
            } else {
                return res.status(404).send({ message: "cliente no encontrado." });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al actualizar el cliente." });
        }
    });
    
    // Devuelve el router con todas las rutas
    return router;
};
