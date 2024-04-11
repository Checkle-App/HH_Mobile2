import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  View,
  Image,
  Alert,
  useWindowDimensions,
} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';
import MapView, {Marker} from 'react-native-maps';
import ProgressiveImage from '../../components/ProgressiveImage';
import * as actions from '../../utils/redux/actions';
import handleDealTime from '../../utils/handleDealTime';
import {Functions} from '../../utils/constants';
import WebIcon from '../../../assets/icons8-website.svg';
import CategoryIcon from '../../components/CategoryIcon';
import RenderHtml from 'react-native-render-html';

/* Share Deal */
import Share from 'react-native-share';

/* Build share link */
const buildLink = async (deal, venue) => {
  const link = venue.alias
    ? `https://www.checkle.com/biz/${venue.alias}/happy_hours?id=${deal.id}`
    : 'https://www.checkle.com';
  return link;
};

const handleThumbnail = thumbnail => {
  const size = '_720x720';
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

      if (thumbnail.includes('categoryImages')) {
        return thumbnail;
      }
      // Webp from C4B upload
      if (thumbnail.includes('thumbnail_1500x1500')) {
        return thumbnail;
      }

      // Webp from scrape
      if (thumbnail.includes('_1500x1500')) {
        let thumbnailFirst = thumbnail.split('_1500x1500')[0];
        thumbnail = thumbnailFirst + size;
        return thumbnail;
      }
    }

    return thumbnail;
  }
};

