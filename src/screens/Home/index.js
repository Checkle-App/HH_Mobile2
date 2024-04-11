import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import CatergoryIcons from '../../../assets/Category_Icons';
import Slider from '../../components/Slider';
import {categoriesList, Functions} from '../../utils/constants';
import ProgressiveImage from '../../components/ProgressiveImage';
import CategoryIcon from '../../components/CategoryIcon';

import NoLocation from '../../components/NoLocation';
import NoDeals from '../../components/NoDeals';

import handleRenderIcon from '../../utils/handleRenderIcon';

/* Redux */
import {connect} from 'react-redux';
import * as actions from '../../utils/redux/actions';

import {debounce} from 'lodash';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const handleThumbnail = thumbnail => {
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
    }

    return thumbnail;
  }
};

const Categories = props => {
  const {homePage} = props;
  const [modalOpen, setModalOpen] = useState(false);
  const categorySize = wp(9);

  const handleCategoryRender = categoryDetails => {
    if (!categoryDetails) {
      return null;
    } else {
      return (
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => {
            props.handleSearch(categoryDetails.searchQuery);
          }}>
          <View style={styles.categoryContainer}>
            <View
              style={[
                styles.categoryIcon,
                {
                  width: categorySize * 2,
                  height: categorySize * 2,
                  borderRadius: categorySize,
                },
              ]}>
              {handleRenderIcon(categoryDetails.category)}
            </View>
            <Text style={styles.categoryText}>{categoryDetails.title}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <>
      <View style={styles.homeCategoryRow}>
        {handleCategoryRender(
          homePage
            ? homePage.categoryList
              ? homePage.categoryList.find(item => item.order === 1)
              : null
            : null,
        )}
        {handleCategoryRender(
          homePage
            ? homePage.categoryList
              ? homePage.categoryList.find(item => item.order === 2)
              : null
            : null,
        )}
        {handleCategoryRender(
          homePage
            ? homePage.categoryList
              ? homePage.categoryList.find(item => item.order === 3)
              : null
            : null,
        )}
        {handleCategoryRender(
          homePage
            ? homePage.categoryList
              ? homePage.categoryList.find(item => item.order === 4)
              : null
            : null,
        )}
      </View>
      <View style={styles.homeCategoryRow}>
        {handleCategoryRender(
          homePage
            ? homePage.categoryList
              ? homePage.categoryList.find(item => item.order === 5)
              : null
            : null,
        )}
        {handleCategoryRender(
          homePage
            ? homePage.categoryList
              ? homePage.categoryList.find(item => item.order === 6)
              : null
            : null,
        )}
        {handleCategoryRender(
          homePage
            ? homePage.categoryList
              ? homePage.categoryList.find(item => item.order === 7)
              : null
            : null,
        )}
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setModalOpen(true)}>
          <View style={styles.categoryContainer}>
            <View
              style={[
                styles.categoryIcon,
                {
                  width: categorySize * 2,
                  height: categorySize * 2,
                  borderRadius: categorySize,
                },
              ]}>
              <MaterialCommunityIcon
                size={categorySize}
                color="#000"
                name="dots-vertical"
              />
            </View>
            <Text style={styles.categoryText}>More</Text>
          </View>
        </TouchableOpacity>
        {/* More Categories Modal */}
        <Modal
          animationType="fade"
          transparent={false}
          visible={modalOpen}
          onRequestClose={() => setModalOpen(false)}>
          <View style={styles.categoryModalContainer}>
            <Text style={styles.categoryModalHeader}>All Categories</Text>
            <View style={styles.categoryModalScrollContainer}>
              <ScrollView
                style={styles.categoryModalScrollPad}
                automaticallyAdjustsScrollIndicatorInsets={false}
                scrollIndicatorInsets={{right: 1}}>
                {categoriesList.map(category => (
                  <TouchableOpacity
                    onPress={() => {
                      setModalOpen(false);
                      props.handleSearch(category.name);
                    }}
                    key={category.id}
                    style={styles.categoryListButton}>
                    <CategoryIcon dealType={[category.name]} />
                    <Text style={styles.categoryListButtonText}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={() => setModalOpen(false)}
                style={styles.categoryModalBackButton}>
                <Text style={styles.categoryModalBackButtonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const HomeSlider = props => {
  return props.data.length ? (
    <View style={styles.homeSliderContainer}>
      <Text style={styles.homeContentHeader}>{props.sliderTitle}</Text>
      <View style={{paddingVertical: 10}}>
        <Slider type="deal" data={props.data} homeSize={true} />
      </View>
    </View>
  ) : null;
};

const DealTypeButtons = props => {
  const categorySize = wp(10);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
      }}>
      <TouchableOpacity
        style={[styles.dealTypeButton, {marginRight: 8}]}
        onPress={() => {
          props.handleSearch('Food');
        }}>
        <Text style={styles.dealTypeText}>Food</Text>
        <CatergoryIcons.LunchIcon width={categorySize} height={categorySize} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.dealTypeButton, {marginLeft: 8}]}
        onPress={() => {
          props.handleSearch('Drinks');
        }}>
        <Text style={styles.dealTypeText}>Drinks</Text>
        <CatergoryIcons.MargaritaIcon
          width={categorySize}
          height={categorySize}
        />
      </TouchableOpacity>
    </View>
  );
};

const statusBarHeight =
  Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight;
const appBarHeight = 71;

const Home = props => {
  const [scrollAnim, setScrollAnim] = useState(new Animated.Value(0));
  const [offsetAnim, setOffsetAnim] = useState(new Animated.Value(0));
  const [clampedScroll, setClampedScroll] = useState(
    Animated.diffClamp(
      Animated.add(
        scrollAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolateLeft: 'clamp',
        }),
        offsetAnim,
      ),
      0,
      250,
    ),
  );

  const [_scrollValue, _setScrollValue] = useState(0);
  const [_clampedScrollValue, _setClampedScrollValue] = useState(0);
  const [_offsetValue, _setOffsetValue] = useState(0);
  const [_scrollEndTimer, _setScrollEndTimer] = useState(null);

  useEffect(() => {
    /* StautsBar Animation */
    scrollAnim.addListener(({value}) => {
      // This is the same calculations that diffClamp does.
      const diff = value - _scrollValue;
      _setScrollValue(value);
      _setClampedScrollValue(
        Math.min(Math.max(_clampedScrollValue + diff, 0), 250),
      );
    });
    offsetAnim.addListener(({value}) => {
      _setOffsetValue(value);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // StatusBar animation
  const _onScrollEndDrag = () => {
    _setScrollEndTimer(setTimeout(_onMomentumScrollEnd, 150));
  };

  const _onMomentumScrollBegin = () => {
    clearTimeout(_scrollEndTimer);
  };

  const _onMomentumScrollEnd = () => {
    const toValue =
      _scrollValue > appBarHeight && _clampedScrollValue > 250 / 2
        ? _offsetValue + appBarHeight
        : _offsetValue - appBarHeight;

    Animated.timing(offsetAnim, {
      toValue,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  // const categorySize = wp(9);
  const {loading, homePage} = props;
  const homePageImage = homePage ? homePage.image : null;
  /* Statusbar Anim */
  const statusBarOpacity = clampedScroll.interpolate({
    inputRange: [0, 250],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

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

  const navToSearch = () => {
    props.navigation.push('Search');
  };

  return (
    <>
      <View style={{backgroundColor: '#F6FAFF', flex: 1}}>
        {loading ? (
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
            <Animated.View
              style={{
                opacity: statusBarOpacity,
                backgroundColor: '#624185',
                height: statusBarHeight,
                position: 'absolute',
                width: viewportWidth,
                zIndex: 10000,
              }}>
              <LinearGradient
                colors={['rgba(98, 65, 133, 0.8)', 'rgba(255, 163, 69, 0.8)']}
                style={{
                  backgroundColor: '#624185',
                  height: statusBarHeight,
                  width: viewportWidth,
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
            </Animated.View>
            <ScrollView
              automaticallyAdjustsScrollIndicatorInsets={false}
              scrollIndicatorInsets={{right: 1}}
              bounces={false}
              /* StautsBar Animation */
              onMomentumScrollBegin={_onMomentumScrollBegin}
              onMomentumScrollEnd={_onMomentumScrollEnd}
              onScrollEndDrag={_onScrollEndDrag}
              onScroll={Animated.event([
                {nativeEvent: {contentOffset: {y: scrollAnim}}},
              ])}
              scrollEventThrottle={200}>
              <TouchableOpacity
                style={{
                  width: wp(100),
                  height: viewportHeight * 0.35,
                  minHeight: 250,
                }}
                activeOpacity={
                  !props.initialDeals.popularDeals.length ||
                  !props.locationAvailable
                    ? 1
                    : 0.25
                }
                onPress={() => {
                  if (
                    !props.locationAvailable ||
                    !props.initialDeals.popularDeals.length
                  ) {
                    return;
                  }
                  handleSearch(homePageImage.searchQuery);
                }}>
                {homePageImage ? (
                  <ProgressiveImage
                    thumbnailSource={{
                      uri: handleThumbnail(homePageImage.thumbnail),
                    }}
                    source={{uri: handleThumbnail(homePageImage.thumbnail)}}
                    resizeMode="cover"
                    style={[
                      styles.appBar,
                      {
                        width: wp(100),
                        height: viewportHeight * 0.35,
                        minHeight: 250,
                      },
                    ]}
                    minimumHeight={250}
                  />
                ) : null}
                {homePageImage ? (
                  <View
                    style={{
                      position: 'absolute',
                      left: viewportWidth * 0.05,
                      right: 0,
                      bottom: 0,
                      top: viewportHeight * 0.07,
                      zIndex: 102,
                      height: viewportHeight * 0.35,
                      minHeight: 250,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}>
                    {props.initialDeals.popularDeals.length &&
                    props.locationAvailable ? (
                      <Text
                        style={[
                          styles.homeImageHeading,
                          {color: homePageImage.fontColor},
                        ]}>
                        {homePageImage.title}
                      </Text>
                    ) : null}
                    {props.initialDeals.popularDeals.length &&
                    props.locationAvailable ? (
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor:
                            homePageImage.buttonColor ||
                            homePageImage.fontColor,
                          backgroundColor:
                            homePageImage.buttonColor || 'transparent',
                          borderRadius: 8,
                          paddingVertical: 5,
                          paddingHorizontal: 12,
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 5,
                        }}>
                        <MaterialIcon
                          size={19}
                          color={
                            homePageImage.buttonFontColor ||
                            homePageImage.fontColor
                          }
                          name={'search'}
                        />
                        <Text
                          style={[
                            styles.homeImageButtonText,
                            {
                              color:
                                homePageImage.buttonFontColor ||
                                homePageImage.fontColor,
                              marginLeft: 2,
                            },
                          ]}>
                          {homePageImage.buttonText}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ) : null}
              </TouchableOpacity>
              <View style={styles.searchContainer}>
                <TouchableOpacity
                  style={styles.homeSearch}
                  onPress={debounce(navToSearch, 500)}
                  activeOpacity={1}>
                  <MaterialIcon
                    size={25}
                    color={'rgba(0, 0, 0, 0.6)'}
                    name={'search'}
                  />
                  <Text style={styles.searchText} numberOfLines={1}>
                    Search deals and venues
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.contentContainer}>
                {!props.locationAvailable && <NoLocation />}
                {props.locationAvailable &&
                  !props.initialDeals.popularDeals.length && <NoDeals />}
                {props.initialDeals.popularDeals.length ? (
                  <>
                    <Text style={styles.homeContentHeader}>Quick Search</Text>
                    <DealTypeButtons handleSearch={handleSearch} />
                    <Text style={styles.homeContentHeader}>Categories</Text>
                    <Categories
                      handleSearch={handleSearch}
                      homePage={homePage}
                    />
                    <HomeSlider
                      sliderTitle="Popular Deals"
                      data={props.initialDeals.popularDeals || []}
                    />
                    <HomeSlider
                      sliderTitle="Best Drinks"
                      data={props.initialDeals.bestDrinks || []}
                    />
                    <HomeSlider
                      sliderTitle="Favorite Foods"
                      data={props.initialDeals.favoriteFoods || []}
                    />
                    <HomeSlider
                      sliderTitle="Events"
                      data={props.initialDeals.events || []}
                    />
                  </>
                ) : null}
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </>
  );
};

const mapStateToProps = state => ({
  loading: state.app.loading,
  homePage: state.initial.homePage,
  userLocation: state.location.location,
  locationAvailable: state.location.locationAvailable,
  initialDeals: state.initial.initialDeals,
  searchLocation: state.search.searchQuery.location,
});

const mapDispatchToProps = {
  dispatchSetApp: actions.setApp,
  dispatchSetSearch: actions.setSearch,
  dispatchSetDeals: actions.setDeals,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  appBar: {
    zIndex: 100,
  },
  headingContainer: {},
  homeImageHeading: {
    fontSize: 30,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  homeImageButtonText: {
    color: 'rgba(255,255,255,.8)',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 15,
    position: 'relative',
    bottom: 30,
    zIndex: 1000,
  },
  homeSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchText: {fontSize: 16, paddingHorizontal: 8},
  contentContainer: {
    flex: 1,
    backgroundColor: '#F6FAFF',
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  homeContentHeader: {
    fontSize: 20,
    fontWeight: '500',
    color: 'rgba(0,0,0,.9)',
    paddingVertical: 10,
  },
  homeCategoryContainer: {},
  homeCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  categoryButton: {
    flexDirection: 'column',
  },
  /* Categroy Icon */
  categoryIcon: {
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
  categoryContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  categoryText: {
    lineHeight: 30,
    fontSize: 14,
    marginTop: 8,
    color: 'rgba(0,0,0,.9)',
  },
  /* Category Modal */
  categoryModalContainer: {
    padding: 30,
    backgroundColor: '#fff',
    flex: 1,
  },
  categoryModalHeader: {
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: 17,
    fontWeight: '500',
    marginTop: 20,
  },
  categoryModalScrollContainer: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryModalScrollPad: {
    paddingVertical: 0,
    paddingHorizontal: 20,
  },
  categoryListButton: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.1)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryListButtonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  categoryModalBackButton: {
    backgroundColor: '#624185',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  categoryModalBackButtonText: {
    color: 'white',
  },
  /* Slider */
  homeSliderContainer: {
    paddingVertical: 10,
  },
  /* No deals */
  venueButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 0.25,
    color: '#FFFFFF',
  },
  alertButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 0.25,
    color: '#624185',
  },
  /* Deal Type Button */
  dealTypeButton: {
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 25,
    flex: 1,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  dealTypeText: {
    color: '#000',
    fontSize: 16,
  },
});
