const express = require("express");
const router = express.Router();


module.exports = (db) => {
    router.post("/login", async (req, res) => { 
        const { correoUsuario, contraseniaUser } = req.body;
        console.log("Correo:", correoUsuario, "Contraseña:", contraseniaUser);
        try {
            const [result] = await db.query(`SELECT idUsuario, NombreCompleto, DATE_FORMAT(fechaAlta, '%d-%m-%Y') AS fechaAlta, correoUsuario, TelefonoUsuario,
                contraseniaUser, DATE_FORMAT(FechaBaja, '%d-%m-%Y') AS FechaBaja, rolUAdmin, EstadoUsuario 
                FROM usuariossistema WHERE correoUsuario = ? and contraseniaUser = ?`, 
            [correoUsuario, contraseniaUser]);
            
            if (result.length > 0) { // Cambia el chequeo para ver si hay resultados
                return res.status(200).send({ message: "Login exitoso", user: result[0] });            
            } else {
                return res.status(404).send({ message: "Login fallido" });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al iniciar sesión." });
        }
    });

    return router; 
};
