import "../main/styles.css";
import styles from "./CatEstadosProy.module.css";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import CloseButton from "react-bootstrap/CloseButton";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import Axios from "axios";
import Swal from "sweetalert2";
import Table from "react-bootstrap/Table";

function CatEstadosProy() {
  const [DescripcionEstado, setDescripcion] = useState("");
  const [tiposEstado, setTiposEstado] = useState([]);
  const [estadoBool, setestado] = useState("0");
  const [selectedEstado, setSelectedEstado] = useState(null);
  const navigate = useNavigate();
  const [EstadoLista, setEstados] = useState([]);
  const [tipoEstadoSeleccionado, setTipoEstadoSeleccionado] = useState("");

  const irAlMenuInicio = () => {
    navigate("/");
  };

  const add = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/estadosproyectos/create", {
      DescripcionEstado: DescripcionEstado,
      TipoEstado: tipoEstadoSeleccionado, // Usa el estado que capturaste
    })
      .then((response) => {
        obtener();
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: response.data.message || "Estado registrado exitosamente",
          confirmButtonText: "Aceptar",
        });
      })
      .catch((error) => {
        console.error("Error al registrar el estado:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al registrar el estado.",
          confirmButtonText: "Aceptar",
          willClose: () => {
            window.location.reload();
          },
        });
      });
  };

  const obtener = () => {
    Axios.get("http://localhost:3001/estadosproyectos/get")
      .then((response) => {
        setEstados(response.data);
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
          willClose: () => {
            window.location.reload();
          },
        });
      });
  };

  const eliminar = (event) => {
    event.preventDefault();
    if (selectedEstado) {
      Axios.post("http://localhost:3001/estadosproyectos/delete", {
        idEstadoProyecto: selectedEstado,
      })
        .then((response) => {
          obtener();
          Swal.fire({
            icon: "success",
            title: "¡Eliminado!",
            text: response.data.message || "Estado eliminado exitosamente",
            confirmButtonText: "Aceptar",
            willClose: () => {
              window.location.reload();
            },
          });
        })
        .catch((error) => {
          console.error("Error al eliminar el tipo estado:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response
              ? error.response.data.message
              : "Hubo un error al eliminar el estado.",
            confirmButtonText: "Aceptar",
            willClose: () => {
              window.location.reload();
            },
          });
        });
    }
  };

  const handleDoubleClick = (estados) => {
    setSelectedEstado(estados.idEstadoProyecto);
    setDescripcion(estados.DescripcionEstado);
    setestado(estados.estadoBool);
    setTipoEstadoSeleccionado(estados.TipoEstado); // Asegúrate de que esto esté correcto
  };

  const update = (event) => {
    event.preventDefault();
    if (selectedEstado) {
      Axios.post("http://localhost:3001/estadosproyectos/update", {
        DescripcionEstado: DescripcionEstado,
        TipoEstado: tipoEstadoSeleccionado,
        estadoBool: estadoBool,
        idEstadoProyecto: selectedEstado,
      })
        .then((response) => {
          obtener();
          Swal.fire({
            icon: "success",
            title: "¡Actualizado!",
            text: response.data.message || "Estado actualizado exitosamente",
            confirmButtonText: "Aceptar",
            willClose: () => {
              window.location.reload();
            },
          });
        })
        .catch((error) => {
          console.error("Error al actualizar el estado:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response
              ? error.response.data.message
              : "Hubo un error al actualizar el estado.",
            confirmButtonText: "Aceptar",
            willClose: () => {
              window.location.reload();
            },
          });
        });
    }
  };

  const obtenerTiposEstado = () => {
    Axios.get("http://localhost:3001/tipoEstados/get")
      .then((response) => {
        setTiposEstado(response.data);

        const idABuscar = tipoEstadoSeleccionado; // El ID que busca
        // Verifica si el ID está vacío o es menor o igual a 1
        if (!idABuscar || idABuscar < 1) {
          // Si está vacío o es menor o igual a 1,  el combo box se cargará normalmente
          return;
        }

        // Si el ID es mayor a 1
        const existeTipo = response.data.find(
          (tipo) => tipo.idTipoEstado === idABuscar
        );
        if (existeTipo) {
          setTipoEstadoSeleccionado(existeTipo.idTipoEstado);
        } else {
          setTipoEstadoSeleccionado("");
        }
      })
      .catch((error) => {
        console.error("Error al obtener los tipos de estado:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response
            ? error.response.data.message
            : "Hubo un error al obtener los tipos de estado.",
          confirmButtonText: "Aceptar",
        });
      });
  };

  useEffect(() => {
    obtenerTiposEstado();
  }, []);

  return (
    <div className="catalogo">
      <div className={styles.separacion}></div>
      <h2 className={styles.titulo}>Catálogo Estados Proyecto</h2>
      <br />
      <div className={styles.formulario}>
        <Form>
          <div className={styles.botones}>
            {/* <Row className="mb-3"> */}
              <Row className="mb-2" as={Col}>
                <Col xs={10} md={1}>
                  <Button
                    variant="outline-secondary"
                    type="submit"
                    onClick={update}
                    disabled={!selectedEstado}
                  >
                    Actualizar
                  </Button>
                </Col>
                <Col xs={10} md={1}>
                  <Button
                    variant="outline-danger"
                    type="submit"
                    onClick={eliminar}
                    disabled={!selectedEstado}
                  >
                    Eliminar
                  </Button>
                </Col>
                <Col xs={10} md={1}>
                  <Button variant="outline-dark" onClick={obtener}>
                    Obtener
                  </Button>
                </Col>
              </Row>
              {/* <Col xs="auto" className="ml-auto">
                <CloseButton onClick={irAlMenuInicio} />
              </Col>
            </Row> */}
          </div>
          <Row className="mb-3">
            <Form.Group as={Col} xs={12} md={4} controlId="formGridPassword">
              <Form.Label>Descripción Estado</Form.Label>
              <Form.Control
                onChange={(event) => setDescripcion(event.target.value)}
                value={DescripcionEstado}
                placeholder="Descripción"
              />
            </Form.Group>
            <Form.Group as={Col} xs={12} md={5} controlId="formGridPassword">
              <Form.Label>Tipo Estado</Form.Label>
              <Form.Select
                value={tipoEstadoSeleccionado} // Este debe coincidir con el ID del tipo de estado seleccionado
                onChange={(event) =>
                  setTipoEstadoSeleccionado(event.target.value)
                }
              >
                <option>Selecciona...</option>
                {tiposEstado.map((tipo) => (
                  <option key={tipo.idTipoEstado} value={tipo.idTipoEstado}>
                    {tipo.DescripcionTipoEstado}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Col xs={12} md={2} className="d-flex align-items-end">
              <Button
                variant="outline-success"
                type="submit"
                onClick={add}
                style={{ width: "150px" }}
              >
                Agregar
              </Button>
            </Col>
          </Row>
          <div className="mb-3">
            <Form.Check
              type="checkbox"
              onChange={(event) => setestado(event.target.checked ? 1 : 0)}
              checked={estadoBool === 1}
              id="estado"
              label="Estado"
              disabled={!selectedEstado}
            />
          </div>

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
                <tr>
                  <th>#</th>
                  <th>Descripción</th>
                  <th>Tipo Estado</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {EstadoLista.length > 0 ? (
                  EstadoLista.map((val, key) => (
                    <tr
                      key={key}
                      onDoubleClick={() => handleDoubleClick(val)}
                      style={{ cursor: "pointer" }}
                    >
                      <td
                        style={{
                          color:
                            selectedEstado === val.idEstadoProyecto
                              ? "#ff0000"
                              : "black",
                          transition: "color 0.3s ease",
                        }}
                      >
                        {val.idEstadoProyecto}
                      </td>
                      <td
                        style={{
                          color:
                            selectedEstado === val.idEstadoProyecto
                              ? "#ff0000"
                              : "black",
                          transition: "color 0.3s ease",
                        }}
                      >
                        {val.DescripcionEstado}
                      </td>
                      <td
                        style={{
                          color:
                            selectedEstado === val.idEstadoProyecto
                              ? "#ff0000"
                              : "black",
                          transition: "color 0.3s ease",
                        }}
                      >
                        {val.DescTipoEstado}
                      </td>
                      <td
                        style={{
                          color:
                            selectedEstado === val.idEstadoProyecto
                              ? "#ff0000"
                              : "black",
                          transition: "color 0.3s ease",
                        }}
                      >
                        {val.estadoBool === 1 ? "Activo" : "Inactivo"}
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
        </Form>
      </div>
    </div>
  );
}

export default CatEstadosProy;