const Deal = props => {
  const {width} = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [deal, setDeal] = useState(null);
  const [venue, setVenue] = useState(null);
  const [likeAvailable, setLikeAvailable] = useState(false);
  const [dealLiked, setDealLiked] = useState(false);
  const [dealHearts, setDealHearts] = useState(0);
  const [shareLink, setShareLink] = useState('');

  const dealId = props.route.params.dealId;

  useEffect(() => {
    if (props.user) {
      setLikeAvailable(true);
      if (props.user.likedDeals) {
        if (
          props.user.likedDeals.find(
            likedDealItem => likedDealItem.id === dealId,
          )
        ) {
          setDealLiked(true);
        }
      }
    } else {
      setLikeAvailable(false);
    }
  }, [props.user, dealId]);

  useEffect(() => {
    async function fetchInfo() {
      setLoading(true);
      const dealRes = await Functions.readDeal(dealId);
      const venueRes = await Functions.readVenue(
        dealRes.venueId,
        props.locationAvailable ? props.userLocation : null,
      );
      setDeal(dealRes);

      if (dealRes.hearts) {
        setDealHearts(dealRes.hearts);
      }
      setVenue(venueRes);

      props.navigation.setOptions({
        headerTitle: dealRes.name,
        subTitle: venueRes.name,
      });

      setLoading(false);

      if (dealRes && venueRes) {
        const builtLink = await buildLink(dealRes, venueRes);
        setShareLink(builtLink);
      }
    }

    if (dealId) {
      fetchInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealId]);

  const handleDealLike = async () => {
    if (!dealLiked) {
      Functions.likeDeal(dealId);
      props.dispatchSetUser({
        user: {
          ...props.user,
          likedDeals: [...props.user.likedDeals, deal],
        },
      });
    } else {
      Functions.unlikeDeal(dealId);
      props.dispatchSetUser({
        user: {
          ...props.user,
          likedDeals: props.user.likedDeals.filter(i => i.id !== dealId),
        },
      });
    }

    setDealLiked(!dealLiked);
    setDealHearts(!dealLiked ? dealHearts + 1 : dealHearts - 1);
  };

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
      Alert.alert('Menu not found.');
    }
  };

  const handleDealShare = async () => {
    if (shareLink) {
      const shareTitle = `${deal.name} at ${venue.name}`;

      const options = {
        title: shareTitle,
        message: `Check out ${deal.name} at ${venue.name} on Checkle!`,
        url: shareLink,
      };
      try {
        await Share.open(options);
      } catch (err) {
        /// Canceled share
      }
    }
  };

  const handleDirectionsTo = () => {
    if (venue.properties.mapsUrl) {
      Linking.openURL(venue.properties.mapsUrl);
    } else {
      Alert.alert('Directions not found.');
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

  // handleReportDealIssue = () => {
  //   const {deal} = this.props.route.params;
  //   const {id: dealId, name, types = []} = deal;
  //   Linking.openURL(URLS.reportDeal);
  // };

  const makeCall = telephone => {
    let phoneNumber = telephone;
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${telephone}`;
    } else {
      phoneNumber = `telprompt:${telephone}`;
    }

    Linking.openURL(phoneNumber);
  };

  function handleLinkOnPress(event, href) {
    const removeExtra = href.replace('about:///', '');

    const adjustedLink =
      removeExtra.startsWith('http://') || removeExtra.startsWith('https://')
        ? href
        : `https://${removeExtra}`;
    Linking.openURL(adjustedLink);
  }

  const renderersProps = {
    a: {
      onPress: handleLinkOnPress,
    },
  };

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
    <ScrollView
      automaticallyAdjustsScrollIndicatorInsets={false}
      scrollIndicatorInsets={{right: 1}}
      bounces={false}
      style={styles.mainContainer}
      contentContainerStyle={{paddingBottom: 80}}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <ProgressiveImage
          thumbnailSource={{uri: handleThumbnail(deal.thumbnail)}}
          source={{uri: handleThumbnail(deal.thumbnail)}}
          resizeMode="cover"
          style={{width: 414, height: 350}}
        />
      </View>
      <View style={styles.dealHeader}>
        <Text style={styles.dealName}>{deal.name}</Text>
        {handleDealTime(deal, true)}
        <TouchableOpacity
          onPress={() => {
            props.navigation.push('Venue', {venueId: venue.id});
          }}
          style={{
            flex: 1,
            backgroundColor: '#624185',
            padding: 10,
            borderRadius: 8,
            marginHorizontal: 20,
            marginVertical: 25,
          }}>
          <Text style={styles.venueButtonText}>{`View ${venue.name}`}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dealActions}>
        <TouchableOpacity
          style={[
            styles.dealAction,
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
              styles.dealAction,
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
            styles.dealAction,
            {
              borderRightWidth: 1,
              borderColor: 'rgba(0,0,0,.1)',
            },
          ]}
          onPress={handleDealShare}>
          <MaterialCommunityIcon size={35} color={'#AFADB2'} name={'share'} />
          <Text style={styles.dealActionText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dealAction}
          onPress={handleDirectionsTo}>
          <MaterialCommunityIcon
            size={35}
            color={'#AFADB2'}
            name={'directions'}
          />
          <Text style={styles.dealActionText}>Directions</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.dealContent, {marginTop: 20}]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={[styles.dealSubHeader, {marginBottom: 5}]}>About</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => {
              if (likeAvailable) {
                handleDealLike(deal);
              } else {
                Alert.alert('Please login in order to like deals.', '', [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Go to Login',
                    onPress: () => props.navigation.navigate('Profile'),
                  },
                ]);
              }
            }}>
            <MaterialCommunityIcon
              size={32}
              color={dealLiked ? '#624185' : '#AFADB2'}
              name={'heart'}
            />
            {dealHearts ? (
              <View style={{height: 32, marginLeft: 3}}>
                <Text style={styles.dealLikeText}>
                  {dealHearts < 1 ? '' : dealHearts}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
        <View style={{marginBottom: 8}}>
          <CategoryIcon dealType={deal.categories} showName={true} />
        </View>
        <RenderHtml
          contentWidth={width}
          source={{
            html: deal.description
              ? deal.description.replace('<p><br></p>', '')
              : '',
          }}
          tagsStyles={{
            body: {lineHeight: 22},
            ul: {marginBottom: 0, paddingLeft: 10},
          }}
          renderersProps={renderersProps}
          enableExperimentalMarginCollapsing={true}
          enableExperimentalBRCollapsing={true}
        />
        {deal.hhMenuLink ? (
          <Button
            mode="contained"
            onPress={() => Linking.openURL(deal.hhMenuLink)}
            style={{marginVertical: 10, width: 120}}
            uppercase={false}
            compact={true}
            labelStyle={{letterSpacing: 0}}>
            View menu
          </Button>
        ) : null}
      </View>
      <View style={styles.dealProblemContainer}>
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
            Linking.openURL(`https://www.checkle.com/deal_update?id=${dealId}`)
          }>
          <View>
            <Text
              style={{
                color: 'rgb(0, 115, 187)',
                fontSize: 15,
              }}>{`Edit Deal`}</Text>
            <Text>Suggest changes to deal</Text>
          </View>
          <MaterialCommunityIcon
            name="pencil-outline"
            size={25}
            color={'#000'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.dealContent}>
        <Text style={styles.dealSubHeader}>Location</Text>
        <TouchableOpacity
          onPress={() => {
            props.navigation.push('Venue', {venueId: venue.id});
          }}>
          <Text style={styles.venueLocationName}>{venue.name}</Text>
        </TouchableOpacity>
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
            showsUserLocation={false}
            showsMyLocationButton={false}
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
        <TouchableOpacity
          onPress={() => {
            props.navigation.push('Venue', {venueId: venue.id});
          }}>
          <Text style={styles.connectText}>Connect with</Text>
          <Text style={styles.connectVenue}>{venue.name}</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingHorizontal: 35,
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
  );
};

