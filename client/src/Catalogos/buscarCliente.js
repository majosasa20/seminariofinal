import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Axios from "axios";
import { useState } from "react";

const BuscarCliente = ({ showModal, toggleModal, setClienteData }) => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const obtenerClientes = () => {
    Axios.get("http://localhost:3001/clientes/get")
      .then((response) => setClientes(response.data))
      .catch((error) => console.error("Error al obtener clientes:", error));
  };

  const buscarCliente = (NombreCliente) => {
    Axios.get(`http://localhost:3001/clientes/get/search?NombreCliente=${NombreCliente}`)
      .then((response) => {
        setClientes(response.data);
      })
      .catch((error) => console.error("Error al buscar cliente:", error));
  };

  // Esta función se llama al abrir el modal
  const handleShow = () => {
    obtenerClientes();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      buscarCliente(busqueda); // Realiza la búsqueda al presionar Enter
    }
  };

  return (
    <Modal show={showModal} onHide={toggleModal} onEnter={handleShow} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Buscar Cliente</Modal.Title>
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
            {clientes.map((cliente) => (
              <tr
                key={cliente.idCliente}
                onDoubleClick={() => {
                  setClienteData(cliente);
                  toggleModal();
                }}
              >
                <td>{cliente.idCliente}</td>
                <td>{cliente.NombreCliente}</td>
                <td>{cliente.TelefonoCliente}</td>
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

export default BuscarCliente;
