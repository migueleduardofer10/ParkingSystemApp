import React, { createContext, useState, useEffect } from 'react';
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Inicialización de MQTT
init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {}
});

export const MqttContext = createContext();

export const MqttProvider = ({ children }) => {
  const [slots, setSlots] = useState({
    'Parking 1': [false, false, false],
    'Parking 2': [false, false, false]
  });

  useEffect(() => {
    // Crear cliente MQTT
    const client = new Paho.MQTT.Client('test.mosquitto.org', 8081, 'clientId');

    const onConnect = () => {
      console.log("onConnect");
      client.subscribe('parking/sensors');
    };

    const onConnectionLost = responseObject => {
        if (responseObject.errorCode !== 0) {
          console.log("onConnectionLost:" + responseObject.errorMessage);
          // Implementar lógica de reconexión aquí
          setTimeout(() => {
            client.connect({ onSuccess: onConnect, useSSL: true });
          }, 10); // Reintentar después de 3 segundos, por ejemplo
        }
      };
      

    const onMessageArrived = message => {
      console.log("Mensaje MQTT recibido:", message.payloadString);
      const messageParts = message.payloadString.trim().split(',');

      if (messageParts.length === 6 && messageParts.every(part => !isNaN(part))) {
        const allSlotsStatus = messageParts.map(status => status === '255');
        setSlots({
          'Parking 1': allSlotsStatus.slice(0, 3),
          'Parking 2': allSlotsStatus.slice(3, 6)
        });
      }
    };

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    client.connect({ onSuccess: onConnect, useSSL: true });

    return () => {
      if (client.isConnected()) {
        client.disconnect();
      }
    };
  }, []);

  return (
    <MqttContext.Provider value={{ slots, setSlots }}>
      {children}
    </MqttContext.Provider>
  );
};
