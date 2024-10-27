import '../main/styles.css';
import styles from './AsignaTarea.module.css';
import {useState, useEffect} from "react"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import CloseButton from 'react-bootstrap/CloseButton';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate
import Axios from "axios";
import Swal from "sweetalert2";
import BuscarTarea from "./buscarTarea";// Importa useNavigate

function AsignaTarea() {

  const [idTarea,setidTarea] = useState("");
  // const [codProyecto,setCodProyecto] = useState("");
  const [CodEmpleado,setCodEmpleado] = useState("");
  const [descripcionTarea,setDescripcion] = useState("");
  const [horasTotales,setHorasTotales] = useState("");
  const [horasTrabajadas,setHorasTrabajadas] = useState("");
  const [estadoTarea,setEstado] = useState("");
  const [cumplimientoPorc,seteCumplimientoPorc] = useState("");

  const [tipoProyecto, setTipoProyecto] = useState([]);
  const [tipoProyectoSeleccionado, setTipoProyectoSelect] = useState("");
  const [tipoEmpleado, setTipoEmpleado] = useState([]);
  const [tipoEmpleadoSeleccionado, setTipoEmpleadoSelect] = useState("");
  // const [tipoEstado, setTipoEstado] = useState([]);
  const [tipoEstadoSeleccionado, setTipoEstadoSeleccionado] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [buttonsEnabled, setButtonsEnabled] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  const [isTareaDataSet, setIsTareaDataSet] = useState(false);


  const navigate = useNavigate(); 
  const irAlMenuInicio = () => {
    navigate('/'); 
  };

  // useEffect(() => {
  //   // console.log("Nuevo valor de CodEmpleado:", CodEmpleado);
  // }, [CodEmpleado]);

  // useEffect(() => {
  //   console.log("Nuevo valor de Proyecto:", tipoProyectoSeleccionado);
  // }, [CodEmpleado]);

  const add = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/asignartareas/create", {
      CodProyecto: tipoProyectoSeleccionado,
      CodTrabajador: tipoEmpleadoSeleccionado,
      DescripcionTarea: descripcionTarea,
      HorasTotales: horasTotales
    })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: response.data.message || "Tarea registrada exitosamente",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      })
      .catch((error) => {
        console.error("Error al registrar la tarea:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al registrar la tarea.",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      });
  };

  const eliminar = (event) => {
    event.preventDefault();
    if (idTarea) {
      Axios.post("http://localhost:3001/asignartareas/delete", {
        idTarea: idTarea,
        CodProyecto: tipoProyectoSeleccionado
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

  const update = (event) => {
    console.log("CodTrabajador (Empleado Seleccionado):", tipoEmpleadoSeleccionado);
    event.preventDefault();
    Axios.post("http://localhost:3001/asignartareas/update", {
      idTarea: idTarea,
      CodProyecto: tipoProyectoSeleccionado,
      CodTrabajador: tipoEmpleadoSeleccionado,
      DescripcionTarea: descripcionTarea,
      HorasTrabajo: horasTrabajadas,
      CodEstadoTarea: tipoEstadoSeleccionado,
      PorcentajeCumplimiento: cumplimientoPorc,
      HorasTotales: horasTotales
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

  const obtenerProyectos = () => {
    Axios.get("http://localhost:3001/proyectos/get")
      .then((response) => {
        setTipoProyecto(response.data);

        const idABuscar = tipoProyectoSeleccionado;
        if (!idABuscar || idABuscar < 1) {
          return;
        }

        const existeTipo = response.data.find(
          (tipo) => tipo.idProyecto === idABuscar
        );
        if (existeTipo) {
          setTipoProyectoSelect(existeTipo.idProyecto);
        } else {
          setTipoProyectoSelect("");
        }
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

  // const obtenerEstadosTarea = () => {
  //   Axios.get("http://localhost:3001/estadosproyectos/getestadotarea")
  //     .then((response) => {
  //       setTipoEstado(response.data);

  //       const idABuscar = tipoEstadoSeleccionado;
  //       if (!idABuscar || idABuscar < 1) {
  //         return;
  //       }

  //       const existeTipo = response.data.find(
  //         (tipo) => tipo.idEstadoProyecto === idABuscar
  //       );
  //       if (existeTipo) {
  //         setTipoEstadoSeleccionado(existeTipo.idEstadoProyecto);
  //       } else {
  //         setTipoEstadoSeleccionado("");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error al obtener los estados:", error);
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: error.response
  //           ? error.response.data.message
  //           : "Hubo un error al obtener los estados.",
  //         confirmButtonText: "Aceptar",
  //       });
  //     });
  // };

  // useEffect(() => {
  //   obtenerEstadosTarea();
  // }, []);

  const handleProyectoChange = (event) => {
    const idProyecto = event.target.value;
    setTipoProyectoSelect(idProyecto);
    if (idProyecto) {
      obtenerEmpleados(idProyecto); // Pasa el idProyecto correcto aquí
    }
  };

  const obtenerEmpleados = (idProyecto) => {
    Axios.get(`http://localhost:3001/asignarecursos/get?CodProyecto=${idProyecto}`)
    // Axios.get(`http://localhost:3001/empleados/getid?idTrabajador=${CodEmpleado}`)
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
          setTipoEmpleadoSelect(existeTipo.idTrabajador);
        } else {
          setTipoEmpleadoSelect("");
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

  // useEffect(() => {
  //   obtenerEmpleados();
  // }, []);

  const obtenerRecursosTareas = (id) => {
    // console.log(id);
    // console.log("Empleado seleccionado:", tipoEmpleadoSeleccionado);
    // console.log("Lista de empleados:", tipoEmpleado);
    Axios.get(`http://localhost:3001/empleados/getid?idTrabajador=${id}`)
      .then((response) => {
        console.log("resultados",response.data); // Añade esta línea
  setTipoEmpleado(response.data);
        // console.log("Empleado seleccionado:", tipoEmpleado);
  
        const idABuscar = tipoEmpleadoSeleccionado;
        if (!idABuscar || idABuscar < 1) {
          return;
        }
  
        const existeTipo = response.data.find(
          (tipo) => tipo.CodTrabajador === idABuscar
        );
        if (existeTipo) {
          setTipoEmpleadoSelect(existeTipo.CodTrabajador);
          // console.log("Empleado seleccionado:", existeTipo.CodTrabajador);
          // console.log("Lista de empleados:", tipoEmpleado);
        } else {
          setTipoEmpleadoSelect("");
        }
        // console.log("Empleado seleccionado:", tipoEmpleadoSeleccionado);
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

  return (
    <div className="operaciones">
      <BuscarTarea
        showModal={showModal}
        toggleModal={toggleModal}
        setTareaData={(data) => {
          setidTarea(data.idTarea);
          setTipoProyectoSelect(data.CodProyecto);
          setTipoEmpleadoSelect(data.CodTrabajador);
          // setCodEmpleado(data.CodTrabajador);
          setDescripcion(data.DescripcionTarea);
          setHorasTotales(data.HorasTotales);
          setHorasTrabajadas(data.HorasTrabajo);
          seteCumplimientoPorc(data.PorcentajeCumplimiento);
          setEstado(data.DescripcionEstado);
          setButtonsEnabled(true);

          setIsTareaDataSet(true);
          obtenerRecursosTareas(data.CodTrabajador);
        }}
        setButtonsEnabled={setButtonsEnabled}
      />
      <div className={styles.separacion}></div>
      <h2 className={styles.titulo} >Asginación Tareas</h2><br/>
      <div className={styles.formulario}>
        <Form>
          <Row className="mb-3">
          <Row className="mb-2" as={Col}>
     <Col xs={12} md={1} >
        <Button variant="outline-success" type="submit" onClick={add} disabled={buttonsEnabled}>
          Guardar
        </Button>
      </Col>
      <Col xs={12} md={1} >
        <Button variant="outline-secondary" type="submit" onClick={update} disabled={!buttonsEnabled}>
          Actualizar
        </Button>
      </Col>

      <Col xs={12} md={1} >
        <Button variant="outline-danger" type="submit" onClick={eliminar} disabled={!buttonsEnabled}>
          Eliminar
        </Button>
      </Col>
      <Col xs={12} md={1} >
        <Button variant="outline-light" onClick={toggleModal}>
          Buscar
        </Button>
      </Col>
    </Row>
          <Col xs="auto" className="ml-auto">
            <CloseButton onClick={irAlMenuInicio} />
          </Col>
          </Row>
          <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>Proyecto</Form.Label>
            <Form.Select value={tipoProyectoSeleccionado} 
            onChange={handleProyectoChange}
            disabled={buttonsEnabled}>
              <option>Selecciona...</option>
              {tipoProyecto.map((tipo) => (
                <option key={tipo.idProyecto} value={tipo.idProyecto}>
                  {tipo.NombreProyecto}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Empleado</Form.Label>
              <Form.Select
                value={tipoEmpleadoSeleccionado}
                onChange={(event) => {
                  const value = event.target.value;
                  setTipoEmpleadoSelect(value);
                }}
              >
                <option>Selecciona...</option>
                {tipoEmpleado.map((tipo) => {
                  if (isTareaDataSet){
                    return (
                      <option key={tipo.idTrabajador} value={tipo.idTrabajador}>
                        {tipo.NombreTrabajador}
                      </option>
                    );
                  }else{
                    return (
                      <option key={tipo.CodTrabajador} value={tipo.CodTrabajador}>
                        {tipo.NombreTrabajador}
                      </option>
                    );
                  }

                })}
              </Form.Select>

            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} xs={12} md={2} controlId="formGridCity">
              <Form.Label>IdTarea</Form.Label>
              <Form.Control onChange={(event) => setidTarea(event.target.value)}               
              type="number" 
              value={idTarea}
              placeholder="0" 
              readOnly/>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={10} controlId="formGridCity">
              <Form.Label>Descripción Tarea</Form.Label>
              <Form.Control 
              onChange={(event) => setDescripcion(event.target.value)} 
              type="text" 
              value={descripcionTarea}
              placeholder="Detalla la tarea" 
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col}controlId="formGridCity">
              <Form.Label>Horas Totales</Form.Label>
              <Form.Control onChange={(event) => setHorasTotales(event.target.value)} 
              type="number" 
              value={horasTotales}
              placeholder="0.00" />
            </Form.Group>
            <Form.Group as={Col}ontrolId="formGridCity">
              <Form.Label>Horas Completadas</Form.Label>
              <Form.Control 
              onChange={(event) => setHorasTrabajadas(event.target.value)} 
              type="number" 
              value={horasTrabajadas}
              placeholder="0.00" readOnly/>
            </Form.Group>
            <Form.Group as={Col}ontrolId="formGridCity">
              <Form.Label>Porcentaje Trabajo</Form.Label>
              <Form.Control onChange={(event) => seteCumplimientoPorc(event.target.value)} 
              type="number" 
              value={cumplimientoPorc}
              placeholder="0%" readOnly/>
            </Form.Group>
          </Row>
          <Form.Group as={Col} xs={12} md={10} controlId="formGridCity">
              <Form.Label>Estado Tarea</Form.Label>
              <Form.Control 
              onChange={(event) => setTipoEstadoSeleccionado(event.target.value)} 
              type="text" 
              placeholder="Pendiente" 
              readOnly
              value={estadoTarea}
              />
            </Form.Group>
        </Form>
      </div>
    </div>
  );
}

export default AsignaTarea;
