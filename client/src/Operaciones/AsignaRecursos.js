import { useState, useEffect } from "react";
import styles from './AsignaRecursos.module.css';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import CloseButton from 'react-bootstrap/CloseButton';
import { useNavigate } from 'react-router-dom';
import Axios from "axios";
import Swal from "sweetalert2";
import Table from "react-bootstrap/Table";

function AsignacionRecursos() {
  const [tiempoTrabajo, setTiempoTrabajo] = useState("");
  const [remuneracion, setRemuneracion] = useState("");
  const [selectedAsignacion, setSelectedAsignacion] = useState(null);
  const [asignacionLista, setAsignacionLista] = useState([]);

  const [tipoEmpleado, setTipoEmpleado] = useState([]);
  const [tipoEmpleadoSeleccionado, setTipoEmpleadoSeleccionado] = useState("");
  const [tipoProyecto, setTipoProyecto] = useState([]);
  const [tipoProyectoSeleccionado, setTipoProyectoSeleccionado] = useState("");

  const navigate = useNavigate();

  const irAlMenuInicio = () => {
    navigate('/'); 
  };

  const add = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:3001/asignarecursos/create", {
      CodProyecto: tipoProyectoSeleccionado,
      CodTrabajador: tipoEmpleadoSeleccionado,
      TiempoTrabajo: tiempoTrabajo,
      RemuneracionProyecto: remuneracion
    })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: response.data.message || "Asignaciones actualizadas exitosamente",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
        // obtenerAsignacionesPorProyecto(tipoProyectoSeleccionado); 
      })
      .catch((error) => {
        Swal.fire("Error", error.response ? error.response.data.message : "Hubo un error al registrar la asignación.", "error");
      });
  };

  const eliminar = (event) => {
    event.preventDefault();
    if (selectedAsignacion) {
      Axios.post("http://localhost:3001/asignarecursos/delete", {
        CodProyecto: tipoProyectoSeleccionado,
        CodTrabajador: tipoEmpleadoSeleccionado
      })
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "¡Eliminado!",
            text: response.data.message || "Asignación eliminada exitosamente",
            confirmButtonText: "Aceptar",
            willClose: () => {
              window.location.reload();
            },
          });          // obtenerAsignacionesPorProyecto(tipoProyectoSeleccionado); // Cargar las asignaciones nuevamente
        })
        .catch((error) => {
          Swal.fire("Error", error.response ? error.response.data.message : "Hubo un error al eliminar la asignación.", "error");
        });
    }
  };

  const obtenetEmpleados = () => {
    Axios.get("http://localhost:3001/empleados/get")
      .then((response) => {
        setTipoEmpleado(response.data);

        const idABuscar = tipoEmpleadoSeleccionado;
        if (!idABuscar || idABuscar < 1) {
          return;
        }

        const existeTipo = response.data.find(
          (tipo) => tipo.idTrabajador === idABuscar
        );
        if (existeTipo) {
          setTipoEmpleadoSeleccionado(existeTipo.idTrabajador);
        } else {
          setTipoEmpleadoSeleccionado("");
        }
      })
      .catch((error) => {
        console.error("Error al obtener los empleados:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al obtener los empleados.",
          confirmButtonText: "Aceptar",
        });
      });
  };

  useEffect(() => {
    obtenetEmpleados();
  }, []);

  const obtenerProyectos = () => {
    Axios.get("http://localhost:3001/proyectos/get")
      .then((response) => setTipoProyecto(response.data))
      .catch((error) => {
        Swal.fire("Error", "Hubo un error al obtener los proyectos.", "error");
      });
  };

  const obtenerAsignacionesPorProyecto = (idProyecto) => {
    Axios.get(`http://localhost:3001/asignarecursos/get?CodProyecto=${idProyecto}`)
      .then((response) => setAsignacionLista(response.data))
      .catch((error) => {
        Swal.fire("Error", "Hubo un error al obtener las asignaciones.", "error");
      });
  };

  useEffect(() => {
    obtenerProyectos();
  }, []);

  const handleProyectoChange = (event) => {
    const idProyecto = event.target.value;
    setTipoProyectoSeleccionado(idProyecto);
    obtenerAsignacionesPorProyecto(idProyecto);
  };

  const handleDoubleClick = (asignacion) => {
    setTipoProyectoSeleccionado(asignacion.CodProyecto);
    setTipoEmpleadoSeleccionado(asignacion.CodTrabajador);
    setTiempoTrabajo(asignacion.TiempoTrabajo);
    setRemuneracion(asignacion.RemuneracionProyecto);
    setSelectedAsignacion(asignacion.CodProyecto); // Mantén el valor seleccionado
  };

  return (
    <div className="operaciones">
      <h2 className={styles.titulo}>Asignación Recursos</h2><br/>
      <div className={styles.formulario}>
        <Form>
        <div className={styles.botones}>
            <Row className="mb-3">
              <Row className="mb-2" as={Col}>
                <Col xs={10} md={1}>
                  <Button
                    variant="outline-secondary"
                    type="submit"
                    onClick={add}
                  >
                    Asignar
                  </Button>
                </Col>
                <Col xs={10} md={1}>
                  <Button
                    variant="outline-danger"
                    type="submit"
                    onClick={eliminar}
                    disabled={!selectedAsignacion}
                  >
                    Desasignar
                  </Button>
                </Col>
              </Row>
              <Col xs="auto" className="ml-auto">
                <CloseButton onClick={irAlMenuInicio} />
              </Col>
            </Row>
          </div>
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>Proyecto</Form.Label>
            <Form.Select value={tipoProyectoSeleccionado} onChange={handleProyectoChange}>
              <option>Selecciona...</option>
              {tipoProyecto.map((tipo) => (
                <option key={tipo.idProyecto} value={tipo.idProyecto}>
                  {tipo.NombreProyecto}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>Porcentaje Recurso</Form.Label>
              <Form.Control onChange={(event) => setTiempoTrabajo(event.target.value)} 
              type="number" 
              placeholder="0%"
              value={tiempoTrabajo} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>Remuneración</Form.Label>
              <Form.Control onChange={(event) => setRemuneracion(event.target.value)} 
              type="number" 
              placeholder="0.00" 
              value={remuneracion}/>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Empleado</Form.Label>
              <Form.Select
                  value={tipoEmpleadoSeleccionado}
                  onChange={(event) => setTipoEmpleadoSeleccionado(event.target.value)}
              >
                <option>Selecciona...</option>
                {tipoEmpleado.map((tipo) => (
                  <option key={tipo.idTrabajador} value={tipo.idTrabajador}>
                    {tipo.NombreTrabajador}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Col>
              <h5>Asignaciones</h5>
              <div
            className={styles.tablaregistros}
            style={{ maxHeight: "340px", overflowY: "scroll" }}
          >
            <Table bordered size="sm">
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#f8f9fa",
                }}
              >
              </thead>
              <tbody>
                {asignacionLista.length > 0 ? (
                  asignacionLista.map((val, key) => (
                    <tr
                      key={key}
                      onDoubleClick={() => handleDoubleClick(val)}
                      style={{ cursor: "pointer" }}
                    >
                      <td
                        style={{
                          color:
                            selectedAsignacion === val.CodTrabajador
                              ? "#ff0000"
                              : "black",
                          transition: "color 0.3s ease",
                        }}
                      >
                        {val.NombreTrabajador}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4"></td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default AsignacionRecursos;
