import React, {useRef} from 'react';
import {connect} from 'react-redux';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import ClusteredMapView from 'react-native-maps-super-cluster';
import Icon from 'react-native-vector-icons/Ionicons';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import CategoryIcon from '../../components/CategoryIcon';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {debounce} from 'lodash';
import NoLocation from '../../components/NoLocation';

const latitudeDelta = 0.04;
const longitudeDelta = 0.04;

const DealPin = props => {
  const customMarker = deal => {
    return (
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <CategoryIcon dealType={deal.categories.slice(0, 1)} />
        <View
          style={{
            flexDirection: 'column',
            padding: 5,
            marginTop: 10,
            backgroundColor: 'rgba(255,255,255,1)',
            borderRadius: 10,
            maxWidth: 100,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
          }}>
          <Text
            numberOfLines={3}
            style={{
              fontSize: 13,
              color: '#624185',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {deal.name}
          </Text>
        </View>
      </View>
    );
  };

  const {deal} = props;
  const onPinChosen = () => {
    props.navigation.push('Deal', {dealId: deal.id});
  };

  return (
    <Marker
      identifier={deal.id}
      coordinate={deal.location}
      tracksViewChanges={false}
      onPress={onPinChosen}>
      {customMarker(deal)}
    </Marker>
  );
};

const statusBarHeight =
  Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight;

const Map = props => {
  const mapRef = useRef(null);

  const handleLocate = () => {
    const {latitude, longitude} = props.userLocation;

    animateToRegion(latitude, longitude);
  };

  const animateToRegion = (latitude, longitude) => {
    if (mapRef.current) {
      mapRef.current.getMapRef().animateToRegion({
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      });
    }
  };

  const renderCluster = (cluster, onPress) => {
    const pointCount = cluster.pointCount,
      coordinate = cluster.coordinate,
      clusterId = cluster.clusterId;

    return (
      <Marker
        tracksViewChanges={false}
        identifier={`cluster-${clusterId}`}
        coordinate={coordinate}
        onPress={onPress}>
        <View style={styles.clusterContainer}>
          <Text style={styles.clusterText}>{pointCount}</Text>
        </View>
      </Marker>
    );
  };

  let data = [];
  const mappedDeals = Object.values(
    props.deals.reduce(
      (store, deal) =>
        Object.keys(store).includes(deal.venueId)
          ? store
          : {
              ...store,
              [deal.venueId]: props.deals.find(
                findDeal => findDeal.id === deal.id,
              ),
            },
      {},
    ),
  );

  if (!mappedDeals.length) {
    data = [];
  } else {
    data = mappedDeals
      .slice(0, 200)
      .map(deal => {
        return {
          ...deal,
          location: {
            latitude: Number(deal.location.coordinates.latitude),
            longitude: Number(deal.location.coordinates.longitude),
          },
          locationReal: deal.location,
        };
      })
      .filter(item => item !== null);
  }

  const {loading} = props;

  const navToSearch = () => {
    props.navigation.push('Search');
  };

  console.log('data', data);

  return (
    <View style={styles.mainContainer}>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" />
        </View>
      ) : !props.locationAvailable ? (
        <View
          style={{
            paddingHorizontal: 30,
            marginTop: 30,
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          }}>
          <NoLocation />
        </View>
      ) : (
        <View style={{backgroundColor: '#F6FAFF', flex: 1}}>
          <LinearGradient
            style={[styles.appBar, {paddingTop: statusBarHeight}]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['rgba(98, 65, 133, 0.8)', 'rgba(255, 163, 69, 0.8)']}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                  marginTop: 5,
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  backgroundColor: 'white',
                }}
                onPress={debounce(navToSearch, 500)}>
                <MaterialIcon
                  size={25}
                  color={'rgba(0, 0, 0, 0.6)'}
                  name={'search'}
                />
                <Text
                  style={{fontSize: 16, paddingHorizontal: 8}}
                  numberOfLines={1}>
                  {props.searchQuery.text
                    ? `${props.searchQuery.text} `
                    : props.searchQuery.location
                    ? ''
                    : 'Search deals and venues'}
                  {props.searchQuery.location ? (
                    <Text style={{color: 'rgba(0,0,0,.2)'}}>
                      {props.searchQuery.location.city
                        ? `${props.searchQuery.location.city} ${props.searchQuery.location.state}`
                        : 'Current Location'}
                    </Text>
                  ) : null}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
          <ClusteredMapView
            radius={45}
            edgePadding={{top: 80, left: 80, bottom: 80, right: 80}}
            ref={mapRef}
            style={styles.container}
            data={data}
            renderMarker={dataItem => (
              <DealPin
                navigation={props.navigation}
                deal={dataItem}
                key={dataItem.id}
              />
            )}
            renderCluster={renderCluster}
            initialRegion={{
              latitudeDelta,
              longitudeDelta,
              latitude: props.searchQuery.location.latitude,
              longitude: props.searchQuery.location.longitude,
            }}
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            showsUserLocation={true}
          />
          {props.locationAvailable && (
            <TouchableOpacity
              style={styles.locateButton}
              onPress={handleLocate}>
              <Icon
                name={Platform.OS === 'ios' ? 'ios-locate' : 'md-locate'}
                size={25}
                color="black"
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  deals: state.deals.deals || [],
  locationAvailable: state.location.locationAvailable,
  loading: state.app.loading,
  userLocation: state.location.location,
  searchQuery: state.search.searchQuery,
});

export default connect(mapStateToProps, null)(Map);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F6FAFF',
  },
  container: {
    flex: 1,
  },
  filterBar: {
    height: 61,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,.2)',
  },
  locateButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 30,
    height: 30,
    backgroundColor: 'white',
    color: 'black',
  },
  clusterContainer: {
    width: 30,
    height: 30,
    padding: 6,
    borderWidth: 1,
    borderRadius: 15,
    alignItems: 'center',
    borderColor: '#624185',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  clusterText: {
    fontSize: 13,
    color: '#624185',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  appBar: {
    backgroundColor: '#624185',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
  },
});

const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#8c49f0',
      },
      {
        saturation: -70,
      },
      {
        weight: 0.5,
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        saturation: -65,
      },
    ],
  },
];
