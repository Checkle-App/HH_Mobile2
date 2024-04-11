import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Functions, Position} from './utils/constants';

/* NAV */
import {createStackNavigator} from '@react-navigation/stack';
import {withTheme} from 'react-native-paper';
import MainRootNav from './MainRootNav';

/* Redux */
import {connect} from 'react-redux';
import * as actions from './utils/redux/actions';

// import Smartlook from 'smartlook-react-native-wrapper';
// Smartlook.setupAndStartRecording('3bc209a45ebb1ddc06076144fc4c2eebb241b634');

const Stack = createStackNavigator();

const Main = props => {
  const handlePermissionCheck = async () => {
    let permissionBool = false;
    if (Platform.OS === 'ios') {
      await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            break;
          case RESULTS.DENIED:
            break;
          case RESULTS.GRANTED:
            permissionBool = true;
            break;
          case RESULTS.BLOCKED:
            break;
        }
      });
    } else {
      await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            break;
          case RESULTS.DENIED:
            break;
          case RESULTS.GRANTED:
            permissionBool = true;
            break;
          case RESULTS.BLOCKED:
            break;
        }
      });
    }
    return permissionBool;
  };

  async function fetchLocation() {
    props.dispatchSetApp({
      loading: true,
    });

    const homePage = await Functions.getHomePage();
    props.dispatchSetInitial({homePage});

    const locationAvailable = await handlePermissionCheck();

    if (locationAvailable) {
      const latestPosition = await Position.get();

      if (latestPosition) {
        props.dispatchSetLocation({
          locationAvailable,
          location: latestPosition,
        });
        props.dispatchSetSearch({
          searchQuery: {
            text: '',
            location: latestPosition,
          },
        });

        // Home Page Deals
        let deals = await Functions.fetchDeals({
          userLocation: latestPosition,
          searchQuery: {
            text: '',
            location: latestPosition,
          },
        });

        // /* Calc home deals */
        let getInitialDeals = dealsPassed => {
          let getPopularDeals = dealsByType => {
            return dealsByType.sort((dealA, dealB) => {
              const heartsA = dealA.hearts || 0;
              const heartsB = dealB.hearts || 0;
              return heartsB - heartsA || dealA.distance - dealB.distance;
            });
          };
          const removeDuplicates = dealsPassed.reduce((acc, current) => {
            const x = acc.find(item => item.id === current.id);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
          const popularDealsSorted = getPopularDeals(removeDuplicates);
          const popularDeals = popularDealsSorted.slice(0, 8);
          const bestDrinks = popularDealsSorted.filter(deal =>
            deal.dealType.includes('Drink'),
          );
          const favoriteFoods = popularDealsSorted.filter(deal =>
            deal.dealType.includes('Food'),
          );
          const events = popularDealsSorted.filter(deal =>
            deal.dealType.includes('Event'),
          );
          const filteredDrinks = bestDrinks
            .filter(bestDrink => {
              if (popularDeals.find(item => item.id === bestDrink.id)) {
                return false;
              } else {
                return true;
              }
            })
            .slice(0, 8);
          const filteredFood = favoriteFoods
            .filter(favFood => {
              if (
                popularDeals.find(item => item.id === favFood.id) ||
                filteredDrinks.find(item => item.id === favFood.id)
              ) {
                return false;
              } else {
                return true;
              }
            })
            .slice(0, 8);
          const filteredEvents = events.slice(0, 8);
          return {
            popularDeals: popularDeals.sort(() => Math.random() - 0.5),
            bestDrinks: filteredDrinks.sort(() => Math.random() - 0.5),
            favoriteFoods: filteredFood.sort(() => Math.random() - 0.5),
            events: filteredEvents.sort(() => Math.random() - 0.5),
          };
        };
        let initialDeals = getInitialDeals(deals.slice());
        props.dispatchSetInitial({
          initialDeals,
        });

        /* Deals for feed */
        props.dispatchSetDeals({
          deals,
        });

        props.dispatchSetApp({
          loading: false,
        });
      }
    } else {
      /* Request location */
      if (Platform.OS === 'ios') {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(async result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              props.dispatchSetApp({
                loading: false,
              });
              break;
            case RESULTS.DENIED:
              props.dispatchSetApp({
                loading: false,
              });
              break;
            case RESULTS.GRANTED:
              await fetchLocation();
              break;
            default:
              props.dispatchSetApp({
                loading: false,
              });
              break;
          }
        });
      }
      if (Platform.OS === 'android') {
        request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(async result => {
          switch (result) {
            case RESULTS.GRANTED:
              await fetchLocation();
              break;
            default:
              props.dispatchSetApp({
                loading: false,
              });
              break;
          }
        });
      }
    }
  }

  useEffect(() => {
    /* Prompt for location */
    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.deeplink) {
      const {path, id} = props.deeplink;
      if (path === 'deal') {
        props.navigation.push('Deal', {dealId: id});
      }
      if (path === 'venue') {
        props.navigation.push('Venue', {venueId: id});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.deeplink]);

  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name="Main"
        component={MainRootNav}
        gestureEnabled={false}
      />
    </Stack.Navigator>
  );
};

const mapStateToProps = state => ({
  deeplink: state.deeplink,
});

const mapDispatchToProps = {
  dispatchSetApp: actions.setApp,
  dispatchSetInitial: actions.setInitial,
  dispatchSetDeals: actions.setDeals,
  dispatchSetVenues: actions.setVenues,
  dispatchSetUser: actions.setUser,
  dispatchSetLocation: actions.setLocation,
  dispatchSetSearch: actions.setSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Main));
