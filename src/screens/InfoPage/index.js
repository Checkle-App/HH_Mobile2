import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const InfoPage = () => {
  const settingsOptions = [
    {
      key: 'privacy_policy',
      name: 'Privacy Policy',
      icon: 'security',
      onPress: () => Linking.openURL('https://www.checkle.com/privacy-policy'),
    },
    {
      key: 'terms_of_service',
      name: 'Terms of Service',
      icon: 'security',
      onPress: () => Linking.openURL('https://www.checkle.com/terms'),
    },
    {
      key: 'content_guidelines',
      name: 'Content Guidelines',
      icon: 'security',
      onPress: () =>
        Linking.openURL('https://www.checkle.com/terms/content-guidelines'),
    },
    // {
    //   key: 'delete',
    //   name: 'Delete Account',
    //   icon: 'delete',
    //   materialCommunityIcon: true,
    //   onPress: () => props.route.params.handleLogout(),
    // },
    // {
    //   key: 'logout',
    //   name: 'Logout',
    //   icon: 'logout-variant',
    //   materialCommunityIcon: true,
    //   onPress: () => props.route.params.handleLogout(),
    // },
  ];

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        automaticallyAdjustsScrollIndicatorInsets={false}
        scrollIndicatorInsets={{right: 1}}>
        <View style={{marginVertical: 25}}>
          {settingsOptions.map(option => (
            <TouchableOpacity
              style={[
                {
                  flexDirection: 'row',
                  paddingTop: 15,
                  alignItems: 'center',
                  paddingBottom: 15,
                  paddingLeft: 20,
                  paddingRight: 20,
                  minHeight: 55,
                  borderBottomColor: 'rgba(0,0,0,.3)',
                  borderBottomWidth: 1,
                },
              ]}
              key={option.key}
              onPress={() => {
                option.onPress();
              }}>
              {option.materialCommunityIcon ? (
                <MaterialCommunityIcon
                  name={option.icon}
                  size={30}
                  style={{marginRight: 20, color: '#624185'}}
                />
              ) : (
                <MaterialIcon
                  name={option.icon}
                  size={30}
                  style={{marginRight: 20, color: '#624185'}}
                />
              )}
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.settingButtonText}>{option.name}</Text>
              </View>
              <View
                style={{
                  justifyContent: 'flex-end',
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <MaterialIcon
                  name="keyboard-arrow-right"
                  size={30}
                  color={'rgba(0, 0, 0, 0.54)'}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default InfoPage;

const styles = StyleSheet.create({
  settingButtonText: {
    fontWeight: '500',
    fontSize: 17,
    color: 'rgba(0, 0, 0, 0.8)',
  },
});
