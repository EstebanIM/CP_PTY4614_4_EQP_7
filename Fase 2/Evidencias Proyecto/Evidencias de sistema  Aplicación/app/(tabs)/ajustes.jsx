import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Ajustes() {
  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-6">Ajustes</Text>
      
      <View className="mb-6">
        <Text className="text-lg mb-2">Cuenta</Text>
        <TouchableOpacity className="flex-row items-center justify-between py-2">
          <Text >Cambiar Contraseña</Text>
          <Ionicons name="chevron-forward" size={24}  />
        </TouchableOpacity>
      </View>
      
      <View className="mb-6">
        <Text className="text-lg mb-2">Notificaciones</Text>
        <TouchableOpacity className="flex-row items-center justify-between py-2">
          <Text >Notificaciones</Text>
          <Ionicons name="chevron-forward" size={24}  />
        </TouchableOpacity>
        <View className="flex-row items-center justify-between py-2">
          <Text >Notificaciones de la aplicación</Text>
          <Switch />
        </View>
      </View>
      
      <View>
        <Text className="text-lg mb-2">Más</Text>
        <TouchableOpacity className="flex-row items-center justify-between py-2">
          <Text >Idioma</Text>
          <Text>Español</Text>
        </TouchableOpacity>
        {/* <View className="flex-row items-center justify-between py-2">
          <Text >Modo Oscuro</Text>
          <Switch />
        </View> */}
        <TouchableOpacity className="flex-row items-center justify-between py-2">
          <Text >Reportar Problemas</Text>
          <Ionicons name="chevron-forward" size={24}  />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center justify-between py-2">
          <Text >Términos de Uso</Text>
          <Ionicons name="chevron-forward" size={24}  />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center justify-between py-2">
          <Text >Cerrar Sesión</Text>
          <Ionicons name="log-out-outline" size={24}  />
        </TouchableOpacity>
      </View>
    </View>
  );
}
