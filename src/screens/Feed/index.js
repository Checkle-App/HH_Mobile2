import React from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import {getStatusBarHeight} from 'react-native-status-bar-height';
import FeedFlatlist from './components/FeedFlatlist';

import {debounce} from 'lodash';

const statusBarHeight =
  Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight;

const Feed = props => {
  const {loading} = props;

  const navToSearch = () => {
    props.navigation.push('Search');
  };

  return (
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
          <FeedFlatlist />
        </>
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  loading: state.app.loading,
  searchQuery: state.search.searchQuery,
});

export default connect(mapStateToProps, null)(Feed);

const styles = StyleSheet.create({
  modal: {
    flex: 1,
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
  modalAppBar: {
    backgroundColor: '#624185',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F6FAFF',
  },
  contentContainer: {
    flex: 1,
  },
  modalTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
    paddingRight: 10,
    textAlign: 'center',
  },
  sortBar: {
    backgroundColor: '#F6FAFF',
    padding: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    height: 55,
    zIndex: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: '#d6d7da',
    borderTopColor: '#d6d7da',
  },
  sorts: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeSort: {
    backgroundColor: '#624185',
    color: 'white',
  },
  sortButton: {
    flexDirection: 'row',
    padding: 8,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d6d7da',
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 10,
  },
  sortOptionContainer: {
    paddingHorizontal: 25,
  },
  sortOption: {
    textAlign: 'left',
    paddingTop: 20,
    paddingBottom: 20,
    fontSize: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortOptionText: {
    color: 'rgba(0,0,0,0.6)',
  },
  searchLoadingContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
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
  /* Sorting Modal Styles */
  cover: {
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  sheet: {
    zIndex: 1000,
    height: '100%',
    justifyContent: 'flex-end',
  },
  popup: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    minHeight: 80,
    width: '100%',
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

  /* Swipeable Row */
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
});
