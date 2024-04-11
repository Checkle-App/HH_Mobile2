import React from 'react';
import {Dimensions} from 'react-native';
import color from 'color';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useTheme} from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import overlay from './overlay';
import Home from './screens/Home';
import Feed from './screens/Feed';
import Map from './screens/Map';
import Profile from './screens/Profile';
import DrawerContent from './screens/Profile/components/DrawerContent';

const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();

function ProfileScreen(props) {
  return (
    <Drawer.Navigator
      drawerPosition="right"
      drawerContent={drawerProps => <DrawerContent {...drawerProps} />}
      drawerType="slide">
      <Drawer.Screen
        name="Profile"
        component={Profile}
        initialParams={props.route.params}
      />
    </Drawer.Navigator>
  );
}

const BottomTabs = props => {
  const theme = useTheme();
  const tabBarColor = theme.dark
    ? overlay(6, theme.colors.surface)
    : theme.colors.surface;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="initialRoute"
      shifting={true}
      activeColor={theme.colors.primary}
      inactiveColor={color(theme.colors.text).alpha(0.6).rgb().string()}
      sceneAnimationEnabled={false}
      initialLayout={{
        width: Dimensions.get('window').width,
        height: 0,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({color: colorTab}) => (
            <MaterialIcon size={24} color={colorTab} name={'home'} />
          ),
          tabBarColor,
        }}
        gestureEnabled={false}
      />
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarIcon: ({color: colorTab}) => (
            <MaterialIcon size={24} color={colorTab} name={'view-carousel'} />
          ),
          tabBarColor,
        }}
        gestureEnabled={false}
      />
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          tabBarIcon: ({color: colorTab}) => (
            <MaterialIcon size={24} color={colorTab} name={'location-on'} />
          ),
          tabBarColor,
        }}
        gestureEnabled={false}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color: colorTab}) => (
            <MaterialIcon size={24} color={colorTab} name={'person'} />
          ),
          tabBarColor,
        }}
        gestureEnabled={false}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
