import React from 'react';
import {View, Text, TouchableOpacity, Platform, Linking} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {Functions, Position} from '../utils/constants';
import {
  setDeals,
  setInitial,
  setLocation,
  setSearch,
} from '../utils/redux/actions';
import {connect} from 'react-redux';

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

const NoLocation = props => {
  const {loadingLocation} = props;

  async function fetchLocation() {
    const latestPosition = await Position.get();

    if (latestPosition) {
      props.dispatchSetLocation({
        locationAvailable: true,
        position: latestPosition,
      });
      props.dispatchSetSearch({
        userLocation: latestPosition,
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
        locationAvailable: true,
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
    }
  }

  const handleRetryLocation = async () => {
    const permissionAvailable = await handlePermissionCheck();
    if (!permissionAvailable) {
      if (Platform.OS === 'ios') {
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(async result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              Linking.openURL('app-settings:');
              break;
            case RESULTS.DENIED:
              Linking.openURL('app-settings:');
              break;
            case RESULTS.GRANTED:
              try {
                props.dispatchSetLocation({
                  loadingLocation: true,
                });
                await fetchLocation();
                props.dispatchSetLocation({
                  loadingLocation: false,
                });
              } catch (err) {
                props.dispatchSetLocation({
                  loadingLocation: false,
                });
              }
              break;
            case RESULTS.BLOCKED:
              Linking.openURL('app-settings:');
              break;
          }
        });
      }
      if (Platform.OS === 'android') {
        request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(async result => {
          switch (result) {
            case RESULTS.GRANTED:
              try {
                props.dispatchSetLocation({
                  loadingLocation: true,
                });
                await fetchLocation();
                props.dispatchSetLocation({
                  loadingLocation: false,
                });
              } catch (err) {
                props.dispatchSetLocation({
                  loadingLocation: false,
                });
              }
              break;
            default:
              props.dispatchSetLocation({
                loadingLocation: false,
              });
          }
        });
      }
    } else {
      /* Permission Available */
      props.dispatchSetLocation({
        loadingLocation: true,
      });
      await fetchLocation();
      props.dispatchSetLocation({
        loadingLocation: false,
      });
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 5,
        marginTop: 30,
        flexDirection: 'column',
      }}>
      <Text style={{textAlign: 'center'}}>
        Where'd you go? Your location couldn't be found.
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 15,
          paddingVertical: 10,
        }}>
        {loadingLocation ? (
          <ActivityIndicator size="large" />
        ) : (
          <TouchableOpacity
            style={[
              {
                backgroundColor: '#624185',
                paddingVertical: 10,
                paddingHorizontal: 25,
                marginTop: 15,
                width: 250,
                borderRadius: 8,
              },
            ]}
            onPress={handleRetryLocation}>
            <Text style={{color: '#fff', textAlign: 'center'}}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  loadingLocation: state.location.loadingLocation,
});

const mapDispatchToProps = {
  dispatchSetSearch: setSearch,
  dispatchSetInitial: setInitial,
  dispatchSetDeals: setDeals,
  dispatchSetLocation: setLocation,
};

export default connect(mapStateToProps, mapDispatchToProps)(NoLocation);
