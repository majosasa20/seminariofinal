import "../main/styles.css";
import styles from "./CatEmpleado.module.css";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import CloseButton from "react-bootstrap/CloseButton";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import Axios from "axios";
import Swal from "sweetalert2";
import BuscarEmpleado from './buscarEmpleado'; // Asegúrate de ajustar la ruta según la ubicación del archivo


function CatEmpleado() {
  const [idTrabajador, setIdEmpleado] = useState("0");
  const [NombreCompleto, setNombreCompleto] = useState("");
  // const [CodTipoIdentificacion, setTipoIdentif] = useState("0");
  const [NumIdentificacion, setNumIdenti] = useState("");
  const [Direccion, setDireccion] = useState("");
  // const [CodPuesto, setCodPuesto] = useState("");
  const [Estado, setEstado] = useState("0");
  const [Telefono, setTelefono] = useState("0");

  const [tipospuesto, setTiposPuesto] = useState([]);
  const [tipoDocumento, setTipoDocumento] = useState([]);
  // const [selectedPuesto, setSelectedPuesto] = useState(null);
  // const [selectedDocumento, setSelectedDocumento] = useState(null);
  // const [PuestoLista, setPuestos] = useState([]);
  const [tipoPuestoSeleccionado, setTipoPuestoSeleccionado] = useState("");
  // const [DocumentoLista, setDocumentos] = useState([]);
  const [tipoDocumentoSeleccionado, settipoDocumentoSeleccionado] = useState("");

  const [showModal, setShowModal] = useState(false);
  // const [empleadoData, setEmpleadoData] = useState({});
  const [buttonsEnabled, setButtonsEnabled] = useState(false);

// Función para abrir/cerrar modal
const toggleModal = () => setShowModal(!showModal);


  const navigate = useNavigate();
  const irAlMenuInicio = () => {
    navigate("/");
  };

  const add = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/empleados/create", {
      idTrabajador: idTrabajador,
      NombreTrabajador: NombreCompleto,
      CodTipoIdentificacion: tipoDocumentoSeleccionado,
      NumIdentificacion: NumIdentificacion,
      DireccionTrabajador: Direccion,
      CodPuestoTrabajador: tipoPuestoSeleccionado,
      TelefonoTrabajador: Telefono, // Usa el estado que capturaste
    })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: response.data.message || "Empleado registrado exitosamente",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      })
      .catch((error) => {
        console.error("Error al registrar el empleado:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al registrar el empleado.",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      });
  };

  const eliminar = (event) => {
    event.preventDefault();
    if (idTrabajador) {
      Axios.post("http://localhost:3001/empleados/delete", {
        idTrabajador: idTrabajador,
      })
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "¡Eliminado!",
            text: response.data.message || "Empleado eliminado exitosamente",
            confirmButtonText: "Aceptar",
            willClose: () => {
              window.location.reload();
            },
          });
        })
        .catch((error) => {
          console.error("Error al eliminar el empleado:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response
              ? error.response.data.message
              : "Hubo un error al eliminar el empleado.",
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
    Axios.post("http://localhost:3001/empleados/update", {
      idTrabajador: idTrabajador,
      NombreTrabajador: NombreCompleto,
      CodTipoIdentificacion: tipoDocumentoSeleccionado,
      NumIdentificacion: NumIdentificacion,
      DireccionTrabajador: Direccion,
      CodPuestoTrabajador: tipoPuestoSeleccionado,
      TelefonoTrabajador: Telefono,
      EstadoTrabajador: Estado,
    })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: response.data.message || "Empleado actualizado exitosamente",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      })
      .catch((error) => {
        console.error("Error al actualizar el Empleado:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al actualizar el Empleado.",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      });
  };

  const obtenerTipoPuesto = () => {
    Axios.get("http://localhost:3001/puestos/getpuesto")
      .then((response) => {
        setTiposPuesto(response.data);

        const idABuscar = tipoPuestoSeleccionado; // El ID que busca
        // Verifica si el ID está vacío o es menor o igual a 1
        if (!idABuscar || idABuscar < 1) {
          // Si está vacío o es menor o igual a 1,  el combo box se cargará normalmente
          return;
        }

        // Si el ID es mayor a 1
        const existeTipo = response.data.find(
          (tipo) => tipo.idpuesto === idABuscar
        );
        if (existeTipo) {
          setTipoPuestoSeleccionado(existeTipo.idpuesto);
        } else {
          setTipoPuestoSeleccionado("");
        }
      })
      .catch((error) => {
        console.error("Error al obtener los puestos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al obtener los puestos.",
          confirmButtonText: "Aceptar",
        });
      });
  };

  useEffect(() => {
    obtenerTipoPuesto();
  }, []);

  const obtenerTipoDocumento = () => {
    Axios.get("http://localhost:3001/documentos/getdocumento")
      .then((response) => {
        setTipoDocumento(response.data);

        const idABuscar = tipoDocumentoSeleccionado; // El ID que busca
        // Verifica si el ID está vacío o es menor o igual a 1
        if (!idABuscar || idABuscar < 1) {
          // Si está vacío o es menor o igual a 1,  el combo box se cargará normalmente
          return;
        }

        // Si el ID es mayor a 1
        const existeTipo = response.data.find(
          (tipo) => tipo.id_tipoidentificacion === idABuscar
        );
        if (existeTipo) {
          settipoDocumentoSeleccionado(existeTipo.id_tipoidentificacion);
        } else {
          settipoDocumentoSeleccionado("");
        }
      })
      .catch((error) => {
        console.error("Error al obtener los tipos de documento:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al obtener los tipos de documento.",
          confirmButtonText: "Aceptar",
        });
      });
  };

  useEffect(() => {
    obtenerTipoDocumento();
  }, []);

  
  return (
    <div className="catalogo">
      <BuscarEmpleado
        showModal={showModal}
        toggleModal={toggleModal}
        setEmpleadoData={(data) => {
          setIdEmpleado(data.idTrabajador);
          setNombreCompleto(data.NombreTrabajador);
          setTelefono(data.TelefonoTrabajador);
          setDireccion(data.DireccionTrabajador);
          setTipoPuestoSeleccionado(data.CodPuestoTrabajador);
          settipoDocumentoSeleccionado(data.CodTipoIdentificacion);
          setNumIdenti(data.NumIdentificacion);
          setEstado(data.EstadoTrabajador);
          setButtonsEnabled(true); // Habilitar botones al seleccionar un empleado
        }}
        setButtonsEnabled={setButtonsEnabled}
      />
      <div className={styles.separacion}></div>
      <h2 className={styles.titulo}>Catálogo Empleados</h2>
      <br />
      <div className={styles.formulario}>
        <Form>
          <div className={styles.botones}>
            {/* <Row className="mb-3"> */}
              <Row className="mb-2" as={Col}>
                <Col xs={10} md={1}>
                  <Button variant="outline-success" type="submit" onClick={add}>
                    Guardar
                  </Button>
                </Col>
                <Col xs={10} md={1}>
                  <Button variant="outline-secondary" type="submit" onClick={update} disabled={!buttonsEnabled}>
                    Actualizar
                  </Button>
                </Col>
                <Col xs={10} md={1}>
                  <Button variant="outline-danger" type="submit" onClick={eliminar} disabled={!buttonsEnabled}>
                    Eliminar
                  </Button>
                </Col>
                <Col xs={10} md={1}>
                <Button variant="outline-light" onClick={toggleModal}>
                  Buscar
                </Button>

                </Col>
              </Row>
              {/* <Col xs="auto" className="ml-auto">
                <CloseButton onClick={irAlMenuInicio} />
              </Col>
            </Row> */}
          </div>

          <Row className="mb-3">
            <Form.Group as={Col} xs={12} md={3} controlId="formGridEmail">
              <Form.Label>Código Empleado</Form.Label>
              <Form.Control value={idTrabajador} readOnly placeholder="id" />
            </Form.Group>

            <Form.Group as={Col} xs={12} md={9} controlId="formGridPassword">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setNombreCompleto(event.target.value);
                }}
                value={NombreCompleto}
                placeholder="Nombre Completo"
              />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="formGridAddress1">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              onChange={(event) => {
                setDireccion(event.target.value);
              }}
              value={Direccion}
              placeholder="Zona 1 Ciudad"
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Puesto / Cargo</Form.Label>
              <Form.Select
                value={tipoPuestoSeleccionado} // Este debe coincidir con el ID del tipo de estado seleccionado
                onChange={(event) =>
                  setTipoPuestoSeleccionado(event.target.value)
                }
              >
                <option>Selecciona...</option>
                {tipospuesto.map((tipo) => (
                  <option key={tipo.idpuesto} value={tipo.idpuesto}>
                    {tipo.descripcionpuesto}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setTelefono(event.target.value.replace(/\D/g, ""));
                }}
                value={Telefono}
                type="number"
                placeholder="Teléfono"
                maxLength="15"
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Tipo Documento</Form.Label>
              <Form.Select
                value={tipoDocumentoSeleccionado} // Este debe coincidir con el ID del tipo de estado seleccionado
                onChange={(event) =>
                  settipoDocumentoSeleccionado(event.target.value)
                }
              >
                <option>Selecciona...</option>
                {tipoDocumento.map((tipo) => (
                  <option
                    key={tipo.id_tipoidentificacion}
                    value={tipo.id_tipoidentificacion}
                  >
                    {tipo.descripcionidentificacion}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridZip">
              <Form.Label>Número Documento</Form.Label>
              <Form.Control
                onChange={(event) => setNumIdenti(event.target.value)}
                value={NumIdentificacion}
                placeholder="No. Docto."
              />
            </Form.Group>

            <Col xs="auto" className="d-flex align-items-center">
              <Form.Group controlId="formGridZip">
                <Form.Check
                  type="checkbox"
                  onChange={(event) => setEstado(event.target.checked ? 1 : 0)}
                  checked={Estado === 1}
                  // value={Estado}
                  id="estado"
                  label="Estado Empleado"
                  disabled={!buttonsEnabled}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mb-3"></div>
        </Form>
      </div>
    </div>
  );
}

export default CatEmpleado;
