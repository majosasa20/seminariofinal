import './App.css';
import NavBar from './main/Navbar';
import { Route, Routes } from 'react-router-dom';
import CatCargo from './Catalogos/CatCargo';
import Inicio from './main/inicio';
import CatCliente from './Catalogos/CatCliente';
import CatEmpleado from './Catalogos/CatEmpleado';
import CatDoctoIdenti from './Catalogos/CatDoctoIdenti';
import CatEstadosProy from './Catalogos/CatEstadosProy';
import CatTipoEstados from './Catalogos/CatTipoEstados';
import CrearProyecto from './Operaciones/CrearProyecto';
import AsignacionRecursos from './Operaciones/AsignaRecursos';
import AsignaTarea from './Operaciones/AsignaTarea';
import AdministraTareas from './Operaciones/AdministraTareas';
import RptPruebaExito from './Reportes/RptPruebaExito';
import RptExcepciones from './Reportes/RptExcepciones';
import RptProyectos from './Reportes/RptProyectos';
import RptHitos from './Reportes/RptHitos';
import Login from './main/login';
import IngresarUsuario from './Configuracion/ingresarUsuario';
import AdministraUsuarios from './Configuracion/adminUsuarios';
import { AuthProvider, useAuth } from './main/authContext';
import ProtectedRoute from './main/routeProtected';  // Asegúrate de que la ruta sea correcta
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

function Main() {
  const { isAuthenticated, userInfo } = useAuth();
    // const isAdmin = userInfo.rolUAdmin ;
  console.log('Is authenticated:', isAuthenticated);

  return (
    <div className='App'>
      {isAuthenticated && <NavBar />} {/* Muestra el NavBar solo si está autenticado */}
      <Routes>
      <Route path="/" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/catcargo" element={<ProtectedRoute><CatCargo /></ProtectedRoute>} />
        <Route path="/catcliente" element={<ProtectedRoute><CatCliente /></ProtectedRoute>} />
        <Route path="/catempleado" element={<ProtectedRoute><CatEmpleado /></ProtectedRoute>} />
        <Route path="/catdoctoidenti" element={<ProtectedRoute><CatDoctoIdenti /></ProtectedRoute>} />
        <Route path="/catestadosproy" element={<ProtectedRoute><CatEstadosProy /></ProtectedRoute>} />
        <Route path="/cattipoestados" element={<ProtectedRoute><CatTipoEstados /></ProtectedRoute>} />
        <Route path="/crearproyecto" element={<ProtectedRoute><CrearProyecto /></ProtectedRoute>} />
        <Route path="/asignarecursos" element={<ProtectedRoute><AsignacionRecursos /></ProtectedRoute>} />
        <Route path="/asignatarea" element={<ProtectedRoute><AsignaTarea /></ProtectedRoute>} />
        <Route path="/administratarea" element={<ProtectedRoute><AdministraTareas /></ProtectedRoute>} />
        <Route path="/rptpruebaexito" element={<ProtectedRoute><RptPruebaExito /></ProtectedRoute>} />
        <Route path="/rptexcepciones" element={<ProtectedRoute><RptExcepciones /></ProtectedRoute>} />
        <Route path="/rptproyectos" element={<ProtectedRoute><RptProyectos /></ProtectedRoute>} />
        <Route path="/rpthitos" element={<ProtectedRoute><RptHitos /></ProtectedRoute>} />
        {/* <Route path="/ingresarusuarios" element={isAdmin ? <IngresarUsuario /> : <Navigate to="/" />} />
        <Route path="/administrausuarios" element={isAdmin ? <AdministraUsuarios /> : <Navigate to="/" />} /> */}
                
        <Route path="/ingresarusuarios" element={<ProtectedRoute><IngresarUsuario /></ProtectedRoute>} />
        <Route path="/administrausuarios" element={<ProtectedRoute><AdministraUsuarios /></ProtectedRoute>} />
      
      </Routes>
    </div>
  );
}

export default App;
