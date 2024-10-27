import '../main/styles.css';
import styles from './CatCargo.module.css';
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

function CatCargo() {

  const [descripcionCargo, setDescripcion] = useState("");
  const [estadoCargo, setEstado] = useState("");
  const [selectedPuesto, setSelectedPuesto] = useState(null); // Para almacenar el idpuesto seleccionado
  const navigate = useNavigate(); 
  const [puestosLista, setPuestos] = useState([]);

  const irAlMenuInicio = () => {
    navigate('/'); 
  };

  const add = (event) => {
    event.preventDefault(); 
  
    Axios.post("http://localhost:3001/puestos/create", {
      descripcionpuesto: descripcionCargo
    })
    .then((response) => {
      obtener();
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: response.data.message || 'Puesto registrado exitosamente',
        confirmButtonText: 'Aceptar'
      });
    })
    .catch((error) => {
      console.error("Error al registrar el puesto:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response ? error.response.data.message : 'Hubo un error al registrar el puesto.',
        confirmButtonText: 'Aceptar',
        willClose: () => {
          window.location.reload();
        }
      });
    });
  }

  const obtener = () => {  
    Axios.get("http://localhost:3001/puestos/getpuesto")
    .then((response) => {
      setPuestos(response.data);
    })
    .catch((error) => {
      console.error("Error al obtener los puestos:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response ? error.response.data.message : 'Hubo un error al obtener los puestos.',
        confirmButtonText: 'Aceptar',
        willClose: () => {
          window.location.reload();
        }
      });
    });
  }

  const eliminarPuesto = (event) => {
    event.preventDefault();
    if (selectedPuesto) {
      Axios.post(`http://localhost:3001/puestos/delete`, { idpuesto: selectedPuesto })
      .then((response) => {
        obtener();
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: response.data.message || 'Puesto eliminado exitosamente',
          confirmButtonText: 'Aceptar',
          willClose: () => {
            window.location.reload();
          }
        });
      })
      .catch((error) => {
        console.error("Error al eliminar el puesto:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response ? error.response.data.message : 'Hubo un error al eliminar el puesto.',
          confirmButtonText: 'Aceptar',
          willClose: () => {
            window.location.reload();
          }
        });
      });
    }
  }

  const handleDoubleClick = (puesto) => {
    setSelectedPuesto(puesto.idpuesto); 
    setDescripcion(puesto.descripcionpuesto); 
    setEstado(puesto.estadopuesto);
  };

  // Función para actualizar el puesto seleccionado
  const update = (event) => {
    event.preventDefault();
    if (selectedPuesto) {
      Axios.post("http://localhost:3001/puestos/update", {        
        descripcionpuesto: descripcionCargo,
        estadopuesto: estadoCargo,
        idpuesto: selectedPuesto
      })
      .then((response) => {
        obtener();
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: response.data.message || 'Puesto actualizado exitosamente',
          confirmButtonText: 'Aceptar',
          willClose: () => {
            window.location.reload();
          }
        });
      })
      .catch((error) => {
        console.error("Error al actualizar el puesto:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response ? error.response.data.message : 'Hubo un error al actualizar el puesto.',
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
      <div className={styles.ventana}>
        <div className={styles.separacion}></div>
        <h2 className={styles.titulo}>Catálogo Puesto/Cargo</h2><br/>

        <div className={styles.formulario}>
          <Form>
            <div className={styles.botones}>
              <Row className="mb-3">
                <Row className="mb-2" as={Col}>
                  <Col xs={10} md={1}>
                  <Button variant="outline-secondary" type="submit" onClick={update} disabled={!selectedPuesto}>
                    Actualizar
                  </Button>
                  </Col>
                  <Col xs={10} md={1}>
                    <Button variant="outline-danger" type="submit" onClick={eliminarPuesto} disabled={!selectedPuesto}>
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
              </Row>
            </div>

            <Row className="mb-3">
              <Form.Group as={Col} xs={12} md={10} controlId="formGridPassword">
                <Form.Label>Descripción Cargo</Form.Label>
                <Form.Control
                  onChange={(event) => setDescripcion(event.target.value)}
                  value={descripcionCargo}
                  placeholder="Descripción"
                />
              </Form.Group>

              <Col xs={12} md={2} className="d-flex align-items-end">
                <Button variant="outline-success" type="submit" onClick={add} style={{width: '150px'}}>
                  Agregar
                </Button>
              </Col>
            </Row>

            <div className="mb-3">
              <Form.Check
                type="checkbox"
                onChange={(event) => setEstado(event.target.checked ? 1 : 0)}
                checked={estadoCargo === 1}
                id="estado"
                label="Estado Cargo"
                disabled={!selectedPuesto}
              />
            </div>

            <div className={styles.tablaregistros} style={{ maxHeight: '340px', overflowY: 'scroll'}}>
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
                    puestosLista.length > 0 ? (
                      puestosLista.map((val, key) => (
                        <tr 
                          key={key} 
                          onDoubleClick={() => handleDoubleClick(val)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td style={{ color: selectedPuesto === val.idpuesto ? '#ff0000' : 'black', transition: 'color 0.3s ease' }}>
                            {val.idpuesto}
                          </td>
                          <td style={{ color: selectedPuesto === val.idpuesto ? '#ff0000' : 'black', transition: 'color 0.3s ease' }}>
                            {val.descripcionpuesto}
                          </td>
                          <td style={{ color: selectedPuesto === val.idpuesto ? '#ff0000' : 'black', transition: 'color 0.3s ease' }}>
                            {val.estadopuesto === 1 ? 'Activo' : 'Inactivo'}
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
    </div>
  );
}

export default CatCargo;
