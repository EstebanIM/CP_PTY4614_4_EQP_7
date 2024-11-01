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
import Dashboardadmin from './pages/admin/admin_dashboard';
import DashboardMecanico from './pages/mecanico/mecanico_dashboard';
import ConfigUsser from './pages/config/config_users';
import DetalleVehiculo from './pages/vehiculos/detalle-vehiculo';
import Dashboard from './pages/home/dashboard';

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
            path="/admin-dashboard"
            element={
              <PrivateRoute>
                <Dashboardadmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/mecanico-dashboard"
            element={
              <PrivateRoute>
                <DashboardMecanico />
              </PrivateRoute>
            }
          />
          <Route
            path="/Config"
            element={
              <PrivateRoute>
                <ConfigUsser />
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