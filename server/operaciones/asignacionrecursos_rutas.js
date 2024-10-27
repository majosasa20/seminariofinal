const express = require("express");
const router = express.Router();

// Exporta una función que recibe la conexión a la base de datos
module.exports = (db) => {
    
    // Ruta para crear un puesto
    router.post("/create", async (req, res) => {
        const { CodProyecto, CodTrabajador, TiempoTrabajo, RemuneracionProyecto } = req.body;
    
        try {
            // Inserta la nueva asignación
            const [insertResult] = await db.query(
                'INSERT INTO asignacionrecursoproyecto (CodProyecto, CodTrabajador, TiempoTrabajo, RemuneracionProyecto) VALUES (?, ?, ?, ?)',
                [CodProyecto, CodTrabajador, TiempoTrabajo, RemuneracionProyecto]
            );
    
            // Si no se insertó nada, retorna un error
            if (insertResult.affectedRows === 0) {
                return res.status(400).send({ message: "No se pudo registrar la asignación." });
            }
    
            // Obtén el costo total después de la inserción
            const [rows] = await db.query('SELECT SUM(RemuneracionProyecto) AS costoTotal FROM asignacionrecursoproyecto WHERE CodProyecto = ?', [CodProyecto]);
            const costoTotal = rows[0].costoTotal;
    
            if (costoTotal === null) {
                return res.status(404).send({ message: "No se encontró el proyecto." });
            }
    
            const totalProyecto = costoTotal * 2;
    
            // Actualiza el detalle del proyecto
            await db.query(
                'UPDATE proyectodetalle SET CostoProyecto = ?, TotalProyecto = ? WHERE CodProyecto = ?',
                [costoTotal, totalProyecto, CodProyecto]
            );
    
            return res.status(200).send({ message: "Asignación registrada exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al registrar la asignación." });
        }
    });
    
    
    router.get("/get", async (req, res) => {
        const { CodProyecto} = req.query; 
        try {
            
            const [result] = await db.query(
                `select a.CodProyecto, b.NombreProyecto, a.CodTrabajador, c.NombreTrabajador, a.TiempoTrabajo, a.RemuneracionProyecto
                from asignacionrecursoproyecto a 
                inner join proyectoencabezado b on a.CodProyecto = b.IdProyecto
                inner join cat_trabajadores c on c.IdTrabajador = a.CodTrabajador
                WHERE a.CodProyecto = ? order by CodProyecto`,
                [CodProyecto ]
            );
            
            return res.status(200).send(result);
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al buscar las asignaciones." });
        }
    });

    router.post("/delete", async (req, res) => {
        const { CodProyecto, CodTrabajador } = req.body;  
        try {
            await db.query('DELETE FROM asignacionrecursoproyecto WHERE CodProyecto =? and CodTrabajador=?', 
                [CodProyecto, CodTrabajador]);  
            return res.status(200).send({ message: "Asignación eliminada exitosamente." });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al eliminar la asignación." });
        }
    });
    
    
    router.post("/update", async (req, res) => {
        const { CodProyecto, CodTrabajador, TiempoTrabajo, RemuneracionProyecto } = req.body;
    
        try {   
            // Actualiza la asignación
            const [result] = await db.query(
                'UPDATE asignacionrecursoproyecto SET TiempoTrabajo = ?, RemuneracionProyecto = ? WHERE CodProyecto = ? AND CodTrabajador = ?',
                [TiempoTrabajo, RemuneracionProyecto, CodProyecto, CodTrabajador]
            );
    
            // Obtén el costo total
            const [rows] = await db.query('SELECT SUM(RemuneracionProyecto) AS costoTotal FROM asignacionrecursoproyecto WHERE CodProyecto = ?', [CodProyecto]);
            const costoTotal = rows[0].costoTotal;
    
            if (costoTotal === null) {
                return res.status(404).send({ message: "No se encontró el proyecto." });
            }    
            const totalProyecto = costoTotal * 2;

            // Actualiza el detalle del proyecto
            await db.query(
                'UPDATE proyectodetalle SET CostoProyecto = ?, TotalProyecto = ? WHERE CodProyecto = ?',
                [costoTotal, totalProyecto, CodProyecto]
            );
    
            // Verifica si se actualizó la asignación
            if (result.affectedRows > 0) {
                return res.status(200).send({ message: "Asignación actualizada exitosamente." });
            } else {
                return res.status(404).send({ message: "Asignación no encontrada." });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al actualizar la asignación." });
        }
    });

    return router;
};
