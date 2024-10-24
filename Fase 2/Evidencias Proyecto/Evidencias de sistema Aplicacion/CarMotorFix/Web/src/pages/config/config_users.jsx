import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/config/tabs';
import { Input } from '../../components/ui/config/input';
import { Button } from '../../components/ui/config/button';
import { Label } from '../../components/ui/config/label';
import { Switch } from '../../components/ui/config/Switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/config/cards';
import { User, Phone, Mail, Lock, Bell, Palette, Eye, EyeOff } from 'lucide-react';
import DashboardHeader from "../../components/menu/DashboardHeader"; 
import DashboardSidebar from "../../components/menu/DashboardSidebar";
import { fetcher } from '../../lib/strApi';
import { getTokenFromLocalCookie } from '../../lib/cookies';
import { useEffect } from 'react';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

export default function Component() {
  const [darkMode, setDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Estado para controlar el sidebar
  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
  });

    useEffect(() => {
      const fetchUserData = async () => {
        const jwt = getTokenFromLocalCookie();
        if (jwt) {
          try {
            // Obtener datos de la API de Strapi para el correo
            const userDataResponse = await fetcher(`${STRAPI_URL}/api/users/me?populate=account_id`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
              },
            });
            const accountData = userDataResponse.account_id || []; // Asegúrate de que la respuesta sea un array
            
            // Actualizar el estado con los datos obtenidos
            setUserData({
              email: userDataResponse.email || "",
              nombre: accountData?.nombre || "",
              apellido: accountData?.apellido || "",
              run: accountData?.run || "", // Cambiar teléfono a RUN
            });
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      };
  
      fetchUserData();
    }, []);

  const [showPasswords, setShowPasswords] = useState({
    contrasenaAnterior: false,
    nuevaContrasena: false,
    repetirNuevaContrasena: false,
  });

  // Función para alternar el estado del sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.id]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex flex-col h-screen md:flex-row">
        {/* Sidebar */}
        <DashboardSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <DashboardHeader toggleSidebar={toggleSidebar} />

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Configuración del Cliente</h1>
            <Tabs defaultValue="perfil" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="perfil">Perfil</TabsTrigger>
                <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
                <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
              </TabsList>
              <TabsContent value="perfil">
                <Card>
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
                              {key === 'nombre' || key === 'apellido' ? <User className="h-4 w-4" /> :
                              key === 'telefono' ? <Phone className="h-4 w-4" /> :
                              key === 'email' ? <Mail className="h-4 w-4" /> : null}
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Label>
                            {isEditing ? (
                              <Input
                                id={key}
                                value={value}
                                onChange={handleChange}
                                type={key === 'email' ? 'email' : 'text'}
                              />
                            ) : (
                              <div className="p-2 border rounded-md">{value}</div>
                            )}
                          </div>
                        ))}
                      </div>
                      {isEditing && (
                        <>
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
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3 py-2"
                                  onClick={() => togglePasswordVisibility(field)}
                                  aria-label={showPasswords[field] ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                  {showPasswords[field] ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                      <div className="flex justify-between pt-4">
                        {isEditing ? (
                          <>
                            <Button variant="destructive" onClick={() => setIsEditing(false)}>Cancelar</Button>
                            <Button onClick={handleSave}>Guardar Cambios</Button>
                          </>
                        ) : (
                          <>
                            <Button variant="destructive">Eliminar Cuenta</Button>
                            <Button onClick={handleEdit}>Editar Información</Button>
                          </>
                        )}
                      </div>
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
                      <Label htmlFor="dark-mode">Modo Oscuro</Label>
                      <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
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
