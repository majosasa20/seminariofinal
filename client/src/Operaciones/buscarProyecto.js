import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Axios from "axios";
import { useState } from "react";

const BuscarProyecto = ({ showModal, toggleModal, setProyectoData }) => {
  const [proyectos, setProyectos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const obtenerProyectos = () => {
    Axios.get("http://localhost:3001/proyectos/get")
      .then((response) => setProyectos(response.data))
      .catch((error) => console.error("Error al obtener proyectos:", error));
  };

  const buscarProyecto = ({ NombreCliente = "", NombreProyecto = "" }) => {
    Axios.get(`http://localhost:3001/proyectos/get/search?NombreCliente=${NombreCliente}&NombreProyecto=${NombreProyecto}`)
      .then((response) => {
        setProyectos(response.data);
      })
      .catch((error) => console.error("Error al buscar proyecto:", error));
  };

  const handleShow = () => {
    obtenerProyectos();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      buscarProyecto(busqueda); 
    }
  };

  return (
    <Modal show={showModal} onHide={toggleModal} onEnter={handleShow} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Buscar Proyecto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          placeholder="Buscar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)} 
          onKeyDown={handleKeyDown} 
        /><br></br>
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
              <th>Nombre</th>
              <th>Cliente</th>
              <th>Fecha Creación</th>
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
                <td>{proyecto.NombreCliente}</td>
                <td>{proyecto.FechaCreacion}</td>
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

export default BuscarProyecto;
