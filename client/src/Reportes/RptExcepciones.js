import React, { useEffect, useState } from 'react';
import styles from './RptExcepciones.module.css';
import Table from 'react-bootstrap/Table';
import Axios from 'axios';

function RptExcepciones() {
  const [excepciones, setExcepciones] = useState([]);

  // Función para obtener excepciones de pruebas
  const obtenerExcepciones = () => {
    Axios.get("http://localhost:3001/pruebas/getexcepcion")
      .then((response) => {setExcepciones(response.data)
        // console.log("excep", response.data)
      })
      .catch((error) => console.error("Error al obtener excepciones:", error));
  };

  // Llama a obtenerExcepciones cuando el componente se monte
  useEffect(() => {
    obtenerExcepciones();
  }, []);

  return (
    <div className={styles.tabla}>
      <h2 className={styles.titulo}>Reporte Excepciones</h2><br/>  
      <Table className={styles.table}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Función</th>
            <th>Formulario</th>
            <th>Mensaje Éxito</th>
            <th>Usuario</th>
            <th>Fecha Prueba</th>
          </tr>
        </thead>
        <tbody>
          {excepciones.map((excepcion, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{excepcion.AccionEjecutada}</td>
              <td>{excepcion.VentanaSistema}</td>
              <td>{excepcion.mensajeExcepcion}</td>
              <td>{excepcion.CodUsuario}</td>
              <td>{excepcion.fechaExcepcion}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default RptExcepciones;
