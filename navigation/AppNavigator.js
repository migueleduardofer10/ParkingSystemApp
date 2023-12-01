import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ParkingTab from '../screens/ParkingTab';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Parking 1" 
        children={() => <ParkingTab tabName="Parking 1" />} 
        // Aquí puedes agregar opciones de navegación si es necesario
      />
      <Tab.Screen 
        name="Parking 2" 
        children={() => <ParkingTab tabName="Parking 2" />} 
        // Aquí puedes agregar opciones de navegación si es necesario
      />
      {/* Agrega más pestañas según sea necesario */}
    </Tab.Navigator>
  );
}

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={BottomTabs} 
        options={{ headerShown: false }} 
      />
      {/* Aquí puedes agregar más pantallas de Stack si es necesario */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
