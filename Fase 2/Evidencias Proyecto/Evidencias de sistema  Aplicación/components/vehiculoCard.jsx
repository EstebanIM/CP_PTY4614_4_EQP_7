import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VehiculoCard = ({ vehiculo, servicio, kilometraje }) => {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
      <View>
        <Text className="font-bold">{vehiculo}</Text>
        <Text>{servicio}, {kilometraje}</Text>
      </View>
      <Ionicons name="notifications-outline" size={24} color="#000" />
    </View>
  );
};

export default VehiculoCard;
