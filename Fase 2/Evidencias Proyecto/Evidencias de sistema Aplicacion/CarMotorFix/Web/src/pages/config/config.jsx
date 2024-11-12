import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/config/tabs';
import { Input } from '../../components/ui/config/input';
import { Button } from '../../components/ui/config/button';
import { Label } from '../../components/ui/config/label';
import { Switch } from '../../components/ui/config/Switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/config/cards';
import { User, IdCard, Mail, Lock, Bell, Palette, Eye, EyeOff } from 'lucide-react';
import DashboardHeader from "../../components/menu/DashboardHeader";
import DashboardSidebar from "../../components/menu/DashboardSidebar";
import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie, getIdFromLocalCookie, getDarkModeFromLocalCookie, setDarkMode as saveDarkModePreference } from '../../lib/cookies';
import { supabase } from '../../lib/supabaseClient';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

export default function Config() {
  const [darkMode, setDarkMode] = useState(getDarkModeFromLocalCookie()); // Initial dark mode state from cookie
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    nombre: "",
    apellido: "",
    run: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    contrasenaAnterior: false,
    nuevaContrasena: false,
    repetirNuevaContrasena: false,
  });

  const [passwords, setPasswords] = useState({
    contrasenaAnterior: "",
    nuevaContrasena: "",
    repetirNuevaContrasena: "",
  });

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      const jwt = getTokenFromLocalCookie();
      if (jwt) {
        try {
          const userDataResponse = await fetcher(`${STRAPI_URL}/api/users/me?populate=*`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`,
            },
          });

          setUserData({
            email: userDataResponse.email || "",
            nombre: userDataResponse.nombre || "",
            apellido: userDataResponse.apellido || "",
            run: userDataResponse.run || "",
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordChange = async () => {
    const { contrasenaAnterior, nuevaContrasena, repetirNuevaContrasena } = passwords;

    if (!contrasenaAnterior || !nuevaContrasena || !repetirNuevaContrasena) {
      toast.error("Por favor, completa todos los campos de contraseña.");
      return;
    }

    if (nuevaContrasena !== repetirNuevaContrasena) {
      toast.error("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    try {
      const jwt = getTokenFromLocalCookie();

      const strapiResponse = await fetch(`${STRAPI_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          currentPassword: contrasenaAnterior,
          password: nuevaContrasena,
          passwordConfirmation: repetirNuevaContrasena,
        }),
      });

      const strapiData = await strapiResponse.json();

      if (strapiResponse.ok) {
        toast.success("Contraseña cambiada exitosamente.");

        await supabase.auth.updateUser({ password: nuevaContrasena });

        setPasswords({ contrasenaAnterior: "", nuevaContrasena: "", repetirNuevaContrasena: "" });
      } else {
        toast.error(strapiData.message || "Hubo un error al cambiar la contraseña en Strapi.");
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      toast.error("Hubo un error al cambiar la contraseña.");
    }
  };

  const handlePasswordInputChange = (e) => {
    const { id, value } = e.target;
    setPasswords((prev) => ({ ...prev, [id]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const userjwt = getTokenFromLocalCookie();
    const userId = await getIdFromLocalCookie();

    try {
      const accountResponse = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userjwt}`,
        },
        body: JSON.stringify({
          nombre: userData.nombre,
          apellido: userData.apellido
        }),
      });

      if (accountResponse.ok) {
        toast.success("Información actualizada exitosamente.");
        setIsEditing(false);
      } else {
        const errorData = await accountResponse.json();
        toast.error(errorData.message || "Hubo un error al actualizar la información.");
      }
    } catch (error) {
      console.error("Error al actualizar la información:", error);
      toast.error("Hubo un error al actualizar la información.");
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.id]: e.target.value });
  };

  const handleDarkModeToggle = (enabled) => {
    setDarkMode(enabled);
    saveDarkModePreference(enabled); // Save preference to cookie

    // Reload the page to apply dark mode changes immediately
    window.location.reload();
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="flex flex-col h-screen md:flex-row">
        <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} darkMode={darkMode} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} darkMode={darkMode} />

          <div className="flex-1 overflow-y-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Configuración del Cliente</h1>
            <Tabs defaultValue="perfil" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="perfil">Perfil</TabsTrigger>
                <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
                <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
              </TabsList>

              <TabsContent value="perfil">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Perfil del Cliente</CardTitle>
                    <CardDescription>Tu información personal y de contacto</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(userData).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <Label htmlFor={key} className="flex items-center gap-2">
                              {key === 'email' ? <Mail className="h-4 w-4" /> :
                                key === 'nombre' || key === 'apellido' ? <User className="h-4 w-4" /> :
                                  key === 'run' ? <IdCard className="h-4 w-4" /> : null}
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Label>
                            {isEditing && key !== 'run' ? (
                              <Input
                                id={key}
                                value={value}
                                onChange={handleChange}
                                type={key === 'email' ? 'email' : 'text'}
                              />
                            ) : (
                              <div className="p-2 border rounded-md">
                                {value}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between pt-4">
                        {isEditing ? (
                          <>
                            <Button variant="destructive" onClick={() => setIsEditing(false)}>Cancelar</Button>
                            <Button onClick={handleSave}>Guardar Cambios</Button>
                          </>
                        ) : (
                          <Button onClick={handleEdit}>Editar Información</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Card for Password Change (always visible) */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cambiar Contraseña</CardTitle>
                    <CardDescription>Actualiza tu contraseña de acceso</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {['contrasenaAnterior', 'nuevaContrasena', 'repetirNuevaContrasena'].map((field) => (
                      <div key={field} className="space-y-2">
                        <Label htmlFor={field} className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          {field === 'contrasenaAnterior' ? 'Contraseña Anterior' :
                            field === 'nuevaContrasena' ? 'Nueva Contraseña' : 'Repetir Nueva Contraseña'}
                        </Label>
                        <div className="relative">
                          <Input
                            id={field}
                            type={showPasswords[field] ? 'text' : 'password'}
                            value={passwords[field]}
                            onChange={handlePasswordInputChange}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2"
                            onClick={() => togglePasswordVisibility(field)}
                            aria-label={showPasswords[field] ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          >
                            {showPasswords[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-start pt-4">
                      <Button onClick={handlePasswordChange}>
                        Confirmar Cambio
                      </Button>
                    </div>
                  </CardContent>
                </Card>

              </TabsContent>

              {/* Notificaciones */}
              <TabsContent value="notificaciones">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Preferencias de Notificaciones
                    </CardTitle>
                    <CardDescription>Gestiona cómo y cuándo recibes notificaciones</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notif">Notificaciones por Email</Label>
                      <Switch id="email-notif" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-notif">Notificaciones por SMS</Label>
                      <Switch id="sms-notif" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Apariencia */}
              <TabsContent value="apariencia">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Configuración de Apariencia
                    </CardTitle>
                    <CardDescription>Personaliza la apariencia de tu interfaz</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dark-mode">Modo Oscuro (beta)</Label>
                      <Switch id="dark-mode" checked={darkMode} onCheckedChange={handleDarkModeToggle} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
