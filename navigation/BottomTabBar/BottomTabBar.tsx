import React from 'react';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const BottomTabBar = ({ navigation, state }: BottomTabBarProps) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}
  >
    {state.routeNames.map((route, index) => {
      let iconName: keyof typeof Ionicons.glyphMap;

      if (route === 'Home') {
        iconName = state.index === index ? 'tennisball' : 'tennisball-outline';
      } else if (route === 'Reservations') {
        iconName = state.index === index ? 'calendar' : 'calendar-outline';
      }  else {
        iconName = 'home'; // default icon name
      }

      return (
        <BottomNavigationTab
          key={route}
          title={route === 'Home' ? 'Inicio' : 'Mis Reservas'}
          icon={(props: any) => (
            <Ionicons name={iconName} size={props?.style?.width} color={props.style.tintColor} />
          )}
        />
      );
    })}
  </BottomNavigation>
);

export default BottomTabBar;