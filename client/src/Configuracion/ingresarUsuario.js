import "../main/styles.css";
import styles from "./ingresarUsuario.module.css";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
// import CloseButton from "react-bootstrap/CloseButton";
// import { useNavigate } from "react-router-dom"; // Importa useNavigate
import Axios from "axios";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import BuscarUsuario from "./buscarUsuarios";

function IngresarUsuario() {
  const [idUsuario, setIdUsuario] = useState("0");
  const [NombreCompleto, setNombreCompleto] = useState("");
  const FechaActual = ( () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
      
        return `${day}-${month}-${year}`;
      })();
  
//   const [fechaAlta, setFechaAlta] = useState(() => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const day = String(today.getDate()).padStart(2, '0');
  
//     return `${year}-${month}-${day}`; // Formato YYYY-MM-DD
//   });
const [fechaAlta, setFechaAlta] = useState("");
  const [rolUAdmin, setAdministrador] = useState("0");
  const [correoUsuario, setCorreoUsuario] = useState("");
  const [Estado, setEstado] = useState("0");
  const [Telefono, setTelefono] = useState("0");
  const [contraseniaUser, setContraseniaUser] = useState("");
  const [fechaBaja, setFechaBaja] = useState("");
//   const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [buttonsEnabled, setButtonsEnabled] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  const [showPassword, setShowPassword] = useState(false);
  

  const handleMouseDown = () => {
    setShowPassword(true);
  };

  const handleMouseUp = () => {
    setShowPassword(false);
  };

  const rolUAdminToInsert = rolUAdmin === 0 ? "0" : rolUAdmin;
  console.log("Rol de Admin:", rolUAdminToInsert);

//   useEffect(() => {
//     if (buttonsEnabled) {
//       // Setea la fecha actual al abrir el modal
//       const today = new Date();
//       const year = today.getFullYear();
//       const month = String(today.getMonth() + 1).padStart(2, '0');
//       const day = String(today.getDate()).padStart(2, '0');
//       setFechaAlta(`${year}-${month}-${day}`);
//     }
//   }, [buttonsEnabled]);


  

  const add = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:3001/ingresaUsuario/create", {
      NombreCompleto: NombreCompleto,
      fechaAlta: fechaAlta,
      rolUAdmin: rolUAdminToInsert,
      correoUsuario: correoUsuario,
      TelefonoUsuario: Telefono,
      contraseniaUser: contraseniaUser,
    })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: response.data.message || "Usuario registrado exitosamente",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      })
      .catch((error) => {
        console.error("Error al registrar el Usuario:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al registrar el usuario.",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      });
  };

