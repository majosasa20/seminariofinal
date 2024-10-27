import "../main/styles.css";
import styles from "./CatCliente.module.css";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import CloseButton from "react-bootstrap/CloseButton";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import Axios from "axios";
import Swal from "sweetalert2";
import BuscarCliente from "./buscarCliente"; // Asegúrate de ajustar la ruta según la ubicación del archivo

function CatCliente() {
  const [idCliente, setIdCliente] = useState("0");
  const [NombreCompleto, setNombreCompleto] = useState("");
  // const [CodTipoIdentificacion,setTipoIdentif] = useState("0");
  const [NumIdentificacion, setNumIdenti] = useState("");
  const [Direccion, setDireccion] = useState("");
  const [NombreComercial, setNombreComercial] = useState("");
  const [Estado, setEstado] = useState("0");
  const [Telefono, setTelefono] = useState("0");
  const navigate = useNavigate();

  const [tipoDocumento, setTipoDocumento] = useState([]);
  const [tipoDocumentoSeleccionado, settipoDocumentoSeleccionado] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [buttonsEnabled, setButtonsEnabled] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  // const irAlMenuInicio = () => {
  //   navigate("/");
  // };

  const add = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/clientes/create", {
      idCliente: idCliente,
      NombreCliente: NombreCompleto,
      CodTipoIdentificacion: tipoDocumentoSeleccionado,
      NumIdentificacion: NumIdentificacion,
      DireccionCliente: Direccion,
      NombreComercial: NombreComercial,
      TelefonoCliente: Telefono, // Usa el estado que capturaste
    })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: response.data.message || "Cliente registrado exitosamente",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      })
      .catch((error) => {
        console.error("Error al registrar el cliente:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al registrar el cliente.",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      });
  };

  const eliminar = (event) => {
    event.preventDefault();
    if (idCliente) {
      Axios.post("http://localhost:3001/clientes/delete", {
        idCliente: idCliente,
      })
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "¡Eliminado!",
            text: response.data.message || "Cliente eliminado exitosamente",
            confirmButtonText: "Aceptar",
            willClose: () => {
              window.location.reload();
            },
          });
        })
        .catch((error) => {
          console.error("Error al eliminar el cliente:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response
              ? error.response.data.message
              : "Hubo un error al eliminar el cliente.",
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
    Axios.post("http://localhost:3001/clientes/update", {
      idCliente: idCliente,
      NombreCliente: NombreCompleto,
      CodTipoIdentificacion: tipoDocumentoSeleccionado,
      NumIdentificacion: NumIdentificacion,
      DireccionCliente: Direccion,
      NombreComercial: NombreComercial,
      TelefonoCliente: Telefono,
      EstadoCliente: Estado,
    })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: response.data.message || "Cliente actualizado exitosamente",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      })
      .catch((error) => {
        console.error("Error al actualizar el cliente:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al actualizar el cliente.",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      });
  };

  const obtenerTipoDocumento = () => {
    Axios.get("http://localhost:3001/documentos/getdocumento")
      .then((response) => {
        setTipoDocumento(response.data);

        const idABuscar = tipoDocumentoSeleccionado;
        if (!idABuscar || idABuscar < 1) {
          return;
        }

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
      <BuscarCliente
        showModal={showModal}
        toggleModal={toggleModal}
        setClienteData={(data) => {
          setIdCliente(data.idCliente);
          setNombreCompleto(data.NombreCliente);
          setTelefono(data.TelefonoCliente);
          setDireccion(data.DireccionCliente);
          settipoDocumentoSeleccionado(data.CodTipoIdentificacion);
          setNumIdenti(data.NumIdentificacion);
          setNombreComercial(data.NombreComercial);
          setEstado(data.EstadoCliente);
          setButtonsEnabled(true); // Habilitar botones al seleccionar un empleado
        }}
        setButtonsEnabled={setButtonsEnabled}
      />
      <div className={styles.separacion}></div>
      <h2 className={styles.titulo}>Catálogo Clientes</h2>
      <br />

      <div className={styles.formulario}>
        <Form>
          <Row className="mb-3">
            <Row className="mb-2" as={Col}>
              <Col xs={10} md={1}>
                <Button variant="outline-success" type="submit" onClick={add}>
                  Guardar
                </Button>
              </Col>
              <Col xs={10} md={1}>
                <Button
                  variant="outline-secondary"
                  type="submit"
                  onClick={update}
                  disabled={!buttonsEnabled}
                >
                  Actualizar
                </Button>
              </Col>

              <Col xs={10} md={1}>
                <Button
                  variant="outline-danger"
                  type="submit"
                  onClick={eliminar}
                  disabled={!buttonsEnabled}
                >
                  Eliminar
                </Button>
              </Col>
              <Col xs={10} md={1}>
                <Button
                  variant="outline-light"
                  onClick={toggleModal}
                >
                  Buscar
                </Button>
              </Col>
            </Row>
            {/* <Col xs="auto" className="ml-auto">
              <CloseButton onClick={irAlMenuInicio} />
            </Col> */}
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} xs={12} md={2} controlId="formGridEmail">
              <Form.Label>Código Cliente</Form.Label>
              <Form.Control value={idCliente} readOnly placeholder="id" />
            </Form.Group>

            <Form.Group as={Col} xs={12} md={10} controlId="formGridPassword">
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
              placeholder="Z1 Ciudad"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGridAddress2">
            <Form.Label>Nombre Comercial</Form.Label>
            <Form.Control
              onChange={(event) => {
                setNombreComercial(event.target.value);
              }}
              value={NombreComercial}
              placeholder="Nombre Comercial"
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setTelefono(event.target.value);
                }}
                value={Telefono}
                type="number"
                placeholder="Teléfono"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Tipo Documento</Form.Label>
              <Form.Select
                value={tipoDocumentoSeleccionado}
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
                onChange={(event) => {
                  setNumIdenti(event.target.value);
                }}
                value={NumIdentificacion}
                placeholder="No. Docto."
              />
            </Form.Group>
          </Row>

          <div className="mb-3">
            <Form.Check
              type="checkbox"
              onChange={(event) => setEstado(event.target.checked ? 1 : 0)}
              checked={Estado === 1}
              // value={Estado}
              id="estado"
              label="Estado Cliente"
              disabled={!buttonsEnabled}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}

export default CatCliente;
