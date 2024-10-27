import '../main/styles.css';
import React, { useState } from 'react';
import styles from './adminUsuarios.module.css';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Axios from "axios";
import Swal from "sweetalert2";

function AdministraUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [Estado, setEstado] = useState(1);

  const eliminar = (idUsuario) => {
    if (idUsuario) {
      Axios.post("http://localhost:3001/ingresaUsuario/delete", {
        idUsuario: idUsuario,
      })
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "¡Eliminado!",
            text: response.data.message || "Usuario eliminado exitosamente",
            confirmButtonText: "Aceptar",
            willClose: () => {
              window.location.reload();
            },
          });
        })
        .catch((error) => {
          console.error("Error al eliminar el usuario:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response
              ? error.response.data.message
              : "Hubo un error al eliminar el usuario.",
            confirmButtonText: "Aceptar",
            willClose: () => {
              window.location.reload();
            },
          });
        });
    }
  };

  const obtenerUsuarios = (idEstado) => {
    Axios.get(`http://localhost:3001/ingresaUsuario/getUsuarios?EstadoUsuario=${idEstado}`)
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => console.error("Error al obtener usuarios:", error));
  };

  return (
    <div className="configuracion">
      <div className={styles.separacion}></div>
      <h2 className={styles.titulo}>Administración Usuarios</h2><br />
      <div className={styles.formulario}>
        <Form>
          <Row className="mb-2" as={Col}>
            <Col xs={12} md={1}>
              <Button 
                variant="outline-secondary"
                onClick={() => obtenerUsuarios(Estado)} // Usar una función flecha
              >
                Buscar
              </Button>
            </Col>
            <Col xs={12} md={4}>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Estado</Form.Label>
                <Form.Select 
                  onChange={(event) => setEstado(event.target.value)}
                  value={Estado} 
                >
                  <option value="">Selecciona el Estado...</option>
                  <option value="1">Vigente</option>
                  <option value="0">Inhabilitado</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
        <br />
        <div className={styles.resultado}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>No.</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Fecha Alta</th>
                <th>Teléfono</th>
                <th>Fecha Baja</th>
                <th>Administrador</th>
                <th>Estado</th>
                <th>Acciones</th> {/* Añadir columna para acciones */}
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario, index) => ( // Usar 'index' para el número
                <tr key={usuario.idUsuario}> {/* Cambiar a 'idUsuario' */}
                  <td>{index + 1}</td> {/* Número de fila */}
                  <td>{usuario.NombreCompleto}</td> {/* Asegúrate de que estas propiedades sean correctas */}
                  <td>{usuario.correoUsuario}</td>
                  <td>{usuario.fechaAlta}</td>
                  <td>{usuario.TelefonoUsuario}</td>
                  <td>{usuario.FechaBaja}</td>
                  <td>{usuario.rolUAdmin}</td>
                  <td>{usuario.EstadoUsuario === 1 ? "Vigente" : "Inhabilitado"}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => eliminar(usuario.idUsuario)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default AdministraUsuarios;
