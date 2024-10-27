import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import { useAuth } from './authContext'; // Importa el contexto

function BasicExample() {
  const { logout, userInfo } = useAuth(); // Obtén la función de logout y userInfo del contexto

  const handleLogout = () => {
    logout(); // Llama a la función de logout
    window.location.href = '/login'; // Redirige a la página de inicio (opcional)
  };

  // Verifica si userInfo existe y luego verifica el rol
  const isAdmin = userInfo && userInfo.rolUAdmin === 1;
  console.log("result", userInfo ? userInfo.rolUAdmin : "No definido", isAdmin);

  return (
    <div className={styles.navbar}>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} to="/">ProyectosMS</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* Otras secciones del menú */}
              <NavDropdown title="Catálogos" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/catcliente">Catálogo Clientes</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/catempleado">Catálogo Trabajadores</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/catcargo">Catálogo Puestos/Función</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/catdoctoidenti">Catálogo Tipos Identificación</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/catestadosproy">Catálogo Estados Proyectos</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/cattipoestados">Catálogo Tipos Estados</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Operaciones" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/crearproyecto">Creación Proyectos</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/asignarecursos">Asignación Recursos</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/asignatarea">Asignación Tareas</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/administratarea">Administración Tareas</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Reportes" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/rptpruebaexito">Pruebas Exitosas</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/rptexcepciones">Excepciones</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/rptproyectos">Proyectos</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/rpthitos">Hitos</NavDropdown.Item>
              </NavDropdown>
              {/* Mostrar el menú de configuración solo si el usuario es administrador */}
              {isAdmin && (
                <NavDropdown title="Configuración" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/ingresarusuarios">Ingresar Usuario</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/administrausuarios">Administrar Usuarios</NavDropdown.Item>
                </NavDropdown>
              )}
              <Nav.Link onClick={handleLogout} as={Link} to="/">Logout</Nav.Link>
              {/* <Nav.Link as={Link} to="/login">Login</Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default BasicExample;
