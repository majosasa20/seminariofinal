import '../main/styles.css';
import React, { useState, useEffect } from 'react';
import styles from './AdministraTareas.module.css';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import CloseButton from 'react-bootstrap/CloseButton';
import { useNavigate } from 'react-router-dom';
import Axios from "axios";
import Swal from "sweetalert2";

function AdministraTareas() {
  const [tipoProyecto, setTipoProyecto] = useState([]);
  const [tipoProyectoSeleccionado, setTipoProyectoSelect] = useState("");
  const [tipoEstado, setTipoEstado] = useState([]);
  const [tipoEstadoSeleccionado, setTipoEstadoSeleccionado] = useState("");
  const [tareas, setTareas] = useState([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  // Función para actualizar la tarea y determinar el estado basado en el porcentaje
  const handleInputChange = (index, event) => {
    const newTaskData = [...tareas];
    const newHorasTrabajadas = parseFloat(event.target.value) || 0;
  
    // Validación: solo permitir editar si el estado de la tarea no es 4 (cancelado)
    if (newTaskData[index].CodEstadoTarea !== 4) {
      // Actualiza las horas trabajadas y el porcentaje
      newTaskData[index].HorasTrabajo = newHorasTrabajadas; // Asegúrate de que el campo coincida con el nombre correcto
      newTaskData[index].PorcentajeCumplimiento = Math.min((newHorasTrabajadas / newTaskData[index].HorasTotales) * 100, 100);
  
      // Determina el estado en función del porcentaje
      if (newTaskData[index].PorcentajeCumplimiento === 0) {
        newTaskData[index].DescripcionEstado = 'PENDIENTE';
        newTaskData[index].CodEstadoTarea = 5;
      } else if (newTaskData[index].PorcentajeCumplimiento > 0 && newTaskData[index].PorcentajeCumplimiento < 100) {
        newTaskData[index].DescripcionEstado = 'EN CURSO';
        newTaskData[index].CodEstadoTarea = 6;
      } else if (newTaskData[index].PorcentajeCumplimiento === 100) {
        newTaskData[index].DescripcionEstado = 'FINALIZADA';
        newTaskData[index].CodEstadoTarea = 7;
      }

      setTareaSeleccionada(newTaskData[index]);

    } else {
      Swal.fire({
        icon: "warning",
        title: "Edición no permitida",
        text: "No puedes editar tareas con estado 'Cancelado'.",
        confirmButtonText: "Aceptar",
      });
    }
  
    setTareas(newTaskData); // Actualiza los datos de la tarea con los nuevos valores
  };
  

  const eliminar = (idTarea) => {
    if (idTarea) {
      Axios.post("http://localhost:3001/asignartareas/delete", {
        idTarea: idTarea,
        CodProyecto: tipoProyectoSeleccionado,
      })
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "¡Eliminado!",
            text: response.data.message || "Tarea eliminada exitosamente",
            confirmButtonText: "Aceptar",
            willClose: () => {
              window.location.reload();
            },
          });
        })
        .catch((error) => {
          console.error("Error al eliminar la tarea:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response
              ? error.response.data.message
              : "Hubo un error al eliminar la tarea.",
            confirmButtonText: "Aceptar",
            willClose: () => {
              window.location.reload();
            },
          });
        });
    }
  };

  const navigate = useNavigate();
  const irAlMenuInicio = () => {
    navigate('/');
  };

  const obtenerTareas = (idProyecto, CodEstadoTarea) => {
    // console.log(CodEstadoTarea);
    Axios.get(`http://localhost:3001/asignartareas/getTareasProyecto?CodProyecto=${idProyecto}&CodEstadoTarea=${CodEstadoTarea}`)
      .then((response) => { setTareas(response.data) })
      .catch((error) => console.error("Error al obtener tareas:", error));
  };

  const obtenerProyectos = () => {
    Axios.get("http://localhost:3001/proyectos/get")
      .then((response) => {
        setTipoProyecto(response.data);
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

  const obtenerEstadoTareas = () => {
    Axios.get("http://localhost:3001/estadosproyectos/getestadotarea")
      .then((response) => {
        setTipoEstado(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los estados:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al obtener los estados.",
          confirmButtonText: "Aceptar",
        });
      });
  };

  useEffect(() => {
    obtenerEstadoTareas();
  }, []);

  const handleEstadoChange = (event) => {
    const idEstado = event.target.value;
    setTipoEstadoSeleccionado(idEstado);
    if (tipoProyectoSeleccionado) {
      obtenerTareas(tipoProyectoSeleccionado, idEstado);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Cambia entre modo de edición y visualización
  };

  const update = (tarea) => {
    Axios.post("http://localhost:3001/asignartareas/actualizaHoras", {
      idTarea: tarea.idTarea,
      CodProyecto: tipoProyectoSeleccionado,
      HorasTrabajo: tarea.HorasTrabajo, // Obtén las horas actualizadas
      CodEstadoTarea: tarea.CodEstadoTarea, // Obtén el código de estado actualizado
      PorcentajeCumplimiento: tarea.PorcentajeCumplimiento, // Obtén el porcentaje actualizado
    })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: response.data.message || "Tarea actualizada exitosamente",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      })
      .catch((error) => {
        console.error("Error al actualizar la tarea:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al actualizar la tarea.",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      });
  };
  

  return (
    <div className="operaciones">
      <div className={styles.separacion}></div>
      <h2 className={styles.titulo}>Administración Tareas</h2><br />
      <div className={styles.formulario}>
        <Form>
          <Row className="mb-3">
            <Row className="mb-2" as={Col}>
              <Col xs={12} md={1}>
                <Button variant="outline-secondary"
                  type="button" onClick={handleEditToggle}>
                  {isEditing ? "Cancelar" : "Actualizar"}
                </Button>
              </Col>
              <Col xs={12} md={1}>
                <Button
                  variant="outline-success"
                  type="button" // Cambia a 'button' para evitar el envío de formularios
                  onClick={() => {
                    if (tareaSeleccionada) {
                      update(tareaSeleccionada);
                    }
                  }}
                  disabled={!isEditing}
                >
                  Guardar
                </Button>
              </Col>
              <Col xs={12} md={1}>
                <h5>Proyecto: </h5>
              </Col>
              <Col xs={12} md={5}>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Select value={tipoProyectoSeleccionado}
                    onChange={(event) => setTipoProyectoSelect(event.target.value)}>
                    <option>Selecciona ...</option>
                    {tipoProyecto.map((tipo) => (
                      <option key={tipo.idProyecto} value={tipo.idProyecto}>
                        {tipo.NombreProyecto}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={2} md={1}>
                <h5>Estado: </h5>
              </Col>
              <Col xs={12} md={2}>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Select
                    value={tipoEstadoSeleccionado}
                    onChange={handleEstadoChange}
                  >
                    <option value="">Selecciona ...</option>
                    <option value="0">TODOS</option>
                    {tipoEstado.map((tipo) => (
                      <option key={tipo.idEstadoProyecto} value={tipo.idEstadoProyecto}>
                        {tipo.DescripcionEstado}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Col xs="auto" className="ml-auto">
              <CloseButton onClick={irAlMenuInicio} />
            </Col>
          </Row>
        </Form>
        <br />
        <div className={styles.resultado}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>No.</th>
                <th>Tarea</th>
                <th>Recurso</th>
                <th>Horas Totales</th>
                <th>Horas Trabajo</th>
                <th>Porcentaje</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((tarea, index) => (
                <tr key={tarea.idTarea}>
                  <td>{tarea.NombreProyecto}</td>
                  <td>{tarea.idTarea}</td>
                  <td>{tarea.DescripcionTarea}</td>
                  <td>{tarea.NombreTrabajador}</td>
                  <td>{tarea.HorasTotales}</td>
                  <td>
                    {isEditing ? (
                      <Form.Control
                        type="number"
                        value={tarea.HorasTrabajo}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    ) : (
                      tarea.HorasTrabajo
                    )}
                  </td>
                  <td>{tarea.PorcentajeCumplimiento}%</td>
                  <td>{tarea.DescripcionEstado}</td>
                  <td>
                  {/* <Button variant="outline-danger" type="submit" onClick={eliminar} disabled={!isEditing}>
                    Eliminar
                  </Button> */}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => eliminar(tarea.idTarea)}
                      disabled={!isEditing}
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

export default AdministraTareas;
