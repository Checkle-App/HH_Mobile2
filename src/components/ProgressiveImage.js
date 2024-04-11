import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  findNodeHandle,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {BlurView} from '@react-native-community/blur';

const styles = StyleSheet.create({
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  container: {
    backgroundColor: '#e1e4e8',
    overflow: 'hidden',
  },
});

class ProgressiveImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {viewRef: null};
  }

  imageAnimated = new Animated.Value(0);

  onImageLoad = () => {
    Animated.timing(this.imageAnimated, {
      toValue: 1,
    }).start();
  };

  imageLoaded() {
    this.setState({viewRef: findNodeHandle(this.image)});
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {
      thumbnailSource,
      source,
      style,
      containerStyle,
      blurViewRadius,
      ...props
    } = this.props;

    return (
      <View
        style={
          this.props.noBackground
            ? [containerStyle]
            : this.props.minHeight
            ? [
                styles.container,
                containerStyle,
                {minHeight: this.props.minimumHeight},
              ]
            : [styles.container, containerStyle]
        }>
        <FastImage
          {...props}
          source={thumbnailSource}
          style={[style]}
          ref={(img) => {
            this.image = img;
          }}
          onLoad={this.imageLoaded.bind(this)}
        />
        {Platform.OS === 'ios' && (
          <BlurView
            style={[styles.imageOverlay]}
            viewRef={this.state.viewRef}
            blurType="light"
            blurAmount={10}
            borderRadius={blurViewRadius}
          />
        )}
        <Animated.Image
          {...props}
          source={source}
          style={[styles.imageOverlay, {opacity: this.imageAnimated}, style]}
          onLoad={this.onImageLoad}
        />
      </View>
    );
  }
}
export default ProgressiveImage;
