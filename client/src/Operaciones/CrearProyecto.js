import '../main/styles.css';
import styles from './CrearProyecto.module.css';
import {useState, useEffect} from "react"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import CloseButton from 'react-bootstrap/CloseButton';
import { useNavigate } from 'react-router-dom';  
import Axios from "axios";
import Swal from "sweetalert2";
import BuscarProyecto from "./buscarProyecto";// Importa useNavigate


function CrearProyecto() {

  const [idProyecto,setidProyecto] = useState("0");
  const [nombreProyecto,setNombreProyecto] = useState("");
  const [fechaCreacion, setfechaCreacion] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  });  
  const [fechaInicio,setfechaInicio] = useState("");
  const [fechaFin,setfechaFin] = useState("");
  // const [codCliente,setCodcliente] = useState("0");
  const [descripcionProyecto,setDescripcion] = useState("");
  // const [estadoProyecto,setEstado] = useState("");
  const [horasTrabajo,setHorasTrabajo] = useState("0.00");
  const [costoProyecto,setcostoProyecto] = useState("0.00");
  const [totalProyecto,setTotalProyecto] = useState("0.00");
  const navigate = useNavigate(); 

  const [tipoEstado, setTipoEstado] = useState([]);
  const [tipoEstadoSeleccionado, setTipoEstadoSeleccionado] = useState("");
  const [tipoCliente, setTipoCliente] = useState([]);
  const [tipoClienteSeleccionado, setTipoClienteSeleccionado] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [buttonsEnabled, setButtonsEnabled] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`; // Convierte a DD-MM-YYYY
  };
  

  const irAlMenuInicio = () => {
    navigate('/'); 
  };

  const add = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/proyectos/create", {
      // idProyecto: idProyecto,
      NombreProyecto: nombreProyecto,
      FechaCreacion: fechaCreacion,
      FechaInicio: fechaInicio,
      FechaFin: fechaFin,
      CodClienteProyecto: tipoClienteSeleccionado,
      CodEstadoProyecto: tipoEstadoSeleccionado,
      HorasTrabajo: horasTrabajo,
      CostoProyecto: costoProyecto,
      TotalProyecto: totalProyecto,
      DescripcionProyecto: descripcionProyecto,
    })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: response.data.message || "Proyecto registrado exitosamente",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      })
      .catch((error) => {
        console.error("Error al registrar el proyecto:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al registrar el proyecto.",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      });
  };

  const eliminar = (event) => {
    event.preventDefault();
    if (idProyecto) {
      Axios.post("http://localhost:3001/proyectos/delete", {
        idProyecto: idProyecto,
      })
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "¡Eliminado!",
            text: response.data.message || "Proyecto eliminado exitosamente",
            confirmButtonText: "Aceptar",
            willClose: () => {
              window.location.reload();
            },
          });
        })
        .catch((error) => {
          console.error("Error al eliminar el proyecto:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response
              ? error.response.data.message
              : "Hubo un error al eliminar el proyecto.",
            confirmButtonText: "Aceptar",
            willClose: () => {
              window.location.reload();
            },
          });
        });
    }
  };

  const update = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:3001/proyectos/update", {
      idProyecto: idProyecto,
      NombreProyecto: nombreProyecto,
      FechaCreacion: fechaCreacion,
      FechaInicio: fechaInicio,
      FechaFin: fechaFin,
      CodClienteProyecto: tipoClienteSeleccionado,
      CodEstadoProyecto: tipoEstadoSeleccionado,
      HorasTrabajo: horasTrabajo,
      CostoProyecto: costoProyecto,
      TotalProyecto: totalProyecto,
      DescripcionProyecto: descripcionProyecto,
    })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: response.data.message || "Proyecto actualizado exitosamente",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      })
      .catch((error) => {
        console.error("Error al actualizar el proyecto:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al actualizar el proyecto.",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      });
  };

  const obtenerEstadosProyecto = () => {
    Axios.get("http://localhost:3001/estadosproyectos/getestadoproyecto")
      .then((response) => {
        setTipoEstado(response.data);

        const idABuscar = tipoEstadoSeleccionado;
        if (!idABuscar || idABuscar < 1) {
          return;
        }

        const existeTipo = response.data.find(
          (tipo) => tipo.idEstadoProyecto === idABuscar
        );
        if (existeTipo) {
          setTipoEstadoSeleccionado(existeTipo.idEstadoProyecto);
        } else {
          setTipoEstadoSeleccionado("");
        }
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
    obtenerEstadosProyecto();
  }, []);

  const obtenerClientes = () => {
    Axios.get("http://localhost:3001/clientes/get")
      .then((response) => {
        setTipoCliente(response.data);

        const idABuscar = tipoClienteSeleccionado;
        if (!idABuscar || idABuscar < 1) {
          return;
        }

        const existeTipo = response.data.find(
          (tipo) => tipo.idCliente === idABuscar
        );
        if (existeTipo) {
          setTipoClienteSeleccionado(existeTipo.idCliente);
        } else {
          setTipoClienteSeleccionado("");
        }
      })
      .catch((error) => {
        console.error("Error al obtener los clientes:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al obtener los clientes.",
          confirmButtonText: "Aceptar",
        });
      });
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  return (
    <div className="operaciones">
      <BuscarProyecto
        showModal={showModal}
        toggleModal={toggleModal}
        setProyectoData={(data) => {
          setidProyecto(data.idProyecto);
          setNombreProyecto(data.NombreProyecto);
          setfechaCreacion(formatDate(data.FechaCreacion));
          setfechaInicio(formatDate(data.FechaInicio));
          setfechaFin(formatDate(data.FechaFin));
          setTipoClienteSeleccionado(data.CodClienteProyecto);
          setTipoEstadoSeleccionado(data.CodEstadoProyecto);
          setHorasTrabajo(data.HorasTrabajo);
          setcostoProyecto(data.CostoProyecto);
          setTotalProyecto(data.TotalProyecto);
          setDescripcion(data.DescripcionProyecto);
          setButtonsEnabled(true);
        }}
        setButtonsEnabled={setButtonsEnabled}
      />

      <div className={styles.separacion}></div>
      <h2 className={styles.titulo} >Creación Proyectos</h2><br/>
      <div className={styles.formulario}>
     <Form>
     <Row className="mb-3">
     <Row className="mb-2" as={Col}>
     <Col xs={12} md={1} >
        <Button variant="outline-success" type="submit" onClick={add}>
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
        <Form.Group as={Col} xs={12} md={2} >
          <Form.Label>No.Proyecto</Form.Label>
          <Form.Control value={idProyecto} readOnly placeholder="id"/>
        </Form.Group>

        <Form.Group as={Col} xs={12} md={10} >
          <Form.Label>Nombre Proyecto</Form.Label>
          <Form.Control onChange={(event)=>{setNombreProyecto(event.target.value);
          }} 
          value={nombreProyecto}
          placeholder="Nombre Proyecto" />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" >
        <Form.Label>Descripción Proyecto</Form.Label>
        <Form.Control onChange={(event)=>{setDescripcion(event.target.value);
          }} 
          value={descripcionProyecto}
          placeholder="Descripción" />
      </Form.Group>

      <Row className="mb-3">
        <Form.Group as={Col} xs={12} md={6} >
          <Form.Label>Cliente</Form.Label>
          <Form.Select
                value={tipoClienteSeleccionado}
                onChange={(event) =>
                  setTipoClienteSeleccionado(event.target.value)
                }
              >
                <option>Selecciona...</option>
                {tipoCliente.map((tipo) => (
                  <option
                    key={tipo.idCliente}
                    value={tipo.idCliente}
                  >
                    {tipo.NombreCliente}
                  </option>
                ))}
              </Form.Select>
        </Form.Group>
        <Form.Group as={Col} xs={12} md={2} >
          <Form.Label>Horas Trabajo</Form.Label>
          <Form.Control onChange={(event)=>{setHorasTrabajo(event.target.value);
          }}           
          value={horasTrabajo}
          placeholder="0.00" 
          readOnly
           />
        </Form.Group>
        <Form.Group as={Col} xs={12} md={2} >
          <Form.Label>Costo Proyecto</Form.Label>
          <Form.Control onChange={(event)=>{setcostoProyecto(event.target.value);
          }}           
          value={costoProyecto}
          placeholder="0.00" 
          readOnly
           />
        </Form.Group>
        <Form.Group as={Col} xs={12} md={2} >
          <Form.Label>Total Proyecto</Form.Label>
          <Form.Control onChange={(event)=>{setTotalProyecto(event.target.value);
          }}           
          value={totalProyecto}
          placeholder="0.00" 
          readOnly
           />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridCity">
          <Form.Label>Fecha Creación</Form.Label>
          <Form.Control 
            onChange={(event) => {
              setfechaCreacion(event.target.value);
            }} 
            value={fechaCreacion} 
            type="date" 
            placeholder="" 
            readOnly
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridCity">
          <Form.Label>Fecha Inicio</Form.Label>
          <Form.Control onChange={(event)=>{setfechaInicio(event.target.value);
          }} 
          value={fechaInicio}
          type="date" placeholder= "" />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridZip">
          <Form.Label>Fecha Fin</Form.Label>
          <Form.Control onChange={(event)=>{setfechaFin(event.target.value);
          }} 
          value={fechaFin}
          type="date" placeholder='Fecha Fin' />
        </Form.Group>
      </Row>

      <Form.Group as={Col} controlId="formGridState">
          <Form.Label>Estado Proyecto</Form.Label>
          <Form.Select
                value={tipoEstadoSeleccionado}
                onChange={(event) =>
                  setTipoEstadoSeleccionado(event.target.value)
                }
                disabled={!buttonsEnabled}
              >
                <option>Selecciona...</option>
                {tipoEstado.map((tipo) => (
                  <option
                    key={tipo.idEstadoProyecto}
                    value={tipo.idEstadoProyecto}
                  >
                    {tipo.DescripcionEstado}
                  </option>
                ))}
              </Form.Select>
        </Form.Group>    
    </Form>
     </div>
     
    </div>
  );
}

export default CrearProyecto;
