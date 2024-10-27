import React, { useEffect, useState } from "react"; // Importa useEffect aquí
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Axios from "axios";
import styles from './RptProyectos.module.css';

const RptProyectos = ({ showModal, toggleModal, setProyectoData }) => {
  const [proyectos, setProyectos] = useState([]);
  // const [busqueda, setBusqueda] = useState("");

  // Función para obtener proyectos
  const obtenerProyectos = () => {
    Axios.get("http://localhost:3001/proyectos/get")
      .then((response) => setProyectos(response.data))
      .catch((error) => console.error("Error al obtener proyectos:", error));
  };

  // Llama a obtenerProyectos cuando el componente se monte
  useEffect(() => {
    obtenerProyectos();
  }, []); // Dependencias vacías para que se ejecute solo al montar el componente

  return (
    <div className="reporte">
      <div className={styles.separacion}></div>
      <div className={styles.tabla}>
        <h2 className={styles.titulo}>Reporte Proyectos</h2><br />
        <Table className={styles.table}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Proyecto</th>
              <th>Descripción</th>
              <th>Fecha Creación</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Horas Totales</th>
              <th>Costo Proyecto</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {proyectos.map((proyecto) => (
              <tr
                key={proyecto.idProyecto}
                onDoubleClick={() => {
                  setProyectoData(proyecto);
                  toggleModal();
                }}
              >
                <td>{proyecto.idProyecto}</td>
                <td>{proyecto.NombreProyecto}</td>
                <td>{proyecto.DescripcionProyecto}</td>
                <td>{proyecto.FechaCreacion}</td>
                <td>{proyecto.FechaInicio}</td>
                <td>{proyecto.FechaFin}</td>
                <td>{proyecto.HorasTrabajo}</td>
                <td>{proyecto.CostoProyecto}</td>
                <td>{proyecto.TotalProyecto}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default RptProyectos;
