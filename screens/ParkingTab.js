import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

const ParkingTab = ({ tabName }) => {
  const [slots, setSlots] = useState([false, false, false]); // Estado inicial de los slots

  useEffect(() => {
    // Crear cliente MQTT
    const client = new Paho.MQTT.Client('test.mosquitto.org', 8081, 'clientId');

    // Manejadores de eventos
    const onConnect = () => {
      console.log("onConnect");
      client.subscribe('parking/sensors');
    };

    const onConnectionLost = responseObject => {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
      }
    };

    const onMessageArrived = message => {
      console.log("Mensaje MQTT recibido:", message.payloadString);
      const messageStr = message.payloadString.trim();
      const messageParts = messageStr.split(',');
    
      // Verifica si el mensaje tiene exactamente 6 partes y cada parte es un número
      if (messageParts.length === 6 && messageParts.every(part => !isNaN(part))) {
        const allSlotsStatus = messageParts.map(status => status === '255');
        console.log("Estado de todos los slots:", allSlotsStatus);
    
        let slotsToShow;
        if (tabName === 'Parking 1') {
          slotsToShow = allSlotsStatus.slice(0, 3);
        } else {
          slotsToShow = allSlotsStatus.slice(3, 6);
        }
    
        setSlots(slotsToShow);
      } else {
      }
    };
    
    
    
    

    // Configurar manejadores de eventos
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // Conectar al broker MQTT
    client.connect({ onSuccess: onConnect, useSSL: true });

    return () => {
      if (client.isConnected()) {
        client.disconnect();
      }
    };
  }, [tabName]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tabName}</Text>
      {slots.map((occupied, index) => (
        <View style={styles.slotContainer} key={index}>
          <View style={[styles.led, occupied ? styles.ledOn : styles.ledOff]} />
          <Text style={styles.slotText}>Slot {index + 1}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  slotContainer: {
    alignItems: 'center',
  },
  slotText: {
    marginTop: 3,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  led: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  ledOn: {
    backgroundColor: 'red',
  },
  ledOff: {
    backgroundColor: 'green',
  },
});

export default ParkingTab;