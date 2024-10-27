import '../main/styles.css';
import styles from './CatDoctoIdenti.module.css';
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

function CatDoctoIdenti() {
  const [descripcionidentificacion, setDescripcion] = useState("");
  const [estadoidentificacion, setEstado] = useState("");
  const [selectedDocumento, setSelectedDocumento] = useState(null);
  const navigate = useNavigate();
  const [documentoLista, setDocumentos] = useState([]);

  const irAlMenuInicio = () => {
    navigate('/');
  };

  const add = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/documentos/create", {
      descripcionidentificacion: descripcionidentificacion
    })
      .then((response) => {
        obtener();  // Asegúrate de que esta función recargue la lista actualizada
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: response.data.message || 'Documento registrado exitosamente',
          confirmButtonText: 'Aceptar'
        });
      })
      .catch((error) => {
        console.error("Error al registrar el documento:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response ? error.response.data.message : 'Hubo un error al registrar el documento.',
          confirmButtonText: 'Aceptar',
          willClose: () => {
            window.location.reload();
          }
        });
      });
  };

  const obtener = () => {
    Axios.get("http://localhost:3001/documentos/getdocumento")
      .then((response) => {
        setDocumentos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los documentos:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response ? error.response.data.message : 'Hubo un error al obtener los documentos.',
          confirmButtonText: 'Aceptar',
          willClose: () => {
            window.location.reload();
          }
        });
      });
  }

  const eliminarDocumento = (event) => {
    event.preventDefault();
    if (selectedDocumento) {
      Axios.post("http://localhost:3001/documentos/deleteDocumento", { id_tipoidentificacion: selectedDocumento })
        .then((response) => {
          obtener();
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: response.data.message || 'Documento eliminado exitosamente',
            confirmButtonText: 'Aceptar',
            willClose: () => {
              window.location.reload();
            }
          });
        })
        .catch((error) => {
          console.error("Error al eliminar el documento:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response ? error.response.data.message : 'Hubo un error al eliminar el documento.',
            confirmButtonText: 'Aceptar',
            willClose: () => {
              window.location.reload();
            }
          });
        });
    }
  }

  const handleDoubleClick = (documento) => {
    setSelectedDocumento(documento.id_tipoidentificacion);
    setDescripcion(documento.descripcionidentificacion);
    setEstado(documento.estadoidentificacion);
  };

    const update = (event) => {
      event.preventDefault();
      if (selectedDocumento) {
        Axios.post("http://localhost:3001/documentos/updateDocumento", {        
          descripcionidentificacion: descripcionidentificacion,
          estadoidentificacion: estadoidentificacion,
          id_tipoidentificacion: selectedDocumento
          
        })
          .then((response) => {
            obtener();
            Swal.fire({
              icon: 'success',
              title: '¡Actualizado!',
              text: response.data.message || 'Documento actualizado exitosamente',
              confirmButtonText: 'Aceptar',
              willClose: () => {
                window.location.reload();
              }
            });
          })
          .catch((error) => {
            console.error("Error al actualizar el documento:", error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response ? error.response.data.message : 'Hubo un error al actualizar el documento.',
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
      <h2 className={styles.titulo}>Catálogo Documentos Identificación</h2><br/>

      <div className={styles.formulario}>
        <Form>
          <div className={styles.botones}>
            {/* <Row className="mb-3"> */}
              <Row className="mb-2" as={Col}>
                <Col xs={10} md={1}>
                  <Button variant="outline-secondary" type="submit" onClick={update} disabled={!selectedDocumento}>
                    Actualizar
                  </Button>
                </Col>
                <Col xs={10} md={1}>
                  <Button variant="outline-danger" type="submit" onClick={eliminarDocumento} disabled={!selectedDocumento}>
                    Eliminar
                  </Button>
                </Col>
                <Col xs={10} md={1}>
                  <Button variant="outline-dark" onClick={obtener}>Obtener</Button>
                </Col>
              </Row>
              {/* <Col xs="auto" className="ml-auto">
                <CloseButton onClick={irAlMenuInicio} />
              </Col> */}
            {/* </Row> */}
          </div>

          <Row className="mb-3">
      <Form.Group as={Col} xs={12} md={10} controlId="formGridPassword">
        <Form.Label>Descripción Documento</Form.Label>
        <Form.Control
          onChange={(event) => setDescripcion(event.target.value)}  // Actualiza el estado correcto
          value={descripcionidentificacion}  // Usa el valor del estado correcto
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
              checked={estadoidentificacion === 1}
              id="estado"
              label="Estado Documento"
              disabled={!selectedDocumento}
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
                  documentoLista.length > 0 ? (
                    documentoLista.map((val, key) => (
                      <tr
                        key={key}
                        onDoubleClick={() => handleDoubleClick(val)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td style={{ color: selectedDocumento === val.id_tipoidentificacion ? '#ff0000' : 'black', transition: 'color 0.3s ease' }}>
                          {val.id_tipoidentificacion}
                        </td>
                        <td style={{ color: selectedDocumento === val.id_tipoidentificacion ? '#ff0000' : 'black', transition: 'color 0.3s ease' }}>
                          {val.descripcionidentificacion}
                        </td>
                        <td style={{ color: selectedDocumento === val.id_tipoidentificacion ? '#ff0000' : 'black', transition: 'color 0.3s ease' }}>
                          {val.estadoidentificacion === 1 ? 'Activo' : 'Inactivo'}
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

export default CatDoctoIdenti;
