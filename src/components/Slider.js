import React from 'react';
import Carousel from 'react-native-snap-carousel';
import {Text, View, Platform, Dimensions, StyleSheet} from 'react-native';
import {Card} from 'react-native-paper';
import {connect} from 'react-redux';
import ProgressiveImage from './ProgressiveImage';
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

const IS_IOS = Platform.OS === 'ios';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

const Slide = props => {
  const {
    data: {name, thumbnail},
    handleOpenDeal,
    handleOpenVenue,
  } = props;

  const uppercaseTitle = name ? (
    <Text style={styles.title} numberOfLines={2}>
      {name}
    </Text>
  ) : (
    false
  );

  const thumbnailRes =
    props.type !== 'venue'
      ? handleThumbnail(thumbnail)
      : handleThumbnail(props.data.properties.thumbnail);

  return (
    <Card
      style={[
        styles.slideInnerContainer,
        props.homeSize
          ? {
              height: viewportHeight * 0.36,
              width: slideWidth + itemHorizontalMargin * 1,
            }
          : null,
      ]}
      onPress={() => {
        if (props.type === 'deal') {
          handleOpenDeal(props.data.id);
          return;
        }
        if (props.type === 'venue') {
          handleOpenVenue(props.data.id);
          return;
        }
        // if (this.props.type !== 'venue' && this.props.setDealOpen) {
        //   this.props.setDealOpen(
        //     true,
        //     this.props.data,
        //     this.props.setDealOpenFetch,
        //   );
        // } else {
        //   this.props.setVenueOpen(true, this.props.data.id);
        // }
      }}>
      <View style={[styles.imageContainer]}>
        <ProgressiveImage
          thumbnailSource={{
            uri: thumbnailRes,
          }}
          source={{
            uri: thumbnailRes,
          }}
          resizeMode="cover"
          containerStyle={{
            borderRadius: 8,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
          }}
          blurViewRadius={8}
          style={{
            width: '100%',
            height: '100%',
            borderTopLeftRadius: entryBorderRadius,
            borderTopRightRadius: entryBorderRadius,
          }}
        />
      </View>
      <View style={[styles.textContainer]}>
        {uppercaseTitle}
        {props.data.venueName ? (
          <Text
            style={{
              fontWeight: '400',
              fontSize: 14,
              color: 'rgba(0,0,0,0.7)',
            }}>
            {props.data.venueName}
          </Text>
        ) : null}
      </View>
    </Card>
  );
};

const Slider = props => {
  const navigation = useNavigation();
  const handleOpenDeal = dealId => {
    navigation.push('Deal', {dealId});
  };
  const handleOpenVenue = venueId => {
    navigation.push('Venue', {venueId});
  };

  const renderSlide = ({item, index}) => {
    return (
      <Slide
        data={item}
        even={(index + 1) % 2 === 0}
        homeSize={props.homeSize}
        type={props.type}
        handleOpenDeal={handleOpenDeal}
        handleOpenVenue={handleOpenVenue}
      />
    );
  };

  return (
    <Carousel
      activeSlideAlignment="start"
      layout={'default'}
      data={props.data}
      renderItem={renderSlide}
      sliderWidth={sliderWidth}
      itemWidth={itemWidth}
      type={props.type}
    />
  );
};

const mapStateToProps = state => ({
  dataLoading: state.app.dataLoading,
});
export default connect(mapStateToProps, null)(Slider);

const styles = StyleSheet.create({
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.1)',
    borderBottomEndRadius: 8,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    borderBottomStartRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    margin: 5,
  },
  imageContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: IS_IOS ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  // image's border radius is buggy on iOS; let's hack it!
  radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: 'white',
  },
  textContainer: {
    justifyContent: 'center',
    paddingTop: 20 - entryBorderRadius,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
  },
  title: {
    fontWeight: '500',
    fontSize: 18,
    color: '#000000',
  },
  subtitle: {
    marginTop: 6,
    color: '#888888',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
