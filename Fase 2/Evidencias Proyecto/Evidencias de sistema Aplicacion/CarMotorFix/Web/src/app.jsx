//Imports de las bibliotecas 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//imports de las protecciones
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './private';

//Imports de las paginas
import Login from './pages/login/login';
import EmailVerification from './pages/login/Verif';
import Inicio from './pages/home/inicio';
import Config from './pages/config/config';
import DetalleVehiculo from './pages/vehiculos/detalle-vehiculo';
import Dashboard from './pages/home/dashboard';
import Catalogo_servicio from './pages/admin/Catalogo_servicio';
import Detalle_servicio from './pages/admin/detalle-servicio';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/verify-email" element={<EmailVerification />} />

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
        </Routes>
      </Router>

      {/* ToastContainer para notificaciones */}
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;