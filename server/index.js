const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");  // Cambia a la versión que soporta promesas
const puestoRoutes = require("./catalogos/puestorutas.js"); 
const documentosRoutes = require("./catalogos/doctidenti_rutas.js");
const tipEstadoRutas = require("./catalogos/tipoestados_rutas.js"); 
const estadosRutas = require("./catalogos/estadosproyecto_rutas.js");
const empleadoRutas = require("./catalogos/empleados_rutas.js");
const clienteRutas = require("./catalogos/clientes_rutas.js")
const ProyectoRutas = require("./operaciones/proyectos_rutas.js")
const AsignacionRecurso = require("./operaciones/asignacionrecursos_rutas")
const AsignacionTarea = require("./operaciones/asignaciontareas_rutas")
const ingresaUsuario = require("./configuracion/ingresausuario_rutas.js");
const server = require("./server.js");
const PruebasExcep = require("./operaciones/pruebasExcep_rutas.js");


const app = express();
app.use(cors());
app.use(express.json());

mysql.createConnection({
    host: "bo5uhbnbh6milvhpjq6k-mysql.services.clever-cloud.com",
    user: "uxiyqmxhu95pmciy",
    password: "swmsURcX7L0HQvKeoHeO",
    database: "bo5uhbnbh6milvhpjq6k"
}).then((db) => {
    // Usa las rutas importadas y pasa la conexión de base de datos
    app.use("/puestos", puestoRoutes(db)); // Las rutas de puesto estarán disponibles en /puestos
    app.use("/documentos", documentosRoutes(db));
    app.use("/tipoEstados", tipEstadoRutas(db));
    app.use("/estadosproyectos", estadosRutas(db));
    app.use("/empleados", empleadoRutas(db));
    app.use("/clientes", clienteRutas(db));
    app.use("/proyectos", ProyectoRutas(db));
    app.use("/asignarecursos", AsignacionRecurso(db));
    app.use("/asignartareas", AsignacionTarea(db));
    app.use("/ingresaUsuario", ingresaUsuario(db));
    app.use("/server", server(db));
    app.use("/pruebas", PruebasExcep(db));

    // Inicia el servidor
    app.listen(3001, () => {
        console.log("Corriendo en el puerto 3001");
    });
}).catch((err) => {
    console.error("Error conectando a la base de datos:", err);
});
