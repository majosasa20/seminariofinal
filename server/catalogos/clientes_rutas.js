const express = require("express");
const router = express.Router();

// Exporta una función que recibe la conexión a la base de datos
module.exports = (db) => {
    
    // Ruta para crear un empleado
    router.post("/create", async (req, res) => {
        const { NombreCliente, CodTipoIdentificacion, NumIdentificacion, DireccionCliente,
            NombreComercial, TelefonoCliente, EstadoTrabajador} = req.body;
    
        try {
            
            const [rows] = await db.query('SELECT IFNULL(MAX(idCliente), 0) + 1 AS nuevoId FROM cat_cliente');
            const nuevoId = rows[0].nuevoId; 
    
            
            await db.query(
                `INSERT INTO cat_cliente (idCliente, NombreCliente, CodTipoIdentificacion, NumIdentificacion, DireccionCliente,
            NombreComercial, TelefonoCliente, EstadoCliente) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
                [nuevoId, NombreCliente, CodTipoIdentificacion, NumIdentificacion, DireccionCliente,
                    NombreComercial, TelefonoCliente, EstadoTrabajador]
            );
    
            return res.status(200).send({ message: "Cliente registrado exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al registrar el cliente." });
        }
    });
    
    // Ruta para obtener los empleados
    router.get("/get", async (req, res) => {
        try {
            const [result] = await db.query(`SELECT idCliente, NombreCliente, CodTipoIdentificacion, NumIdentificacion, DireccionCliente,
            NombreComercial, TelefonoCliente, EstadoCliente FROM cat_cliente where EstadoCliente = 1`);
            return res.status(200).send(result); 
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al obtener los clientes." });
        }
    });

    // Ruta para buscar empleados por nombre
    router.get("/get/search", async (req, res) => {
        const { NombreCliente } = req.query; 
        try {
            
            const [result] = await db.query(
                `SELECT idCliente, NombreCliente, CodTipoIdentificacion, NumIdentificacion, DireccionCliente,
            NombreComercial, TelefonoCliente, EstadoCliente FROM cat_cliente WHERE EstadoCliente=1 and NombreCliente LIKE ?`,
                [`%${NombreCliente}%`] 
            );
            return res.status(200).send(result);
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al buscar clientes." });
        }
    });


    router.post("/delete", async (req, res) => {
        const { idCliente } = req.body;
      
        try {
            await db.query('update cat_cliente set EstadoCliente = 0 WHERE idCliente = ?', [idCliente]);
            return res.status(200).send({ message: "Cliente eliminado exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al eliminar el cliente." });
        }
    });
    
    router.post("/update", async (req, res) => {
        const { idCliente, NombreCliente, CodTipoIdentificacion, NumIdentificacion, DireccionCliente,
            NombreComercial, TelefonoCliente, EstadoCliente } = req.body;      
        try {
            const [result] = await db.query(
                `UPDATE cat_cliente SET NombreCliente = ?, CodTipoIdentificacion = ?, NumIdentificacion = ?, DireccionCliente = ?, NombreComercial = ?,
                    TelefonoCliente = ?, EstadoCliente = ? WHERE idCliente = ?`,
                [NombreCliente, CodTipoIdentificacion, NumIdentificacion, DireccionCliente,
                    NombreComercial, TelefonoCliente, EstadoCliente, idCliente]
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
