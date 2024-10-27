import React, { useEffect, useState } from 'react';
import styles from './RptPruebaExito.module.css';
import Table from 'react-bootstrap/Table';
import Axios from 'axios';

function RptPruebaExitosa() {
  const [pruebasExitosas, setPruebasExitosas] = useState([]);

  // Función para obtener pruebas exitosas
  const obtenerPruebasExitosas = () => {
    Axios.get("http://localhost:3001/pruebas/getprueba")
      .then((response) => setPruebasExitosas(response.data))
      .catch((error) => console.error("Error al obtener pruebas exitosas:", error));
  };

  // Llama a obtenerPruebasExitosas cuando el componente se monte
  useEffect(() => {
    obtenerPruebasExitosas();
  }, []);

  return (
    <div className={styles.tabla}>
      <h2 className={styles.titulo}>Reporte Pruebas Exitosas</h2><br/>
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
          {pruebasExitosas.map((prueba, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{prueba.AccionEjecutada}</td>
              <td>{prueba.VentanaSistema}</td>
              <td>{prueba.MensajePrueba}</td>
              <td>{prueba.CodUsuario}</td>
              <td>{prueba.FechaPrueba}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default RptPruebaExitosa;
