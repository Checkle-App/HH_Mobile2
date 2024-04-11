import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
// import {ActivityIndicator} from 'react-native-paper';
import ProgressiveImage from './ProgressiveImage';
// import CategoryIcon from './CategoryIcon';
// import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Functions} from '../utils/constants';
import {connect} from 'react-redux';
import * as actions from '../utils/redux/actions';
import handleDealTime from '../utils/handleDealTime';
import {ListTypes} from '../utils/constants';
import {useNavigation} from '@react-navigation/native';

const handleThumbnail = thumbnail => {
  const size = '_550x550';
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

const Card = props => {
  const navigation = useNavigation();

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     dealLiked: this.props.liked,
  //     loadingPopularDeal: false,
  //   };
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextState.dealLiked !== this.state.dealLiked) {
  //     return true;
  //   }
  //   return false;
  // }

  // handleDealLike = () => {
  //   this.setState({
  //     dealLiked: !this.state.dealLiked,
  //   });
  //   this.props.handleDealLike(this.props.deal);
  // };

  const handleCategorySearch = async category => {
    props.dispatchSetApp({
      loading: true,
    });

    let searchQuery = props.searchQuery;
    searchQuery = {
      ...searchQuery,
      text: category,
    };
    props.dispatchSetSearch({
      searchQuery,
    });

    let deals = await Functions.fetchDeals({
      searchQuery,
      userLocation: props.userLocation,
    });

    props.dispatchSetDeals({
      deals,
    });
    props.dispatchSetApp({
      loading: false,
    });
  };

  const handleCardRender = type => {
    const {deal} = props;

    switch (type) {
      case ListTypes.Deal:
        return (
          <View
            style={[
              props.topBorder
                ? {borderTopWidth: 1, borderTopColor: '#DADADA'}
                : {
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    marginTop: 15,
                  },
              {
                paddingLeft: 10,
                paddingRight: 10,
                paddingBottom: 15,
                backgroundColor: '#FFFFFF',
                marginLeft: 10,
                marginRight: 15,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                elevation: 2,
              },
            ]}>
            <View style={[{flexDirection: 'row'}]}>
              <TouchableOpacity
                style={{paddingTop: 15}}
                onPress={() => {
                  navigation.push('Deal', {dealId: deal.id});
                }}>
                <ProgressiveImage
                  thumbnailSource={{
                    uri: handleThumbnail(deal.thumbnail),
                  }}
                  source={{uri: handleThumbnail(deal.thumbnail)}}
                  resizeMode="cover"
                  style={{width: 100, height: 100, borderRadius: 10}}
                  containerStyle={{borderRadius: 10}}
                  blurViewRadius={10}
                />
              </TouchableOpacity>
              <View style={[{flex: 4, paddingTop: 15}]}>
                <View style={styles.listViewContent}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push('Deal', {dealId: deal.id});
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          flex: 3,
                        }}>
                        <Text style={styles.listViewTitle} numberOfLines={2}>
                          {deal.name}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <Text style={{fontSize: 14, paddingBottom: 8, paddingTop: 4}}>
                    {deal.categories.map((i, index, arr) => (
                      <Text
                        onPress={() => handleCategorySearch(i)}
                        style={{color: 'rgba(0,0,0,.7)'}}
                        key={`${deal.name}-${deal.venueName}-${i}`}>
                        <Text style={{color: 'rgb(0, 115, 187)'}}>{i}</Text>
                        {arr.length - 1 !== index ? ', ' : ''}
                      </Text>
                    ))}
                  </Text>
                  <View
                    style={{
                      paddingVertical: 10,
                    }}>
                    {handleDealTime(deal)}
                  </View>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      marginTop: 5,
                    }}
                    onPress={() => {
                      navigation.push('Venue', {venueId: deal.venueId});
                    }}>
                    <View
                      style={{
                        flex: 3,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.dealLocation} numberOfLines={2}>
                        {deal.venueName}
                      </Text>
                    </View>
                    {deal.distance && (
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                          justifyContent: 'flex-end',
                        }}>
                        <Text
                          style={{fontSize: 14, color: 'rgba(0, 0, 0, 0.7)'}}>
                          {`${deal.distance > 100 ? `100+` : deal.distance} mi`}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        );
      case ListTypes.VenueDealList:
        return (
          // <View
          //   style={{
          //     borderTopWidth: 1,
          //     borderBottomWidth: this.props.isLastDeal ? 1 : 0,
          //     borderColor: '#DADADA',
          //     paddingTop: 10,
          //   }}>
          //   {this.state.loadingPopularDeal ? (
          //     <View style={styles.popularDealsContainer}>
          //       <ActivityIndicator size="large" style={{paddingVertical: 15}} />
          //     </View>
          //   ) : (
          //     <View style={styles.popularDealsContainer}>
          //       <View style={styles.dealContent}>
          //         <TouchableOpacity
          //           onPress={() => {
          //             // this.handlePopularDealLoading(true);
          //             this.props.setDealOpen(true, deal);
          //           }}>
          //           <Text style={styles.listViewTitle} numberOfLines={2}>
          //             {deal.name}
          //           </Text>
          //           <View style={{marginVertical: 5}}>
          //             {handleDealTime(deal)}
          //           </View>
          //         </TouchableOpacity>
          //         <TouchableOpacity
          //           style={{
          //             flexDirection: 'row',
          //             alignItems: 'flex-start',
          //             flex: 1,
          //             marginTop: 5,
          //           }}
          //           onPress={() => {
          //             // this.handlePopularDealLoading(true);
          //             this.props.setVenueOpen(true, deal.venueId);
          //           }}>
          //           <View style={{flex: 3}}>
          //             <Text style={styles.dealLocation} numberOfLines={2}>
          //               {deal.venueName}
          //             </Text>
          //           </View>
          //           {deal.distance && (
          //             <View
          //               style={{
          //                 flexDirection: 'row',
          //                 flex: 1,
          //                 justifyContent: 'flex-end',
          //               }}>
          //               <Text
          //                 style={{fontSize: 15, color: 'rgba(0, 0, 0, 0.7)'}}>
          //                 {`${deal.distance > 100 ? `100+` : deal.distance} mi`}
          //               </Text>
          //             </View>
          //           )}
          //         </TouchableOpacity>
          //       </View>
          //       <View style={[styles.dealActions, {paddingTop: 15}]}>
          //         <View style={{flexDirection: 'row', alignItems: 'center'}}>
          //           <MaterialCommunityIcon
          //             size={32}
          //             color={this.state.dealLiked ? '#624185' : '#AFADB2'}
          //             name={'heart'}
          //             onPress={() => this.handleDealLike(deal)}
          //             style={{marginRight: 5}}
          //           />
          //           <Text style={styles.listDealLikeText}>
          //             {`${deal.hearts || ''} ${
          //               deal.hearts ? `Like${deal.hearts > 1 ? 's' : ''}` : ''
          //             }`}
          //           </Text>
          //         </View>
          //         <View style={{flexDirection: 'row', alignItems: 'center'}}>
          //           <CategoryIcon dealType={this.props.deal.categories} />
          //         </View>
          //       </View>
          //     </View>
          //   )}
          // </View>
          null
        );
      case ListTypes.SettingsVenuesFollowed:
        // const {location} = venue;
        return (
          // <TouchableOpacity
          //   style={[
          //     this.props.topBorder
          //       ? {borderTopWidth: 1, borderTopColor: '#DADADA'}
          //       : {borderTopLeftRadius: 10, borderTopRightRadius: 10},
          //     {
          //       paddingLeft: 10,
          //       paddingRight: 10,
          //       paddingTop: 15,
          //       paddingBottom: 10,
          //       backgroundColor: '#FFFFFF',
          //       marginLeft: 10,
          //       marginRight: 10,
          //       shadowColor: '#000',
          //       shadowOffset: {
          //         width: 0,
          //         height: 1,
          //       },
          //       shadowOpacity: 0.2,
          //       shadowRadius: 1.41,
          //       elevation: 2,
          //     },
          //   ]}
          //   onPress={() => this.props.setVenueOpen(true, venue.id)}>
          //   <View style={[{flexDirection: 'row'}]}>
          //     <ProgressiveImage
          //       thumbnailSource={{
          //         uri:
          //           venue.properties.thumbnailSmall ||
          //           venue.properties.thumbnail,
          //       }}
          //       source={{uri: venue.properties.thumbnail}}
          //       resizeMode="cover"
          //       style={{width: 100, height: 100, borderRadius: 10}}
          //       containerStyle={{borderRadius: 10}}
          //       blurViewRadius={10}
          //     />
          //     <View style={{flex: 1}}>
          //       <View style={styles.listViewContent}>
          //         <Text style={styles.listViewTitle} numberOfLines={2}>
          //           {venue.name}
          //         </Text>
          //         <View
          //           style={{
          //             flexDirection: 'row',
          //             alignItems: 'center',
          //           }}>
          //           <Text style={styles.dealLocation} numberOfLines={2}>
          //             {`${location.address}\n${location.city}, ${location.state}, ${location.zipcode}`}
          //           </Text>
          //         </View>
          //       </View>
          //     </View>
          //   </View>
          // </TouchableOpacity>
          null
        );
      case ListTypes.SettingsLikedDeals:
        return (
          // <View
          //   style={[
          //     this.props.topBorder
          //       ? {borderTopWidth: 1, borderTopColor: '#DADADA'}
          //       : {borderTopLeftRadius: 10, borderTopRightRadius: 10},
          //     {
          //       paddingLeft: 10,
          //       paddingRight: 10,
          //       paddingTop: 15,
          //       paddingBottom: 10,
          //       backgroundColor: this.props.active ? '#FFFFFF' : '#EAEAEC',
          //       marginLeft: 10,
          //       marginRight: 10,
          //       shadowColor: '#000',
          //       shadowOffset: {
          //         width: 0,
          //         height: 1,
          //       },
          //       shadowOpacity: 0.2,
          //       shadowRadius: 1.41,
          //       elevation: 2,
          //     },
          //   ]}>
          //   <View style={[{flexDirection: 'row'}]}>
          //     <TouchableOpacity
          //       onPress={() =>
          //         this.props.active
          //           ? this.props.setDealOpen(true, deal, true)
          //           : alert('This deal is currently inactive.')
          //       }>
          //       <ProgressiveImage
          //         thumbnailSource={{uri: deal.thumbnailSmall || deal.thumbnail}}
          //         source={{uri: deal.thumbnail}}
          //         resizeMode="cover"
          //         style={{width: 100, height: 100, borderRadius: 10}}
          //         containerStyle={{borderRadius: 10}}
          //         blurViewRadius={10}
          //       />
          //     </TouchableOpacity>
          //     <View style={{flex: 1}}>
          //       <View style={styles.listViewContent}>
          //         <TouchableOpacity
          //           onPress={() =>
          //             this.props.active
          //               ? this.props.setDealOpen(true, deal, true)
          //               : alert('This deal is currently inactive.')
          //           }>
          //           <Text style={styles.listViewTitle} numberOfLines={2}>
          //             {deal.name}
          //           </Text>
          //           <View style={{marginVertical: 5}}>
          //             {handleDealTime(deal, {
          //               smallText: true,
          //               showDate: false,
          //             })}
          //           </View>
          //         </TouchableOpacity>
          //         <TouchableOpacity
          //           style={{
          //             flexDirection: 'row',
          //             alignItems: 'flex-start',
          //             marginTop: 5,
          //           }}
          //           onPress={() =>
          //             this.props.active
          //               ? this.props.setVenueOpen(true, deal.venueId)
          //               : alert('This deal is currently inactive.')
          //           }>
          //           <View style={{flex: 3}}>
          //             <Text style={styles.dealLocation} numberOfLines={2}>
          //               {venue.name}
          //             </Text>
          //           </View>
          //           {venue.distance && (
          //             <View
          //               style={{
          //                 flexDirection: 'row',
          //                 flex: 1,
          //                 justifyContent: 'flex-end',
          //               }}>
          //               <Text
          //                 style={{fontSize: 15, color: 'rgba(0, 0, 0, 0.7)'}}>
          //                 {`${
          //                   venue.distance > 100 ? `100+` : venue.distance
          //                 } mi`}
          //               </Text>
          //             </View>
          //           )}
          //         </TouchableOpacity>
          //       </View>
          //     </View>
          //   </View>
          // </View>
          null
        );
      default:
        return <React.Fragment />;
    }
  };

  return handleCardRender(props.type);
};

