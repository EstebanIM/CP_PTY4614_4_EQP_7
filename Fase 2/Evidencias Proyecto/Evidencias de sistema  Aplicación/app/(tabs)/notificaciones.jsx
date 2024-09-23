import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import VehiculoCard from '../../components/vehiculoCard';

export default function Notificaciones() {
  const alertas = [
    { vehiculo: 'Audi A4', servicio: 'Filtros de aire', kilometraje: '24,000 Km/h' },
    { vehiculo: 'Honda Civic', servicio: 'Cambio de aceite', kilometraje: '5,000 Km/h' },
    { vehiculo: 'Toyota Camry', servicio: 'Lavado del motor', kilometraje: '30,000 Km/h' },
    { vehiculo: 'Subaru Outback', servicio: 'Rotación de neumáticos', kilometraje: '10,000 Km/h' },
  ];

  return (
    <View className="flex-1 p-4">
      <Stack.Screen options={{ title: "" }} />
      <Text className="text-2xl font-bold mb-4">Alertas de mantenimiento</Text>
      <ScrollView>
        {alertas.map((alerta, index) => (
          <VehiculoCard
            key={index}
            vehiculo={alerta.vehiculo}
            servicio={alerta.servicio}
            kilometraje={alerta.kilometraje}
          />
        ))}
      </ScrollView>
    </View>
  );
}
