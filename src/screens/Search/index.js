import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
  Keyboard,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Position, Functions} from '../../utils/constants';
import ProgressiveImage from '../../components/ProgressiveImage';
import {debounce} from 'lodash';
import * as actions from '../../utils/redux/actions';
import keys from '../../../keys';

const handleThumbnail = thumbnail => {
  const size = '_100x100';
  if (thumbnail) {
    if (
      thumbnail.includes(
        'https://firebasestorage.googleapis.com/v0/b/checkle-prod.appspot.com/o',
      )
    ) {
      thumbnail = thumbnail.replace(
        'https://firebasestorage.googleapis.com/v0/b/checkle-prod.appspot.com/o',
        'https://cdn.checkle.com',
      );

      // Webp from scrape
      if (thumbnail.includes('.png?alt=media')) {
        thumbnail = thumbnail.split('.png?alt=media')[0] + `${size}.webp`;
        return thumbnail;
      }

      // Webp from C4B upload
      if (thumbnail.includes('_1500x1500')) {
        let thumbnailFirst = thumbnail.split('_1500x1500')[0];
        thumbnail = thumbnailFirst + size;
        return thumbnail;
      }
    }

    return thumbnail;
  }
};

const GooglePlacesInput = props => {
  const screenHeight = Math.round(Dimensions.get('window').height);
  const getAddress = address_components => {
    let typeMap = {
      city: ['locality'],
      state: ['administrative_area_level_1'],
    };

    let address = {
      city: '',
      state: '',
    };
    address_components.forEach(component => {
      for (let type in typeMap) {
        if (typeMap[type].indexOf(component.types[0]) !== -1) {
          if (type === 'state') {
            address[type] = component.short_name;
          } else {
            address[type] = component.long_name;
          }
        }
      }
    });
    return {
      city: address.city,
      state: address.state,
    };
  };

  const [listVisible, setListVisibile] = useState(null);
  const exactPosition = Position.latest();
  const currentLocation = {
    description: 'Current Location',
    geometry: {
      location: {
        lat: exactPosition ? exactPosition.latitude : 0,
        lng: exactPosition ? exactPosition.longitude : 0,
      },
    },
  };

  return (
    <GooglePlacesAutocomplete
      componentId="placesInput"
      placeholder="Current Location"
      minLength={2}
      autoFocus={false}
      returnKeyType={'search'}
      keyboardAppearance={'light'}
      listViewDisplayed={listVisible}
      fetchDetails={true}
      renderDescription={row => row.description}
      onPress={(data, details = null) => {
        let location;
        if (data.description === 'Current Location') {
          location = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          };
        } else {
          location = getAddress(details.address_components);
          location.latitude = details.geometry.location.lat;
          location.longitude = details.geometry.location.lng;
        }
        setListVisibile(null);

        props.grabSearchResults({
          text: '',
          location,
        });
        props.setSearchText('');
        props.setSearchLocation(location);
        return;
      }}
      query={{
        key: keys.googlePlacesAPIKey,
        language: 'en',
        region: 'US',
        types: '(cities)',
        components: 'country:us',
      }}
      styles={{
        container: {
          backgroundColor: 'white',
        },
        listView: {
          backgroundColor: 'white',
          height: screenHeight,
        },
        textInputContainer: {
          backgroundColor: 'white',
          paddingHorizontal: 10,
          borderTopWidth: 0,
          paddingTop: 4,
          height: 50,
        },
        textInput: {
          fontSize: 16,
          paddingLeft: 9,
          paddingRight: 5,
          color: '#624185',
        },
        description: {
          fontWeight: 'bold',
        },
        poweredContainer: {
          opacity: 0,
        },
      }}
      getDefaultValue={() =>
        props.searchLocation
          ? props.searchLocation.city
            ? `${props.searchLocation.city}, ${props.searchLocation.state}`
            : ''
          : ''
      }
      nearbyPlacesAPI="GooglePlacesSearch"
      GooglePlacesSearchQuery={{
        rankby: 'distance',
      }}
      predefinedPlaces={[currentLocation]}
      filterReverseGeocodingByTypes={[
        'locality',
        'administrative_area_level_3',
      ]}
      debounce={200}
      renderLeftButton={() => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: 30,
            height: 40,
          }}>
          <MaterialIcon size={25} color={'#624185'} name={'location-on'} />
        </View>
      )}
    />
  );
};

