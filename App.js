import { NavigationContainer } from '@react-navigation/native';
import { MqttProvider } from './contexts/MqttContext';
import AppNavigator from './navigation/AppNavigator';
import { StyleSheet, View } from 'react-native';

const App = () => {
  return (
    <MqttProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </MqttProvider>
  );
};

export default App;