const mapStateToProps = state => ({
  searchQuery: state.search.searchQuery,
  userlocaiton: state.location.location,
});

const mapDispatchToProps = {
  dispatchSetApp: actions.setApp,
  dispatchSetDeals: actions.setDeals,
  dispatchSetSearch: actions.setSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);

const styles = StyleSheet.create({
  /* Base Deals */
  dealContainer: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  popularDealsContainer: {
    paddingTop: 3,
    paddingBottom: 13,
    paddingLeft: 30,
    paddingRight: 30,
  },
  dealActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealLikeText: {
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.7)',
    marginLeft: 10,
  },
  listDealLikeText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.7)',
    marginLeft: 5,
  },
  dealContent: {
    flex: 1,
  },
  listViewContent: {
    flex: 1,
    marginLeft: 15,
  },
  dealTime: {
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: 0.25,
    color: '#624185',
  },
  dealTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#000000',
    paddingTop: 15,
    paddingBottom: 10,
  },
  listViewTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000000',
    paddingBottom: 5,
  },
  dealLocation: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  /* Settings */
  settingContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    borderColor: '#DADADA',
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 15,
    paddingLeft: 15,
  },
  settingsCardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000000',
  },
  settingsLocation: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  settingsImportantText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#624185',
  },
  /* Categroy Icon */
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
