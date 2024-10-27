import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Axios from "axios";
import { useState } from "react";

const BuscarEmpleado = ({ showModal, toggleModal, setEmpleadoData }) => {
  const [empleados, setEmpleados] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const obtenerEmpleados = () => {
    Axios.get("http://localhost:3001/empleados/get")
      .then((response) => setEmpleados(response.data))
      .catch((error) => console.error("Error al obtener empleados:", error));
  };

  const buscarEmpleado = (NombreTrabajador) => {
    Axios.get(`http://localhost:3001/empleados/get/search?NombreTrabajador=${NombreTrabajador}`)
      .then((response) => {
        setEmpleados(response.data);
      })
      .catch((error) => console.error("Error al buscar empleado:", error));
  };

  // Esta función se llama al abrir el modal
  const handleShow = () => {
    obtenerEmpleados();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      buscarEmpleado(busqueda); // Realiza la búsqueda al presionar Enter
    }
  };

  return (
    <Modal show={showModal} onHide={toggleModal} onEnter={handleShow} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Buscar Empleado</Modal.Title>
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
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr
                key={empleado.idTrabajador}
                onDoubleClick={() => {
                  setEmpleadoData(empleado);
                  toggleModal();
                }}
              >
                <td>{empleado.idTrabajador}</td>
                <td>{empleado.NombreTrabajador}</td>
                <td>{empleado.TelefonoTrabajador}</td>
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

export default BuscarEmpleado;
