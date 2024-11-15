//Imports de las bibliotecas 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//imports de las protecciones
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './private';
import PublicRoute from './public';

//Imports de las paginas
import Login from './pages/login/login';
import EmailVerification from './pages/login/Verif';
import Inicio from './pages/home/inicio';
import Config from './pages/config/config';
import DetalleVehiculo from './pages/vehiculos/detalle-vehiculo';
import Dashboard from './pages/home/dashboard';
import Catalogo_servicio from './pages/admin/Catalogo_servicio';
import Detalle_servicio from './pages/admin/detalle-servicio';
import Detalle_Orden from './pages/home/detalle_ot';
import AsignarMecanico from './pages/admin/asignar_mecanico';
import { DarkModeProvider } from './context/DarkModeContext';
import OrdenDeTrabajo from './pages/mecanico/OrdenDeTrabajo';

function App() {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/verify-email"
              element={
                <PublicRoute>
                  <EmailVerification />
                </PublicRoute>
              }
            />
            {/* Rutas protegidas con PrivateRoute */}
            <Route
              path="/Inicio"
              element={
                <PrivateRoute>
                  <Inicio />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/catalogo_servicio"
              element={
                <PrivateRoute>
                  <Catalogo_servicio />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/detalle-servicio/:id"
              element={
                <PrivateRoute>
                  <Detalle_servicio />
                </PrivateRoute>
              }
            />
            <Route
              path="/config"
              element={
                <PrivateRoute>
                  <Config />
                </PrivateRoute>
              }
            />
            <Route
              path="/vehiculos/detalle-vehiculo/:id"
              element={
                <PrivateRoute>
                  <DetalleVehiculo />
                </PrivateRoute>
              }
            />
            <Route
              path="/detalle_ot/:id"
              element={
                <PrivateRoute>
                  <Detalle_Orden />
                </PrivateRoute>
              }
            />
            <Route
              path="/asignar_mecanico"
              element={
                <PrivateRoute>
                  <AsignarMecanico />
                </PrivateRoute>
              }
            />
            <Route
              path="/orden-de-trabajo"
              element={
                <PrivateRoute>
                  <OrdenDeTrabajo />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
        <ToastContainer />
      </DarkModeProvider>
    </AuthProvider>

  );
}

export default App;