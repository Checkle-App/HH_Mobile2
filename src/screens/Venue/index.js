import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MapView, {Marker} from 'react-native-maps';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressiveImage from '../../components/ProgressiveImage';
import Slider from '../../components/Slider';
import CategoryIcons from '../../../assets/Category_Icons';
import {Functions} from '../../utils/constants';
import WebIcon from '../../../assets/icons8-website.svg';

/* Share Venue */
import Share from 'react-native-share';
import handleVenueHours from '../../utils/handleVenueHours';

const handleThumbnail = thumbnail => {
  console.log('thumbnail', thumbnail);
  const size = '_720x720';
  if (thumbnail) {
    // Old Thumbnails
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

    // New Thumbnails pointed at CDN
    // Stored _720x720
    if (thumbnail.includes('https://cdn.checkle.com')) {
      if (thumbnail.includes('_720x720')) {
        let thumbnailFirst = thumbnail.split('_720x720')[0];
        thumbnail = thumbnailFirst + size;
        return thumbnail;
      }
    }

    return thumbnail;
  }

  return thumbnail;
};

const buildLink = async venue => {
  const link = venue.alias
    ? `https://www.checkle.com/biz/${venue.alias}?id=${venue.id}`
    : 'https://www.checkle.com';
  return link;
};

const {width: viewportWidth} = Dimensions.get('window');
function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
const categorySize = wp(6);

