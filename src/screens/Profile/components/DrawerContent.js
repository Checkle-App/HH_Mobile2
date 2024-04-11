import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import React from 'react';
import {StyleSheet, View, Linking, Alert} from 'react-native';
import {Drawer, useTheme} from 'react-native-paper';
import Animated from 'react-native-reanimated';

import * as actions from '../../../utils/redux/actions';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Functions} from '../../../utils/constants';

function DrawerContent(props) {
  const paperTheme = useTheme();
  const translateX = Animated.interpolate(props.progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  const handleLogout = async () => {
    if (auth().currentUser) {
      await auth().signOut();
    }
    if (await GoogleSignin.isSignedIn()) {
      await GoogleSignin.signOut();
    }

    props.dispatchSetUser({
      user: null,
    });
    props.navigation.closeDrawer();
  };

  const handleDeleteAccount = async () => {
    if (auth().currentUser) {
      await auth().signOut();
    }
    if (await GoogleSignin.isSignedIn()) {
      await GoogleSignin.signOut();
    }

    Functions.deleteUserAccount(props.user.uid);
    props.dispatchSetUser({
      user: null,
    });

    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props}>
      <Animated.View
        style={[
          styles.drawerContent,
          {
            backgroundColor: paperTheme.colors.surface,
            transform: [{translateX}],
          },
        ]}>
        <View style={styles.userInfoSection}>
          {/* {props.user ? (
            props.user.providerData[0].displayName ? (
              <Title style={styles.title}>
                {props.user.providerData[0].displayName}
              </Title>
            ) : null
          ) : null}
          <View style={styles.row}>
            <View style={styles.section}>
              <Caption style={styles.caption}>
                {props.user ? props.user.providerData[0].email : ''}
              </Caption>
            </View>
          </View> */}
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            onPress={() => {
              props.navigation.push('Extra Information');
            }}
            icon={({color, size}) => (
              <MaterialIcon name="info" color={color} size={size} />
            )}
            label="Extra Info"
          />
        </Drawer.Section>
        <Drawer.Section>
          <DrawerItem
            onPress={() => {
              Linking.openURL(
                'https://docs.google.com/forms/d/e/1FAIpQLScamdZ4WNas9CIfkWRPY5aPSuShZtHO44-tMzfckFCm30ZPbw/viewform',
              );
              props.navigation.closeDrawer();
            }}
            icon={({color, size}) => (
              <MaterialCommunityIcon name="message" color={color} size={size} />
            )}
            label="Feedback"
          />
        </Drawer.Section>
        {props.user ? (
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              onPress={() => {
                handleLogout();
              }}
              icon={({color, size}) => (
                <MaterialCommunityIcon
                  name="logout-variant"
                  color={color}
                  size={size}
                />
              )}
              label="Logout"
            />
          </Drawer.Section>
        ) : null}
        {props.user ? (
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              onPress={() => {
                Alert.alert(
                  'Are you sure you want to delete this account?',
                  '',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {text: 'Delete', onPress: () => handleDeleteAccount()},
                  ],
                );
              }}
              icon={({color, size}) => (
                <MaterialIcon name="delete" color={color} size={size} />
              )}
              label="Delete Account"
            />
          </Drawer.Section>
        ) : null}
        {/* <Drawer.Section>
          <DrawerItem
            icon={({color, size}) => (
              <MaterialCommunityIcon
                name="account-outline"
                color={color}
                size={size}
              />
            )}
            label="Profile"
          />
        </Drawer.Section>
        <Drawer.Section>
          <DrawerItem
            icon={({color, size}) => (
              <MaterialCommunityIcon
                name="help-circle-outline"
                color={color}
                size={size}
              />
            )}
            label="Support"
            onPress={() =>
              Linking.openURL('https://checkle.com/legal/')
            }
          />
        </Drawer.Section>
        <Drawer.Section>
          <DrawerItem
            icon={({color, size}) => (
              <MaterialCommunityIcon
                name="logout-variant"
                color={color}
                size={size}
              />
            )}
            label="Logout"
          />
        </Drawer.Section> */}
      </Animated.View>
    </DrawerContentScrollView>
  );
}

const mapStateToProps = state => ({
  user: state.user.user,
  app: state.app,
});

const mapDispatchToProps = {
  dispatchSetUser: actions.setUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
