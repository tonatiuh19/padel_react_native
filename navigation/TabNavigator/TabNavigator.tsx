import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import ReservationsScreen from '../../screens/ReservationsScreen/ReservationsScreen';
import BottomTabBar from '../BottomTabBar/BottomTabBar';
const { Navigator, Screen } = createBottomTabNavigator();

const TabNavigator = () => (
  <Navigator initialRouteName="Home" tabBar={props => <BottomTabBar {...props} />}>
    <Screen name='Home' component={HomeScreen} />
    <Screen name='Reservations' component={ReservationsScreen} />
  </Navigator>
);

export default TabNavigator;