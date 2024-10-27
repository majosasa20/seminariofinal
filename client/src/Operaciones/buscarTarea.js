import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Axios from "axios";
import Swal from "sweetalert2";
import Col from 'react-bootstrap/Col';

const BuscarTarea = ({ showModal, toggleModal, setTareaData }) => {
  const [tareas, setTareas] = useState([]);
//   const [busqueda, setBusqueda] = useState("");
  const [tipoProyecto, setTipoProyecto] = useState([]);
  const [tipoProyectoSeleccionado, setTipoProyectoSelect] = useState("");

  const obtenerTareas = (CodProyecto) => {
    Axios.get(`http://localhost:3001/asignartareas/get?CodProyecto=${CodProyecto}`)
      .then((response) => setTareas(response.data))
      .catch((error) => console.error("Error al obtener tareas:", error));
  };

  const obtenerProyectos = () => {
    Axios.get("http://localhost:3001/proyectos/get")
      .then((response) => {
        setTipoProyecto(response.data);

        const idABuscar = tipoProyectoSeleccionado;
        if (!idABuscar || idABuscar < 1) {
          return;
        }

        const existeTipo = response.data.find(
          (tipo) => tipo.idProyecto === idABuscar
        );
        if (existeTipo) {
          setTipoProyectoSelect(existeTipo.idProyecto);
        } else {
          setTipoProyectoSelect("");
        }
      })
      .catch((error) => {
        console.error("Error al obtener los proyectos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al obtener los proyectos.",
          confirmButtonText: "Aceptar",
        });
      });
  };

  useEffect(() => {
    obtenerProyectos();
  }, []);

  const handleProyectoChange = (event) => {
    const idProyecto = event.target.value;
    setTipoProyectoSelect(idProyecto);
    obtenerTareas(idProyecto);
  };

  return (
    <Modal show={showModal} onHide={toggleModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Buscar Tareas</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>Buscar por Proyecto</Form.Label>
          <Form.Select value={tipoProyectoSeleccionado} onChange={handleProyectoChange}>
            <option>Selecciona...</option>
            {tipoProyecto.map((tipo) => (
              <option key={tipo.idProyecto} value={tipo.idProyecto}>
                {tipo.NombreProyecto}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <br />
        <Table bordered size="sm">
          <thead
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "#f8f9fa",
            }}
          >
            <tr>
              <th>Código</th>
              <th>Proyecto</th>
              <th>Empleado</th>
              <th>Descripción</th>
              <th>Horas Totales</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {tareas.map((tarea) => (
              <tr
                key={tarea.idTarea}
                onDoubleClick={() => {
                  setTareaData(tarea);
                  toggleModal();
                }}
              >
                <td>{tarea.idTarea}</td>
                <td>{tarea.NombreProyecto}</td>
                <td>{tarea.NombreTrabajador}</td>
                <td>{tarea.DescripcionTarea}</td>
                <td>{tarea.HorasTotales}</td>
                <td>{tarea.DescripcionEstado}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={toggleModal}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BuscarTarea;
