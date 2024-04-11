import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import {Appbar} from 'react-native-paper';
import BottomTabs from './BottomTabs';
import Search from './screens/Search';
import Deal from './screens/Deal';
import Venue from './screens/Venue';
import InfoPage from './screens/InfoPage';
import {useSafeArea} from 'react-native-safe-area-context';

const Stack = createStackNavigator();

const MainRootNav = () => {
  const safeArea = useSafeArea();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      headerMode="screen"
      screenOptions={{
        header: ({back, options, navigation}) => {
          const title =
            options.headerTitle !== undefined
              ? options.headerTitle
              : options.title !== undefined
              ? options.title
              : '';
          const subTitle =
            options.subTitle !== undefined ? options.subTitle : '';
          return options.headerTitle ||
            options.title ||
            options.showBackButton ? (
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['rgba(98, 65, 133, 0.8)', 'rgba(255, 163, 69, 0.8)']}
              style={[
                {paddingTop: Platform.OS === 'android' ? safeArea.top : 0},
              ]}>
              <Appbar.Header style={{backgroundColor: 'transparent'}}>
                {back ? (
                  <Appbar.BackAction
                    onPress={() => {
                      navigation.goBack();
                    }}
                    color={'#fff'}
                    style={[
                      subTitle
                        ? {paddingBottom: Platform.OS === 'android' ? 8 : 0}
                        : {},
                    ]}
                  />
                ) : null}
                <Appbar.Content
                  title={title}
                  subtitle={subTitle}
                  titleStyle={{
                    fontSize: 18,
                    color: '#fff',
                    paddingRight: Platform.OS === 'android' ? 15 : 0,
                  }}
                  subtitleStyle={{
                    color: 'rgba(255,255,255,0.8)',
                    paddingBottom: Platform.OS === 'android' ? 8 : 0,
                  }}
                />
              </Appbar.Header>
            </LinearGradient>
          ) : null;
        },
      }}>
      <Stack.Screen name="Home" component={BottomTabs} gestureEnabled={false} />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{showBackButton: true}}
        gestureEnabled={false}
      />
      <Stack.Screen name="Deal" component={Deal} gestureEnabled={false} />
      <Stack.Screen name="Venue" component={Venue} gestureEnabled={false} />
      <Stack.Screen
        name="Extra Information"
        component={InfoPage}
        options={{headerTitle: 'Extra Information'}}
        gestureEnabled={false}
      />
    </Stack.Navigator>
  );
};

export default MainRootNav;