//   const eliminar = (event) => {
//     event.preventDefault();
//     if (idUsuario) {
//       Axios.post("http://localhost:3001/ingresaUsuario/delete", {
//         idUsuario: idUsuario,
//       })
//         .then((response) => {
//           Swal.fire({
//             icon: "success",
//             title: "¡Eliminado!",
//             text: response.data.message || "Usuario eliminado exitosamente",
//             confirmButtonText: "Aceptar",
//             willClose: () => {
//               window.location.reload();
//             },
//           });
//         })
//         .catch((error) => {
//           console.error("Error al eliminar el usuario:", error);
//           Swal.fire({
//             icon: "error",
//             title: "Error",
//             text: error.response
//               ? error.response.data.message
//               : "Hubo un error al eliminar el usuario.",
//             confirmButtonText: "Aceptar",
//             willClose: () => {
//               window.location.reload();
//             },
//           });
//         });
//     }
//   };

  const update = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:3001/ingresaUsuario/update", {
        idUsuario: idUsuario,
        NombreCompleto: NombreCompleto,
        fechaAlta: fechaAlta,
        rolUAdmin: rolUAdmin,
        correoUsuario: correoUsuario,
        EstadoUsuario: Estado,
        TelefonoUsuario: Telefono,
        contraseniaUser: contraseniaUser,
        FechaBaja: fechaBaja,
    })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: response.data.message || "Usuario actualizado exitosamente",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      })
      .catch((error) => {
        console.error("Error al actualizar el usuario:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al actualizar el usuario.",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      });
  };

  return (
    <div className="configuracion">
        <BuscarUsuario
        showModal={showModal}
        toggleModal={toggleModal}
        setUsuarioData={(data) => {
            setIdUsuario(data.idUsuario);
            setNombreCompleto(data.NombreCompleto);
            setFechaAlta(data.fechaAlta);
            setAdministrador(data.rolUAdmin);
            setCorreoUsuario(data.correoUsuario);
            setEstado(data.EstadoUsuario);
            setTelefono(data.TelefonoUsuario);
            setContraseniaUser(data.contraseniaUser);
            setFechaBaja(data.FechaBaja);
            setButtonsEnabled(true);
        }}
        setButtonsEnabled={setButtonsEnabled}
        />
      <div className={styles.separacion}></div>
      <h2 className={styles.titulo}>Ingresar Usuario</h2>
      <br />

      <div className={styles.formulario}>
        <Form>
          <Row className="mb-2" as={Col}>
            <Col xs={10} md={1}>
              <Button variant="outline-success" type="submit" onClick={add} disabled={buttonsEnabled}>
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

            {/* <Col xs={10} md={1}>
              <Button
                variant="outline-danger"
                type="submit"
                onClick={eliminar}
                disabled={!buttonsEnabled}
              >
                Eliminar
              </Button>
            </Col> */}
            <Col xs={10} md={1}>
              <Button variant="outline-light" onClick={toggleModal}>
                Buscar
              </Button>
            </Col>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} xs={12} md={2}>
              <Form.Label>Código Usuario</Form.Label>
              <Form.Control value={idUsuario} readOnly placeholder="id" />
            </Form.Group>

            <Form.Group as={Col} xs={12} md={6}>
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setNombreCompleto(event.target.value);
                }}
                value={NombreCompleto}
                placeholder="Nombre Completo"
              />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={2} >
              <Form.Label>Fecha Alta</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setFechaAlta(event.target.value);
                }}
                value={fechaAlta}
                readOnly
                placeholder={FechaActual}
              />
            </Form.Group>

            <Col xs={12} md={2}>
              <Form.Group as={Row} className="align-items-center">
                <Form.Check
                  type="checkbox"
                  onChange={(event) => setAdministrador(event.target.checked ? 1 : 0)}
                  checked={rolUAdmin === 1}
                  id="rolUAdmin"
                  label="Administrador"
                />
              </Form.Group>
              <br></br>
              <Form.Group as={Row} className="align-items-center">
                <Form.Check
                  type="checkbox"
                  onChange={(event) => setEstado(event.target.checked ? 1 : 0)}
                  checked={Estado === 1}
                  id="estadoUsuario"
                  label="Estado Usuario"
                  disabled={!buttonsEnabled}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} xs={12} md={4} controlId="formGridEmail">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setCorreoUsuario(event.target.value);
                }}
                value={correoUsuario}
                placeholder="tuemail@gmail.com"
              />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={3} controlId="formGridPassword">
      <Form.Label>Contraseña</Form.Label>
      <div style={{ position: "relative" }}>
        <Form.Control
          type={showPassword ? "text" : "password"}
          onChange={(event) => setContraseniaUser(event.target.value)}
          value={contraseniaUser}
          placeholder="*******"
        />
        <span
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp} 
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>
    </Form.Group>
            <Form.Group as={Col} xs={12} md={3} >
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setTelefono(event.target.value);
                }}
                type="number"
                value={Telefono}
                placeholder="###"
              />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={2} >
              <Form.Label>Fecha Baja</Form.Label>
              <Form.Control
                onChange={(event) => {
                  setFechaBaja(event.target.value);
                }}
                value={fechaBaja}
                readOnly
                placeholder="31-12-9999"
              />
            </Form.Group>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default IngresarUsuario;
