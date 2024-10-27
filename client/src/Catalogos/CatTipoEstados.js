import '../main/styles.css';
import styles from './CatTipoEstados.module.css';
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import CloseButton from 'react-bootstrap/CloseButton';
import { useNavigate } from 'react-router-dom';
import Axios from "axios";
import Swal from 'sweetalert2';
import Table from 'react-bootstrap/Table';

function CatTipoEstados() {
  const [DescripcionTipoEstado, setDescripcion] = useState("");
  const [estadoTipo, setEstado] = useState("");
  const [selectedTipoEstado, setSelectedTipoEstado] = useState(null);
  const navigate = useNavigate();
  const [tipoEstadoLista, setTiposEstados] = useState([]);

  const irAlMenuInicio = () => {
    navigate('/');
  };

  const add = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/tipoEstados/create", {
      DescripcionTipoEstado: DescripcionTipoEstado
    })
      .then((response) => {
        obtener();  // Asegúrate de que esta función recargue la lista actualizada
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: response.data.message || 'Tipo Estado registrado exitosamente',
          confirmButtonText: 'Aceptar'
        });
      })
      .catch((error) => {
        console.error("Error al registrar el tipo estado:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response ? error.response.data.message : 'Hubo un error al registrar el tipo estado.',
          confirmButtonText: 'Aceptar',
          willClose: () => {
            window.location.reload();
          }
        });
      });
  };

  const obtener = () => {
    Axios.get("http://localhost:3001/tipoEstados/get")
      .then((response) => {
        setTiposEstados(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los tipos estados:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response ? error.response.data.message : 'Hubo un error al obtener los tipos estados.',
          confirmButtonText: 'Aceptar',
          willClose: () => {
            window.location.reload();
          }
        });
      });
  }

  const eliminar = (event) => {
    event.preventDefault();
    if (selectedTipoEstado) {
      Axios.post("http://localhost:3001/tipoEstados/delete", { idTipoEstado: selectedTipoEstado })
        .then((response) => {
          obtener();
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: response.data.message || 'Tipo estado eliminado exitosamente',
            confirmButtonText: 'Aceptar',
            willClose: () => {
              window.location.reload();
            }
          });
        })
        .catch((error) => {
          console.error("Error al eliminar el tipo estado:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response ? error.response.data.message : 'Hubo un error al eliminar el tipo estado.',
            confirmButtonText: 'Aceptar',
            willClose: () => {
              window.location.reload();
            }
          });
        });
    }
  }

  const handleDoubleClick = (documento) => {
    setSelectedTipoEstado(documento.idTipoEstado);
    setDescripcion(documento.DescripcionTipoEstado);
    setEstado(documento.estadoTipo);
  };

    const update = (event) => {
      event.preventDefault();
      if (selectedTipoEstado) {
        Axios.post("http://localhost:3001/tipoEstados/update", {        
          DescripcionTipoEstado: DescripcionTipoEstado,
          estadoTipo: estadoTipo,
          idTipoEstado: selectedTipoEstado
          
        })
          .then((response) => {
            obtener();
            Swal.fire({
              icon: 'success',
              title: '¡Actualizado!',
              text: response.data.message || 'Tipo Estado actualizado exitosamente',
              confirmButtonText: 'Aceptar',
              willClose: () => {
                window.location.reload();
              }
            });
          })
          .catch((error) => {
            console.error("Error al actualizar el tipo estado:", error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response ? error.response.data.message : 'Hubo un error al actualizar el tipo estado.',
              confirmButtonText: 'Aceptar',
              willClose: () => {
                window.location.reload();
              }
            });
          });
      }
    }

  return (
    <div className="catalogo">
      <div className={styles.separacion}></div>
      <h2 className={styles.titulo}>Catálogo Tipos Estados</h2><br/>

      <div className={styles.formulario}>
        <Form>
          <div className={styles.botones}>
            {/* <Row className="mb-3"> */}
              <Row className="mb-2" as={Col}>
                <Col xs={10} md={1}>
                  <Button variant="outline-secondary" type="submit" onClick={update} disabled={!selectedTipoEstado}>
                    Actualizar
                  </Button>
                </Col>
                <Col xs={10} md={1}>
                  <Button variant="outline-danger" type="submit" onClick={eliminar} disabled={!selectedTipoEstado}>
                    Eliminar
                  </Button>
                </Col>
                <Col xs={10} md={1}>
                  <Button variant="outline-dark" onClick={obtener}>Obtener</Button>
                </Col>
              </Row>
              {/* <Col xs="auto" className="ml-auto">
                <CloseButton onClick={irAlMenuInicio} />
              </Col>
            </Row> */}
          </div>

          <Row className="mb-3">
      <Form.Group as={Col} xs={12} md={10} controlId="formGridPassword">
        <Form.Label>Descripción Tipo Estado</Form.Label>
        <Form.Control
          onChange={(event) => setDescripcion(event.target.value)}  // Actualiza el estado correcto
          value={DescripcionTipoEstado}  // Usa el valor del estado correcto
          placeholder="Descripción"
        />
      </Form.Group>

      <Col xs={12} md={2} className="d-flex align-items-end">
        <Button variant="outline-success" type="submit" onClick={add} style={{ width: '150px' }}>
          Agregar
        </Button>
      </Col>
    </Row>

          <div className="mb-3">
            <Form.Check
              type="checkbox"
              onChange={(event) => setEstado(event.target.checked ? 1 : 0)}
              checked={estadoTipo === 1}
              id="estado"
              label="Estado Tipo"
              disabled={!selectedTipoEstado}
            />
          </div>

          <div className={styles.tablaregistros} style={{ maxHeight: '340px', overflowY: 'scroll' }}>
            <Table bordered size="sm">
              <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th>#</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {
                  tipoEstadoLista.length > 0 ? (
                    tipoEstadoLista.map((val, key) => (
                      <tr
                        key={key}
                        onDoubleClick={() => handleDoubleClick(val)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td style={{ color: selectedTipoEstado === val.idTipoEstado ? '#ff0000' : 'black', transition: 'color 0.3s ease' }}>
                          {val.idTipoEstado}
                        </td>
                        <td style={{ color: selectedTipoEstado === val.idTipoEstado ? '#ff0000' : 'black', transition: 'color 0.3s ease' }}>
                          {val.DescripcionTipoEstado}
                        </td>
                        <td style={{ color: selectedTipoEstado === val.idTipoEstado ? '#ff0000' : 'black', transition: 'color 0.3s ease' }}>
                          {val.estadoTipo === 1 ? 'Activo' : 'Inactivo'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3"></td>
                    </tr>
                  )
                }
              </tbody>
            </Table>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default CatTipoEstados;
