import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Platform,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Linking,
} from 'react-native';
import {ActivityIndicator, Subheading, Caption} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Slider from '../../components/Slider';
import * as actions from '../../utils/redux/actions';

import {Functions} from '../../utils/constants';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';

const {width: viewportWidth} = Dimensions.get('window');
function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const Profile = props => {
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('blur', () => {
      // Screen was exited
      props.navigation.closeDrawer();
    });

    return unsubscribe;
  }, [props.navigation]);

  const ProfileSlider = props => {
    return (
      <View style={{paddingVertical: 20}}>
        <Slider type={props.type} data={props.data} />
      </View>
    );
  };

  const statusBarHeight =
    Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight;

  const {loading} = props;

  const handleLogin = async credential => {
    await auth().signInWithCredential(credential);
    const currentUser = auth().currentUser;
    const uid = currentUser.uid;
    const userInfo = currentUser._user;

    const user = await Functions.readConsumer(uid, userInfo);

    props.dispatchSetUser({user});
  };

  const loginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const data = await GoogleSignin.signIn();

      const credential = firebase.auth.GoogleAuthProvider.credential(
        data.idToken,
        data.accessToken,
      );

      handleLogin(credential);
    } catch (error) {}
  };

  const onAppleButtonPress = async () => {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Create a Firebase credential from the response
    const {identityToken, nonce} = appleAuthRequestResponse;
    if (identityToken) {
      const credential = firebase.auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      // Sign the user in with the credential
      handleLogin(credential);
    }
  };

  return (
    <React.Fragment>
      <LinearGradient
        colors={['rgba(98, 65, 133, 0.8)', 'rgba(255, 163, 69, 0.8)']}
        style={{
          backgroundColor: '#624185',
          height: statusBarHeight,
          width: '100%',
        }}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        {Platform.OS === 'ios' ? (
          <StatusBar
            translucent={true}
            backgroundColor={'transparent'}
            barStyle="light-content"
          />
        ) : (
          <StatusBar translucent backgroundColor="transparent" />
        )}
      </LinearGradient>
      <View style={styles.mainContainer}>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              flexDirection: 'column',
            }}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <ScrollView
            automaticallyAdjustsScrollIndicatorInsets={false}
            scrollIndicatorInsets={{right: 1}}
            bounces={false}
            contentContainerStyle={{paddingBottom: 40}}>
            <View style={styles.avatarContainer}>
              <Image
                // source={{
                //   uri: props.user.photoURL,
                // }}
                source={require('../../../assets/ic_launcher_rounded.png')}
                style={{width: 80, height: 80, borderRadius: 80 / 2}}
              />
              {/* {props.userDisplayName ? (
                <Text style={styles.avatarName}>{props.userDisplayName}</Text>
              ) : null} */}
            </View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                props.navigation.toggleDrawer();
              }}
              style={{
                position: 'absolute',
                top: 0,
                right: 5,
                padding: 20,
              }}>
              <MaterialCommunityIcon name={'menu'} size={30} color={'gray'} />
            </TouchableOpacity>
            {props.user ? (
              <>
                <View style={{paddingVertical: 20, paddingHorizontal: 20}}>
                  <View style={{paddingVertical: 20}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Subheading style={{fontSize: 18, lineHeight: 18}}>
                        Liked Deals
                      </Subheading>
                      <MaterialIcon
                        name="favorite"
                        size={18}
                        color="#624185"
                        style={{marginLeft: 5}}
                      />
                    </View>
                    {props.user.likedDeals.length ? (
                      <ProfileSlider type="deal" data={props.user.likedDeals} />
                    ) : (
                      <Caption style={{fontSize: 13, paddingTop: 10}}>
                        Like deals to easily find them here and share with
                        friends.
                      </Caption>
                    )}
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={{paddingVertical: 20, paddingHorizontal: 20}}>
                  <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <TouchableOpacity
                      style={[loginStyles.button, loginStyles.googleLogin]}
                      onPress={loginWithGoogle}>
                      <Image
                        source={require('../../../assets/google-logo.png')}
                        style={{width: 22, height: 22, marginRight: 10}}
                      />
                      <Text style={[loginStyles.buttonText, {color: '#000'}]}>
                        Sign in with Google
                      </Text>
                    </TouchableOpacity>
                    {appleAuth.isSupported && Platform.OS === 'ios' ? (
                      <TouchableOpacity
                        style={[loginStyles.button, loginStyles.googleLogin]}
                        onPress={onAppleButtonPress}>
                        <MaterialCommunityIcon
                          name="apple"
                          color="#000"
                          size={25}
                          style={{marginRight: 10}}
                        />
                        <Text style={[loginStyles.buttonText, {color: '#000'}]}>
                          Sign in with Apple
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      style={loginStyles.privacyBox}
                      onPress={() => {
                        Linking.openURL(
                          'https://www.checkle.com/privacy-policy',
                        );
                      }}>
                      <Text style={loginStyles.privacyText}>
                        By tapping Login, you agree
                      </Text>
                      <Text style={loginStyles.privacyText}>
                        agree with our{' '}
                        <Text style={{textDecorationLine: 'underline'}}>
                          Privacy Policy
                        </Text>
                        .
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        )}
      </View>
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  loading: state.app.loading,
  user: state.user.user,
});

const mapDispatchToProps = {
  dispatchSetUser: actions.setUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  appBar: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F6FAFF',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  userInfo: {
    fontWeight: '500',
    fontSize: 20,
    textAlign: 'center',
    color: '#FFFFFF',
    paddingBottom: 20,
  },
  settingButton: {
    flexDirection: 'row',
    paddingTop: 10,
    alignItems: 'center',
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    minHeight: 55,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,.5)',
  },
  settingButtonText: {
    fontWeight: '500',
    fontSize: 17,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  settingButtonTextSpecial: {
    fontWeight: 'bold',
    fontSize: 17,
    color: 'white',
  },
  logoutButton: {
    justifyContent: 'flex-end',
  },
  modalTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
    paddingRight: 10,
    textAlign: 'center',
  },
  /* Avatar */
  avatarContainer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
  },
  avatarName: {
    textAlign: 'center',
    fontSize: 23,
    fontWeight: 'bold',
  },
  /* Point Board */
  pointBoard: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  pointBoardSection: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointBoardSectionHeader: {
    color: '#000',
    fontWeight: '300',
    lineHeight: 21,
    fontSize: 18,
  },
  pointBoardSectionUnit: {
    marginTop: 10,
    fontWeight: '600',
    fontSize: 30,
    lineHeight: 36,
  },
  /* Giveaway bar */
  giveAwayBarContainer: {
    width: wp(60),
    marginBottom: 15,
  },
  giveAwayBarText: {
    fontSize: 13,
    lineHeight: 14,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 5,
  },
  giveAwayBarProgressView: {
    position: 'absolute',
    width: wp(60),
    marginTop: 8,
  },
  giveAwayBarProgress: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 14,
  },
  /* Add Business */
  addButtonsTitle: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 15,
  },
  addVenueButton: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'rgba(0,0,0,.3)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  addVenueButtonText: {
    textAlign: 'center',
  },
  contentContainerForm: {
    flex: 1,
  },
  containerForm: {
    flex: 1,
  },
});

const loginStyles = StyleSheet.create({
  tagLineBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 50,
  },
  taglineText: {
    fontWeight: '300',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
    fontSize: 26,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  button: {
    width: 298,
    borderRadius: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  appleButton: {
    width: 298,
    borderRadius: 100,
    paddingVertical: 10,
  },
  googleLogin: {
    backgroundColor: '#FFFFFF',
    borderColor: '#B5B5B5',
    borderWidth: 1,
    marginTop: 10,
    minHeight: 40,
    paddingVertical: 12,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
  },
  privacyBox: {
    marginTop: 15,
  },
  privacyText: {
    fontWeight: '300',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
    fontSize: 13,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
  },
});