const mapStateToProps = state => ({
  user: state.user.user,
  locationAvailable: state.location.locationAvailable,
  userLocation: state.location.location,
});

const mapDispatchToProps = {
  dispatchSetUser: actions.setUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Deal);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F6FAFF',
  },
  dealHeader: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  dealName: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 0.25,
    color: '#000000',
    marginTop: 15,
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  dealVenue: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 0.25,
    color: 'rgba(0,0,0,.5)',
    marginBottom: 10,
  },
  dealTime: {
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 0.25,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  venueButton: {
    flex: 1,
    backgroundColor: '#624185',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  venueButtonText: {
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 0.25,
    color: '#FFFFFF',
  },
  dealActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderColor: '#DADADA',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 15,
  },
  dealAction: {
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
  dealLikesGraphicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 30,
    paddingLeft: 30,
  },
  dealContent: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 30,
    paddingLeft: 30,
  },
  dealSubHeader: {
    fontWeight: '400',
    lineHeight: 24,
    fontSize: 18,
    letterSpacing: 0.25,
    color: 'rgba(0,0,0,.8)',
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
    color: '#000000',
    marginBottom: 8,
    marginLeft: 4,
    lineHeight: 32,
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
  connectSocial: {
    marginTop: 15,
    marginBottom: 15,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  connectSocialText: {
    lineHeight: 24,
    fontSize: 16,
    letterSpacing: 0.15,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  venueWebsite: {
    lineHeight: 24,
    fontSize: 16,
    letterSpacing: 0.15,
    color: 'rgba(0, 0, 0, 0.87)',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  dealProblemContainer: {
    flex: 1,
    marginTop: 0,
    marginBottom: 25,
    paddingHorizontal: 30,
  },
  reportButton: {
    flex: 1,
    backgroundColor: '#624185',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 15,
    paddingLeft: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* Double tap animation */
  animatedIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderRadius: 160,
    opacity: 0,
  },

  /* Dialog Container */
  /* Sorting Modal Styles */
  cover: {
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  sheet: {
    zIndex: 1000,
    height: '100%',
    justifyContent: 'flex-start',
  },
  popup: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    minHeight: 80,
    width: '100%',
    paddingVertical: 20,
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#794F9B',
  },
  sortOptionContainer: {
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  sortOption: {
    textAlign: 'left',
    paddingVertical: 13,
    fontSize: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortOptionText: {
    color: 'rgba(0,0,0,0.6)',
  },
});
