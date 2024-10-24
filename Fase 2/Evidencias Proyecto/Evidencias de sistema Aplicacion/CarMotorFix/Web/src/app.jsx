import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Importa ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de React Toastify
import Login from './pages/login/login';
import EmailVerification from './pages/login/Verif';
import Inicio from './pages/home/inicio'; // Importa el componente Dashboard
import Dashboardadmin from './pages/admin/admin_dashboard';
import DashboardMecanico from './pages/mecanico/mecanico_dashboard';
import ConfigUsser from './pages/all/config_users';
import MisVehiculos from './pages/vehiculos/mis-vehiculos'; // Importa la página de Mis Vehículos
import DetalleVehiculo from './pages/vehiculos/detalle-vehiculo'; // Ruta a la página de detalles

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Ruta principal de login */}
          <Route path="/" element={<Login />} />
          {/* Ruta para la verificación de correo */}
          <Route path="/verify-email" element={<EmailVerification />} />
          {/* Ruta para el dashboard */}
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<Dashboardadmin />} />
          <Route path="/mecanico-dashboard" element={<DashboardMecanico />} />
          <Route path="/Config" element={<ConfigUsser />} />
          {/* Ruta para Mis Vehículos */}
          <Route path="/vehiculos/mis-vehiculos" element={<MisVehiculos />} />
          <Route path="/vehiculos/detalle-vehiculo/:id" element={<DetalleVehiculo />} />
        </Routes>
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
