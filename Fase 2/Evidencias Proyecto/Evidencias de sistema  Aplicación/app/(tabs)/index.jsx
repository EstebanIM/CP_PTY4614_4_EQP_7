import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

export default function Vehiculos() {
  const vehiculos = [
    { id: 1, nombre: 'Hyundai Accent' },
    { id: 2, nombre: 'Honda Odyssey' },
  ];

  return (
    <View className="flex-1 p-4">
      <Stack.Screen options={{ title: "" }} />
      <Text className="text-2xl font-bold mb-4">Mantenimiento de vehículos</Text>
      <Text className="text-lg mb-2">Tus vehículos</Text>
      <ScrollView>
        {vehiculos.map((vehiculo) => (
          <TouchableOpacity 
            key={vehiculo.id}
            className="flex-row items-center justify-between py-3 border-b border-gray-200"
          >
            <Text className="text-lg">{vehiculo.nombre}</Text>
            <Ionicons name="chevron-forward" size={24} color="#007AFF" />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity 
        className="mb-20 absolute bottom-4 right-4 bg-blue-500 p-3 rounded-full items-center justify-center"
        style={{ width: 60, height: 60 }}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}