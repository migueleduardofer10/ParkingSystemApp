import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MqttContext } from '../contexts/MqttContext';

const ParkingTab = ({ tabName }) => {
  const { slots } = useContext(MqttContext);

  return (
    <View style={styles.container}>
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