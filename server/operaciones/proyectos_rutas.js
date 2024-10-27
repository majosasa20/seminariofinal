const express = require("express");
const router = express.Router();

module.exports = (db) => {
    
    router.post("/create", async (req, res) => {
        const {
          NombreProyecto,
          FechaCreacion,
          FechaInicio,
          FechaFin,
          CodClienteProyecto,
          HorasTrabajo,
          CostoProyecto,
          TotalProyecto,
          DescripcionProyecto
        } = req.body;
      
        try {
          const [rows] = await db.query('SELECT IFNULL(MAX(idProyecto), 0) + 1 AS nuevoId FROM proyectoencabezado');
          const nuevoId = rows[0].nuevoId;
      
          // Insert en proyectoencabezado
          await db.query(
            `INSERT INTO proyectoencabezado (idProyecto, NombreProyecto, FechaCreacion, FechaInicio, FechaFin,
              CodClienteProyecto, CodEstadoProyecto) VALUES (?, ?, ?, ?, ?, ?, 3)`,
            [
              nuevoId,
              NombreProyecto,
              FechaCreacion,
              FechaInicio,
              FechaFin,
              CodClienteProyecto
            ]
          );
      
          // Insert en proyectodetalle
          await db.query(
            `INSERT INTO proyectodetalle (CodProyecto, CodClienteProyecto, HorasTrabajo, CostoProyecto,
              TotalProyecto, DescripcionProyecto) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              nuevoId,
              CodClienteProyecto,
              HorasTrabajo,
              CostoProyecto,
              TotalProyecto,
              DescripcionProyecto
            ]
          );
      
          return res.status(200).send({ message: "Proyecto registrado exitosamente en encabezado y detalle." });
      
        } catch (err) {
          console.error(err);
          return res.status(500).send({ message: "Error al registrar el proyecto." });
        }
      });
      
    
    router.get("/get", async (req, res) => {
        try {
            const [result] = await db.query(`select a.idProyecto, a.NombreProyecto, DATE_FORMAT(a.FechaCreacion, '%d-%m-%Y') AS FechaCreacion,
                DATE_FORMAT(a.FechaInicio, '%d-%m-%Y') AS FechaInicio,  DATE_FORMAT(a.FechaFin, '%d-%m-%Y') AS FechaFin,
                a.CodClienteProyecto, c.NombreCliente, a.CodEstadoProyecto, b.HorasTrabajo, b.CostoProyecto,
                b.TotalProyecto, b.DescripcionProyecto from proyectoencabezado a
                inner join proyectodetalle b on b.CodProyecto = a.IdProyecto and b.CodClienteProyecto = a.CodClienteProyecto
                inner join cat_cliente c on c.IdCliente = a.CodClienteProyecto
                and CodEstadoProyecto <> 1;`);
            return res.status(200).send(result); 
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al obtener los proyectos." });
        }
    });

    router.get("/getHitos", async (req, res) => {
        try {
            const [result] = await db.query(`select a.idProyecto, a.NombreProyecto, a.FechaCreacion,a.FechaInicio,  a.FechaFin,
                a.CodClienteProyecto, c.NombreCliente, a.CodEstadoProyecto, b.HorasTrabajo, b.CostoProyecto,
                b.TotalProyecto, b.DescripcionProyecto from proyectoencabezado a
                inner join proyectodetalle b on b.CodProyecto = a.IdProyecto and b.CodClienteProyecto = a.CodClienteProyecto
                inner join cat_cliente c on c.IdCliente = a.CodClienteProyecto
                and CodEstadoProyecto <> 1;`);
            return res.status(200).send(result); 
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al obtener los proyectos." });
        }
    });

    // Ruta para buscar proyectos por nombre
    router.get("/get/search", async (req, res) => {
        const { NombreCliente, NombreProyecto } = req.query; 
        try {
            
            const [result] = await db.query(
                `SELECT a.idProyecto, a.NombreProyecto, DATE_FORMAT(a.FechaCreacion, '%d-%m-%Y') AS FechaCreacion,
                DATE_FORMAT(a.FechaInicio, '%d-%m-%Y') AS FechaInicio,  DATE_FORMAT(a.FechaFin, '%d-%m-%Y') AS FechaFin,
                        a.CodClienteProyecto, c.NombreCliente, a.CodEstadoProyecto, b.HorasTrabajo, b.CostoProyecto,
                        b.TotalProyecto, b.DescripcionProyecto 
                    FROM proyectoencabezado a
                    INNER JOIN proyectodetalle b ON b.CodProyecto = a.IdProyecto AND b.CodClienteProyecto = a.CodClienteProyecto
                    INNER JOIN cat_cliente c ON c.IdCliente = a.CodClienteProyecto 
                    WHERE (? IS NULL OR c.NombreCliente LIKE ?) 
                    AND (? IS NULL OR a.NombreProyecto LIKE ?)
                    and CodEstadoProyecto <> 1`,
                [
                    NombreCliente ? `%${NombreCliente}%` : null,
                    NombreCliente ? `%${NombreCliente}%` : null,
                    NombreProyecto ? `%${NombreProyecto}%` : null,
                    NombreProyecto ? `%${NombreProyecto}%` : null
                ]
            );
            
            return res.status(200).send(result);
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al buscar proyectos." });
        }
    });


    router.post("/delete", async (req, res) => {
        const { idProyecto } = req.body;
      
        try {
            await db.query('update proyectoencabezado set CodEstadoProyecto = 1 WHERE idProyecto = ?', [idProyecto]);
            return res.status(200).send({ message: "Proyecto cancelado exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al cancelar el proyecto." });
        }
    });
    
    router.post("/update", async (req, res) => {
        const {
            idProyecto,
            NombreProyecto,
            FechaCreacion,
            FechaInicio,
            FechaFin,
            CodClienteProyecto,
            CodEstadoProyecto,
            HorasTrabajo,
            CostoProyecto,
            TotalProyecto,
            DescripcionProyecto
        } = req.body;
    
        try {
            // Actualizar en `proyectoencabezado`
            const [result] = await db.query(
                `UPDATE proyectoencabezado SET NombreProyecto = ?, FechaCreacion = ?, FechaInicio = ?, FechaFin = ?,
                CodClienteProyecto = ?, CodEstadoProyecto = ? WHERE idProyecto = ?`,
                [
                    NombreProyecto,
                    FechaCreacion,
                    FechaInicio,
                    FechaFin,
                    CodClienteProyecto,
                    CodEstadoProyecto,
                    idProyecto
                ]
            );
    
            // Actualizar en `proyectodetalle`
            const [resultDetalle] = await db.query(
                `UPDATE proyectodetalle SET CodClienteProyecto = ?, HorasTrabajo = ?, CostoProyecto = ?,
                TotalProyecto = ?, DescripcionProyecto = ? WHERE CodProyecto = ?`,
                [
                    CodClienteProyecto,
                    HorasTrabajo,
                    CostoProyecto,
                    TotalProyecto,
                    DescripcionProyecto,
                    idProyecto
                ]
            );
    
            // Validar si ambas consultas afectaron filas
            if (result.affectedRows > 0 && resultDetalle.affectedRows > 0) {
                return res.status(200).send({ message: "Proyecto y detalles actualizados exitosamente." });
            } else if (result.affectedRows > 0) {
                return res.status(200).send({ message: "Proyecto actualizado, pero no se actualizaron los detalles." });
            } else if (resultDetalle.affectedRows > 0) {
                return res.status(200).send({ message: "Detalles actualizados, pero no se actualizó el proyecto." });
            } else {
                return res.status(404).send({ message: "No se encontró el proyecto ni sus detalles para actualizar." });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al actualizar el proyecto y sus detalles." });
        }
    });
    
    
    return router;
};
