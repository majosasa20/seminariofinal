import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Axios from "axios";

const BuscarUsuario = ({ showModal, toggleModal, setUsuarioData }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const obtenerUsuarios = () => {
    Axios.get("http://localhost:3001/ingresaUsuario/get")
      .then((response) => setUsuarios(response.data))
      .catch((error) => console.error("Error al obtener usuarios:", error));
  };

  const buscarUsuario = (nombre) => {
    Axios.get(`http://localhost:3001/ingresaUsuario/get/search`, {
      params: { NombreCompleto: nombre },
    })
      .then((response) => setUsuarios(response.data))
      .catch((error) => console.error("Error al buscar usuario:", error));
  };

  const handleShow = () => {
    obtenerUsuarios();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      buscarUsuario(busqueda);
    }
  };

  return (
    <Modal show={showModal} onHide={toggleModal} onEnter={handleShow} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Buscar Usuarios</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          placeholder="Buscar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={handleKeyDown}
        />
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
              <th>Nombre</th>
              <th>Correo</th>
              <th>Fecha Alta</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Fecha Baja</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => {
              const rol = usuario.rolUAdmin === 1 ? "Administrador" : "Usuario";
              return (
                <tr
                  key={usuario.idUsuario}
                  onDoubleClick={() => {
                    setUsuarioData(usuario);
                    toggleModal();
                  }}
                >
                  <td>{usuario.idUsuario}</td>
                  <td>{usuario.NombreCompleto}</td>
                  <td>{usuario.correoUsuario}</td>
                  <td>{usuario.fechaAlta}</td>
                  <td>{usuario.TelefonoUsuario}</td>
                  <td>{rol}</td>
                  <td>{usuario.FechaBaja}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={toggleModal}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BuscarUsuario;