const Venue = props => {
  const [loading, setLoading] = useState(true);
  const [venue, setVenue] = useState(null);
  const [shareLink, setShareLink] = useState('');

  const venueId = props.route.params.venueId;
  useEffect(() => {
    async function fetchInfo() {
      setLoading(true);

      const venueRes = await Functions.readVenue(
        venueId,
        props.locationAvailable ? props.userLocation : null,
        true,
      );
      setVenue(venueRes);

      props.navigation.setOptions({
        headerTitle: venueRes.name,
      });

      if (venueRes) {
        const builtLink = await buildLink(venueRes);
        setShareLink(builtLink);
      }

      setLoading(false);
    }

    if (venueId) {
      fetchInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueId]);

  const handleOpenMenu = () => {
    const {properties} = venue;

    if (properties.menuLink || properties.menu) {
      Linking.openURL(
        properties.menuLink
          ? `https://checkle.menu/${properties.menuLink}`
          : properties.menu[0]
          ? properties.menu[0].preview
            ? properties.menu[0].preview
            : properties.menu
          : properties.menu,
      );
    } else {
      Alert.alert('No menu found.');
    }
  };

  const handleDirectionsTo = () => {
    if (venue.properties.mapsUrl) {
      Linking.openURL(venue.properties.mapsUrl);
    } else {
      Alert.alert('Venue directions not found.');
    }
  };

  const handleOpenWebsite = () => {
    const {properties} = venue;

    if (properties.website) {
      Linking.openURL(properties.website);
    } else {
      Alert.alert('Website not found.');
    }
  };

  const handleVenueShare = async () => {
    if (shareLink) {
      const title = `${venue.name} in ${venue.location.city}`;

      const options = {
        title: title,
        message: `Check out ${venue.name} on Checkle!`,
        url: shareLink,
      };
      try {
        await Share.open(options);
      } catch (err) {
        /// Canceled share
      }
    }
  };

  const handlePriceLevel = priceLevel => {
    switch (priceLevel) {
      case 1:
        return '$';
      case 2:
        return '$$';
      case 3:
        return '$$$';
      case 4:
        return '$$$$';
      default:
        return;
    }
  };

  const makeCall = telephone => {
    let phoneNumber = telephone;
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${telephone}`;
    } else {
      phoneNumber = `telprompt:${telephone}`;
    }

    Linking.openURL(phoneNumber);
  };

  const handleVenueDealRequest = async () => {
    Functions.venueDealRequest(venueId);

    Alert.alert('Request sent. Thanks for your help!');
  };

  console.log(venue);

  return loading ? (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <>
      <ScrollView
        automaticallyAdjustsScrollIndicatorInsets={false}
        scrollIndicatorInsets={{right: 1}}
        style={styles.mainContainer}
        bounces={false}>
        <ProgressiveImage
          thumbnailSource={{
            uri: handleThumbnail(
              venue.venuePhotos
                ? venue.venuePhotos[0].thumbnail
                : venue.properties.thumbnail,
            ),
          }}
          source={{
            uri: handleThumbnail(
              venue.venuePhotos
                ? venue.venuePhotos[0].thumbnail
                : venue.properties.thumbnail,
            ),
          }}
          resizeMode="cover"
          style={{width: 414, height: 350}}
        />
        <View style={styles.venueHeader}>
          <View style={styles.venueTitle}>
            <Text style={styles.venueName}>{venue.name}</Text>
          </View>
          {(venue.distance || venue.properties.priceLevel) && (
            <View style={styles.venueHeaderInfo}>
              {venue.distance && (
                <Text style={styles.venueHeaderInfoText}>
                  {venue.distance ? `Distance: ${venue.distance} mi` : ''}
                </Text>
              )}
              <Text style={styles.venueHeaderInfoText}>
                {handlePriceLevel(venue.properties.priceLevel)}
              </Text>
            </View>
          )}
          {venue.hoursOfOperation
            ? handleVenueHours(
                venue.hoursOfOperation
                  ? venue.hoursOfOperation.weekdayHours
                  : [],
                venue.location.timezone || 'America/Chicago',
              )
            : null}
          {venue.properties.amentities ? (
            <View
              style={{marginTop: 15, flexDirection: 'row', flexWrap: 'wrap'}}>
              {venue.properties.amentities
                ? venue.properties.amentities.outdoorSeating && (
                    <TouchableOpacity
                      style={[{flexBasis: '50%'}]}
                      activeOpacity={1}>
                      <View style={styles.categoryContainer}>
                        <View
                          style={[
                            styles.categoryIcon,
                            {
                              width: categorySize * 1.5,
                              height: categorySize * 1.5,
                              borderRadius: categorySize,
                            },
                          ]}>
                          <CategoryIcons.OutdoorSeatingIcon
                            height={categorySize}
                            width={categorySize}
                          />
                        </View>
                        <Text>Outdoor Seating</Text>
                      </View>
                    </TouchableOpacity>
                  )
                : null}
              {venue.properties.amentities
                ? venue.properties.amentities.petFriendly && (
                    <TouchableOpacity
                      style={[{flexBasis: '50%'}]}
                      activeOpacity={1}>
                      <View style={styles.categoryContainer}>
                        <View
                          style={[
                            styles.categoryIcon,
                            {
                              width: categorySize * 1.5,
                              height: categorySize * 1.5,
                              borderRadius: categorySize,
                            },
                          ]}>
                          <CategoryIcons.PetFriendlyIcon
                            height={categorySize}
                            width={categorySize}
                          />
                        </View>
                        <Text>Pet Friendly</Text>
                      </View>
                    </TouchableOpacity>
                  )
                : null}
            </View>
          ) : null}
        </View>
        <View style={styles.venueActions}>
          <TouchableOpacity
            style={[
              styles.venueAction,
              {
                borderRightWidth: 1,
                borderColor: 'rgba(0,0,0,.1)',
              },
            ]}
            onPress={() => makeCall(venue.properties.telephone)}>
            <MaterialCommunityIcon size={35} color={'#AFADB2'} name={'phone'} />
            <Text style={styles.dealActionText}>Phone</Text>
          </TouchableOpacity>
          {venue.properties.menu || venue.properties.menuLink ? (
            <TouchableOpacity
              style={[
                styles.venueAction,
                {
                  borderRightWidth: 1,
                  borderColor: 'rgba(0,0,0,.1)',
                },
              ]}
              onPress={handleOpenMenu}>
              <MaterialIcon
                size={35}
                color={'#AFADB2'}
                name={'restaurant-menu'}
              />
              <Text style={styles.dealActionText}>Menu</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={[
              styles.venueAction,
              {
                borderRightWidth: 1,
                borderColor: 'rgba(0,0,0,.1)',
              },
            ]}
            onPress={handleVenueShare}>
            <MaterialCommunityIcon size={35} color={'#AFADB2'} name={'share'} />
            <Text style={styles.dealActionText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.venueAction}
            onPress={handleDirectionsTo}>
            <MaterialCommunityIcon
              size={35}
              color={'#AFADB2'}
              name={'directions'}
            />
            <Text style={styles.dealActionText}>Directions</Text>
          </TouchableOpacity>
        </View>
        {venue.deals ? (
          <View
            style={{
              flex: 1,
              marginTop: 40,
              marginBottom: 25,
              paddingHorizontal: 20,
            }}>
            <Text
              style={{
                fontWeight: '500',
                marginHorizontal: 5,
                marginBottom: 10,
                fontSize: 16,
              }}>
              {'Happy hours & specials'}
            </Text>
            <Slider
              data={Object.values(venue.deals).filter(
                deal => deal.isActive && deal.timeObject,
              )}
              type="deal"
            />
          </View>
        ) : (
          <View style={[styles.dealContent, {marginVertical: 20}]}>
            <TouchableOpacity
              style={[
                styles.requestButtons,
                {
                  backgroundColor: '#624185',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                },
              ]}
              onPress={() => handleVenueDealRequest()}>
              <Text
                style={[
                  styles.requestButtonText,
                  {textShadowColor: '#67448B'},
                ]}>
                Request deals for this venue
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {venueId && (
          <View style={styles.venueProblemContainer}>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingHorizontal: 10,
                paddingVertical: 15,
                borderRadius: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,.1)',
              }}
              onPress={() =>
                Linking.openURL(
                  `https://www.checkle.com/biz_update?id=${venueId}`,
                )
              }>
              <View>
                <Text
                  style={{
                    color: 'rgb(0, 115, 187)',
                    fontSize: 15,
                  }}>{`Edit Business`}</Text>
                <Text>Suggest changes to business</Text>
              </View>
              <MaterialCommunityIcon
                name="pencil-outline"
                size={25}
                color={'#000'}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={[styles.dealContent, {marginTop: 20}]}>
          <Text style={styles.dealSubHeader}>Location</Text>
          <Text style={styles.venueLocationName}>{venue.name}</Text>
          <Text style={styles.dealParagraph}>
            {`${venue.location.address}\n${venue.location.city}, ${venue.location.state}, ${venue.location.zipcode}`}
          </Text>
          <View style={{flex: 1, marginTop: 15}}>
            <MapView
              style={styles.venueLocationMap}
              initialRegion={{
                ...venue.location.coordinates,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              rotateEnabled={false}
              zoomTapEnabled={false}
              zoomEnabled={false}
              showsMyLocationButton={false}
              showsUserLocation={false}
              scrollEnabled={false}>
              <Marker
                tracksViewChanges={false}
                title={venue.name}
                coordinate={{...venue.location.coordinates}}
              />
            </MapView>
            <TouchableOpacity
              onPress={handleDirectionsTo}
              style={{
                flex: 1,
                backgroundColor: '#624185',
                paddingTop: 15,
                paddingBottom: 15,
                paddingRight: 20,
                paddingLeft: 20,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}>
              <Text style={styles.venueButtonText}>
                {`Navigate to ${venue.name}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[
            styles.dealContent,
            {
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            },
          ]}>
          <Text style={styles.connectText}>Connect with</Text>
          <Text style={styles.connectVenue}>{venue.name}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingHorizontal: 35,
            marginBottom: 70,
          }}>
          {venue.properties.telephone && (
            <TouchableOpacity
              onPress={() => this.makeCall(venue.properties.telephone)}>
              <MaterialCommunityIcon
                name="phone"
                size={35}
                color={'#624185'}
                style={{
                  marginLeft: 14,
                  marginRight: 14,
                }}
              />
            </TouchableOpacity>
          )}
          {venue.properties.website ? (
            <TouchableOpacity
              style={{
                height: 35,
                width: 35,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginLeft: 14,
                marginRight: 14,
              }}
              onPress={handleOpenWebsite}>
              <WebIcon width={30} height={30} />
            </TouchableOpacity>
          ) : null}
          {venue.properties.facebook ? (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(venue.properties.facebook);
              }}>
              <MaterialCommunityIcon
                name="facebook"
                size={35}
                color={'#3B5998'}
                style={{
                  marginLeft: 14,
                  marginRight: 14,
                }}
              />
            </TouchableOpacity>
          ) : null}
          {venue.properties.instagram ? (
            <TouchableOpacity
              style={{
                height: 35,
                width: 35,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginLeft: 14,
                marginRight: 14,
              }}
              onPress={() => {
                Linking.openURL(venue.properties.instagram);
              }}>
              <Image
                source={require('../../../assets/instagramLogo.png')}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </TouchableOpacity>
          ) : null}
          {venue.properties.twitter ? (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(venue.properties.twitter);
              }}>
              <MaterialCommunityIcon
                name="twitter"
                size={35}
                color={'#38A1F3'}
                style={{
                  marginLeft: 14,
                  marginRight: 14,
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
};

const mapStateToProps = state => ({
  locationAvailable: state.location.locationAvailable,
  userLocation: state.location.location,
});

export default connect(mapStateToProps, null)(Venue);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F6FAFF',
  },
  venueHeader: {
    flex: 1,
    flexDirection: 'column',
    paddingRight: 30,
    paddingLeft: 30,
  },
  venueTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  venueName: {
    fontWeight: 'bold',
    fontSize: 21,
    letterSpacing: 0.25,
    color: '#000000',
    marginTop: 15,
    marginBottom: 15,
    marginRight: 8,
    flex: 5,
  },
  venueLocationName: {
    fontWeight: '500',
    lineHeight: 34,
    fontSize: 17,
    color: '#624185',
  },
  venueLocationMap: {
    flex: 1,
    width: '100%',
    height: 200,
  },
  venueHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  venueHeaderInfoText: {
    // fontWeight: '500',
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  venueButtonText: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 0.25,
    color: '#FFFFFF',
  },
  venueActions: {
    marginTop: 15,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderColor: '#DADADA',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 15,
  },
  venueAction: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dealActionText: {
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: 0.25,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  dealContent: {
    ppaddingTop: 20,
    paddingBottom: 20,
    paddingRight: 30,
    paddingLeft: 30,
  },
  dealSubHeader: {
    fontWeight: '500',
    lineHeight: 34,
    fontSize: 18,
    letterSpacing: 0.25,
    color: '#000000',
  },
  dealParagraph: {
    lineHeight: 30,
    fontSize: 15,
    color: '#000000',
  },
  dealLikeNumber: {
    fontWeight: '500',
    fontSize: 44,
    textAlign: 'right',
    letterSpacing: 0.25,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  dealLikeText: {
    fontWeight: '300',
    fontSize: 18,
    letterSpacing: 0.25,
    color: '#000000',
    marginBottom: 8,
    marginLeft: 4,
  },
  connectText: {
    fontWeight: '300',
    fontSize: 24,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.7)',
  },
  connectVenue: {
    fontWeight: '500',
    fontSize: 24,
    textAlign: 'center',
    color: '#624185',
  },
  topDealName: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
    paddingRight: 10,
    textAlign: 'center',
  },
  /* Request Buttons */
  requestButtons: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 100,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  requestButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
  /* Claim Modal */
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
  modalTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
    paddingRight: 10,
    textAlign: 'center',
  },
  /* Categroy Icon */
  categoryIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueProblemContainer: {
    flex: 1,
    marginTop: 25,
    marginBottom: 25,
    paddingHorizontal: 30,
  },
});
