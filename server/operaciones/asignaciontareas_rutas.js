const express = require("express");
const router = express.Router();

module.exports = (db) => {
    
    router.post("/create", async (req, res) => {
        const {
          CodProyecto,
          CodTrabajador,
          DescripcionTarea,
          HorasTotales
        } = req.body;
      
        try {
          const [rows] = await db.query('SELECT IFNULL(MAX(idTarea), 0) + 1 AS nuevoId FROM asignaciontareasproyecto where CodProyecto = ?',
            [CodProyecto]
          );
          const nuevoId = rows[0].nuevoId;
      
          // Insert en proyectoencabezado
          await db.query(
            `INSERT INTO asignaciontareasproyecto (idTarea, CodProyecto,
          CodTrabajador,
          DescripcionTarea,
          HorasTrabajo,
          CodEstadoTarea,
          PorcentajeCumplimiento,
          HorasTotales) VALUES (?, ?, ?, ?, 0, 5, 0, ?)`,
            [
              nuevoId,
              CodProyecto,
                CodTrabajador,
                DescripcionTarea,
                HorasTotales
            ]
          );
      
            // Obtén las Horas de Trabajo
            const [filas] = await db.query('SELECT SUM(HorasTotales) AS horasTrabajoProy FROM asignaciontareasproyecto WHERE CodProyecto = ?', [CodProyecto]);
            const horasTrabajoProy = filas[0].horasTrabajoProy;
    
            // Actualiza el detalle del proyecto
            await db.query(
                'UPDATE proyectodetalle SET HorasTrabajo = ? WHERE CodProyecto = ?',
                [horasTrabajoProy, CodProyecto]
            );

          return res.status(200).send({ message: "Proyecto registrado exitosamente en encabezado y detalle." });
      
        } catch (err) {
          console.error(err);
          return res.status(500).send({ message: "Error al registrar el proyecto." });
        }
      });
      
    
    router.get("/get", async (req, res) => {
        const { CodProyecto} = req.query; 
        try {
            const [result] = await db.query(`Select a.idTarea, a.CodProyecto, b.NombreProyecto, a.CodTrabajador, c.NombreTrabajador, a.DescripcionTarea,
                a.HorasTrabajo, a.CodEstadoTarea, d.DescripcionEstado, a.PorcentajeCumplimiento, a.HorasTotales 
                from asignaciontareasproyecto a
                inner join proyectoencabezado b on b.IdProyecto = a.CodProyecto
                inner join cat_trabajadores c on c.IdTrabajador = a.CodTrabajador
                inner join cat_estadosproyecto d on d.idEstadoProyecto = a.CodEstadoTarea
                where a.CodProyecto = ? and a.CodEstadoTarea <> 4 order by a.IdTarea;`,
                [CodProyecto]);


            return res.status(200).send(result); 
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al obtener las tareas." });
        }
    });

    router.get("/getTareasProyecto", async (req, res) => {
        const { CodProyecto, CodEstadoTarea } = req.query; 
        const codEstadoTareaNum = parseInt(CodEstadoTarea, 10);
        // console.log(codEstadoTareaNum);
        try {
            // Define la consulta base
            let query = `
                SELECT a.idTarea, a.CodProyecto, b.NombreProyecto, a.CodTrabajador, c.NombreTrabajador, a.DescripcionTarea,
                       a.HorasTrabajo, a.CodEstadoTarea, d.DescripcionEstado, a.PorcentajeCumplimiento, a.HorasTotales 
                FROM asignaciontareasproyecto a
                INNER JOIN proyectoencabezado b ON b.IdProyecto = a.CodProyecto
                INNER JOIN cat_trabajadores c ON c.IdTrabajador = a.CodTrabajador
                INNER JOIN cat_estadosproyecto d ON d.idEstadoProyecto = a.CodEstadoTarea
                WHERE a.CodProyecto = ?`;

            const params = [CodProyecto];
                        
            if (codEstadoTareaNum > 0) {
                query += ` AND a.CodEstadoTarea = ?`;
                params.push(codEstadoTareaNum); // Usa el número aquí
            }
            
            query += ` ORDER BY a.IdTarea;`; 
    
            const [result] = await db.query(query, params); 
            // console.log("Result:", result);
    
            return res.status(200).send(result); 
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al obtener las tareas." });
        }
    });
   

    router.post("/delete", async (req, res) => {
        const { idTarea, CodProyecto } = req.body;
      
        try {
            await db.query('update asignaciontareasproyecto set CodEstadoTarea = 4 WHERE idTarea = ? and  CodProyecto = ?', 
                [idTarea, CodProyecto]);
            return res.status(200).send({ message: "Tarea cancelada exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al cancelar la tarea." });
        }
    });
    
    router.post("/update", async (req, res) => {
        const {
            idTarea,
            CodProyecto,
            CodTrabajador,
            DescripcionTarea,
            HorasTrabajo,
            PorcentajeCumplimiento,
            HorasTotales
        } = req.body;
    
        try {
            // Actualiza la tarea en asignaciontareasproyecto
            const [result] = await db.query(
                `UPDATE asignaciontareasproyecto SET 
                    CodTrabajador = ?,
                    DescripcionTarea = ?,
                    HorasTrabajo = ?,
                    PorcentajeCumplimiento = ?,
                    HorasTotales = ? 
                WHERE idTarea = ? AND CodProyecto = ?`,
                [
                    CodTrabajador,
                    DescripcionTarea,
                    HorasTrabajo,
                    PorcentajeCumplimiento,
                    HorasTotales,
                    idTarea,
                    CodProyecto
                ]
            );
    
            // Obtén las Horas de Trabajo
            const [filas] = await db.query('SELECT SUM(HorasTotales) AS horasTrabajoProy FROM asignaciontareasproyecto WHERE CodProyecto = ?', [CodProyecto]);
            const horasTrabajoProy = filas[0].horasTrabajoProy;
    
            // Actualiza el detalle del proyecto
            await db.query(
                'UPDATE proyectodetalle SET HorasTrabajo = ? WHERE CodProyecto = ?',
                [horasTrabajoProy, CodProyecto]
            );
    
            if (result.affectedRows > 0) {
                return res.status(200).send({ message: "Tarea actualizada exitosamente." });
            } else {
                return res.status(404).send({ message: "Tarea no encontrada." });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al actualizar la tarea." });
        }
    });
    

    router.post("/actualizaHoras", async (req, res) => {
        const {
            idTarea,
            CodProyecto,
            HorasTrabajo,
            CodEstadoTarea,
            PorcentajeCumplimiento
        } = req.body;
    
        try {
            const [result] = await db.query(
                `UPDATE asignaciontareasproyecto SET HorasTrabajo = ?,
                    CodEstadoTarea = ?,
                    PorcentajeCumplimiento = ? WHERE idTarea = ? and CodProyecto = ?`,
                [
                    HorasTrabajo,
                    CodEstadoTarea,
                    PorcentajeCumplimiento,
                    idTarea,
                    CodProyecto,
                ]
            );
    
            if (result.affectedRows > 0) {
                return res.status(200).send({ message: "Tarea actualizada exitosamente." });
            } else {
                return res.status(404).send({ message: "Tarea no encontrado." });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al actualizar la tarea." });
        }
    });
    
    
    return router;
};
