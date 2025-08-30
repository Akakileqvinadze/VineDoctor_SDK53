import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import WeatherScreen from './src/screens/WeatherScreen';
import AdvisorScreen from './src/screens/AdvisorScreen';
import DiseasesScreen from './src/screens/DiseasesScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator screenOptions={{ headerShadowVisible: false, tabBarActiveTintColor: '#2e7d32' }}>
        <Tab.Screen name="ამინდი" component={WeatherScreen} options={{ tabBarLabel: 'ამინდი', tabBarIcon: () => <Text>☀️</Text> }} />
        <Tab.Screen name="მრჩეველი" component={AdvisorScreen} options={{ tabBarLabel: 'მრჩეველი', tabBarIcon: () => <Text>🧪</Text> }} />
        <Tab.Screen name="დაავადებები" component={DiseasesScreen} options={{ tabBarLabel: 'დაავადებები', tabBarIcon: () => <Text>🍇</Text> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
