import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MqttContext } from '../contexts/MqttContext';

const ParkingTab = ({ tabName }) => {
  const { slots } = useContext(MqttContext);

  // Combina todos los slots y cuenta los que están ocupados
  const totalOccupiedSlots = Object.values(slots).flat().filter(occupied => occupied).length;

  // Verifica si todos los slots están ocupados
  const allSlotsOccupied = totalOccupiedSlots === Object.values(slots).flat().length;

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        {allSlotsOccupied && (
          <Text style={styles.fullMessage}>Estacionamiento Totalmente Ocupado</Text>
        )}
        <Text style={styles.occupiedCounter}>
          Slots Ocupados: {totalOccupiedSlots}
        </Text>
      </View>
      <Text style={styles.title}>{tabName}</Text>
      {slots[tabName].map((occupied, index) => (
        <View style={styles.slotContainer} key={index}>
          <View style={[styles.led, occupied ? styles.ledOn : styles.ledOff]} />
          <Text style={styles.slotText}>Slot {index + 1}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 10,  // Ajusta este valor según sea necesario
  },
  fullMessage: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
  occupiedCounter: {
    fontSize: 16,
    color: 'blue',
  },
  slotContainer: {
    alignItems: 'center',
    marginTop: 3,
  },
  slotText: {
    marginTop: 3,
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