const Search = props => {
  const [searchText, setSearchText] = useState(props.searchQuery.text);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLocation, setSearchLocation] = useState({
    ...props.searchQuery.location,
  });

  const grabSearchResults = async searchQueryItem => {
    const results = await Functions.mixedSearch({
      searchQuery: searchQueryItem,
    });

    setSearchResults(results);
  };

  useEffect(() => {
    grabSearchResults(props.searchQuery);
  }, [props.searchQuery]);

  const handleRenderItem = res => {
    const {item} = res;
    let isDeal = item.type === 'deal' ? true : false;
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.resultContainer}
        onPress={() => {
          isDeal
            ? props.navigation.push('Deal', {dealId: item.id})
            : props.navigation.push('Venue', {venueId: item.id});
        }}>
        <View
          style={[
            styles.result,
            res.index + 1 === searchResults.length
              ? {borderBottomWidth: 0}
              : {},
          ]}>
          <ProgressiveImage
            thumbnailSource={{
              uri: handleThumbnail(item.thumbnail),
            }}
            source={{uri: handleThumbnail(item.thumbnail)}}
            resizeMode="cover"
            style={styles.image}
            containerStyle={styles.containerImage}
            blurViewRadius={8}
          />
          <View style={styles.item}>
            <Text style={styles.title} numberOfLines={1}>
              {item.name}
            </Text>
            <Text numberOfLines={1} style={styles.location}>
              {isDeal
                ? item.venueName
                : `${item.location.address.trim()}, ${item.location.city.trim()}`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const debounceExecuteSearch = debounce(grabSearchResults, 100);

  const handleSearch = async (text, location) => {
    if (props.loading) {
      return;
    }

    // If no location passed in, use latest search location
    const searchQuery = {
      text: text,
      location: location ? location : props.searchLocation,
    };

    /* No location available to use */
    if (!searchQuery.location) {
      props.navigation.navigate('Feed');
      return;
    }

    props.dispatchSetSearch({
      searchQuery,
    });
    props.navigation.navigate('Feed');
    props.dispatchSetApp({
      loading: true,
    });
    let deals = await Functions.fetchDeals({
      searchQuery,
      userLocation: props.userLocation,
    });
    props.dispatchSetDeals({
      deals,
    });
    props.dispatchSetApp({loading: false});
  };

  return (
    <>
      <View
        style={{flexDirection: 'column', flex: 1, justifyContent: 'center'}}>
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            backgroundColor: 'white',
          }}>
          <View style={styles.searchContainer}>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                backgroundColor: 'white',
                borderBottomColor: 'rgba(0,0,0,.1)',
                borderBottomWidth: 1,
                height: 55,
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                  }}>
                  <MaterialIcon
                    size={25}
                    color={'rgba(0, 0, 0, 0.6)'}
                    name={'search'}
                  />
                  <View
                    style={{
                      paddingLeft: 12,
                      paddingRight: 5,
                      flex: 1,
                    }}>
                    <TextInput
                      placeholder={'Search deals and venues'}
                      style={{fontSize: 16}}
                      returnKeyType={'search'}
                      value={searchText}
                      onChangeText={val => {
                        setSearchText(val);
                        debounceExecuteSearch({
                          text: val,
                          location: searchLocation,
                        });
                      }}
                      onSubmitEditing={() => {
                        if (!props.locationAvailable && !searchLocation.city) {
                          return;
                        }
                        handleSearch(searchText, searchLocation);
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              position: 'absolute',
              height: 104,
              width: 60,
              backgroundColor: 'white',
              borderLeftColor: 'rgba(0,0,0,.1)',
              borderLeftWidth: 1,
              right: 0,
              zIndex: 10001,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              if (!props.locationAvailable && !searchLocation.city) {
                return;
              }
              handleSearch(searchText, searchLocation);
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  !props.locationAvailable && !searchLocation.city
                    ? 'rgba(0,0,0,0.2)'
                    : '#624185',
                borderRadius: 5,
                padding: 6,
              }}>
              <MaterialIcon
                size={22}
                color={'rgba(255, 255, 255, 1)'}
                name={'search'}
              />
            </View>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              flexDirection: 'column',
            }}>
            <FlatList
              data={searchResults}
              renderItem={handleRenderItem}
              style={{
                paddingTop: 10,
                marginTop: 50,
              }}
              contentContainerStyle={{paddingBottom: 50}}
              onScrollBeginDrag={() => Keyboard.dismiss()}
              ListEmptyComponent={
                <Text style={{padding: 10}}>No results found.</Text>
              }
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                position: 'absolute',
                zIndex: 10000,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0,0,0,.1)',
              }}>
              <View style={{flexDirection: 'row', backgroundColor: 'white'}}>
                <GooglePlacesInput
                  searchLocation={searchLocation}
                  setSearchLocation={setSearchLocation}
                  setSearchText={setSearchText}
                  grabSearchResults={grabSearchResults}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const mapStateToProps = state => ({
  // user: state.user.user,
  userLocation: state.location.location,
  loading: state.app.loading,
  searchQuery: state.search.searchQuery,
  locationAvailable: state.location.locationAvailable,
  // loadingLocation: state.location.loadingLocation,
});

const mapDispatchToProps = {
  dispatchSetApp: actions.setApp,
  dispatchSetSearch: actions.setSearch,
  dispatchSetDeals: actions.setDeals,
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 60,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  containerImage: {
    borderRadius: 8,
    marginRight: 10,
  },
  blurViewStyle: {
    borderRadius: 8,
  },
  resultContainer: {
    backgroundColor: 'white',
    paddingLeft: 10,
  },
  result: {
    flexDirection: 'row',
    padding: 5,
    paddingLeft: 0,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,.2)',
  },
  item: {
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
  },
  location: {
    color: 'rgba(0,0,0,.7)',
    fontSize: 13,
  },
  alertButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 0.25,
    color: '#624185',
  },
  /* Sorting Modal Styles */
  cover: {
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  sheet: {
    zIndex: 1000,
    height: '100%',
    justifyContent: 'flex-end',
  },
});
