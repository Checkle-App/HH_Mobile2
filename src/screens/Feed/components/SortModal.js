import React from 'react';
import {StyleSheet, View, TouchableOpacity, Modal, Text} from 'react-native';
import {SortTypes, Functions} from '../../../utils/constants';
import * as actions from '../../../utils/redux/actions';
import {connect} from 'react-redux';

const SortModal = props => {
  const handleSortClose = async () => {
    props.dispatchSetSearch({
      sortOpen: false,
    });
  };

  const handleSort = async sortType => {
    const {searchQuery} = props.search;

    props.dispatchSetApp({
      loading: true,
    });
    props.dispatchSetSearch({
      sortOpen: false,
      activeSort: sortType,
    });

    let deals = await Functions.fetchDeals({
      userLocation: props.location,
      searchQuery,
      sortType,
    });

    props.dispatchSetDeals({
      deals,
    });
    props.dispatchSetApp({
      loading: false,
    });
  };

  return (
    <Modal
      transparent={true}
      visible={props.search.sortOpen}
      onRequestClose={handleSortClose}
      animationType="slide">
      <TouchableOpacity
        style={[styles.cover]}
        onPress={handleSortClose}
        activeOpacity={1}>
        <View style={[styles.sheet]}>
          <TouchableOpacity
            style={[styles.popup]}
            onPress={() => null}
            activeOpacity={1}>
            <View style={styles.sortOptionContainer}>
              <View
                style={{
                  borderBottomColor: 'rgba(0,0,0,0.2)',
                  borderBottomWidth: 1,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    paddingTop: 20,
                    paddingBottom: 20,
                    textAlign: 'center',
                  }}>
                  Sort by
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.sortOption,
                  {
                    borderBottomColor: 'rgba(0,0,0,0.2)',
                    borderBottomWidth: 1,
                  },
                ]}
                onPress={() => {
                  handleSort();
                }}>
                <Text style={styles.sortOptionText}>Time (default)</Text>
                <View style={styles.circle}>
                  {props.search.activeSort === SortTypes.Time && (
                    <View style={styles.checkedCircle} />
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortOption,
                  {
                    borderBottomColor: 'rgba(0,0,0,0.2)',
                    borderBottomWidth: 1,
                  },
                ]}
                onPress={() => {
                  handleSort(SortTypes.Distance);
                }}>
                <Text style={styles.sortOptionText}>Distance</Text>
                <View style={styles.circle}>
                  {props.search.activeSort === SortTypes.Distance && (
                    <View style={styles.checkedCircle} />
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortOption,
                  {
                    borderBottomColor: 'rgba(0,0,0,0.2)',
                    borderBottomWidth: 1,
                  },
                ]}
                onPress={() => {
                  handleSort(SortTypes.Popularity);
                }}>
                <Text style={styles.sortOptionText}>Popularity</Text>
                <View style={styles.circle}>
                  {props.search.activeSort === SortTypes.Popularity && (
                    <View style={styles.checkedCircle} />
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortOption]}
                onPress={() => {
                  handleSort(SortTypes.Alphabetical);
                }}>
                <Text style={styles.sortOptionText}>Venue Name</Text>
                <View style={styles.circle}>
                  {props.search.activeSort === SortTypes.Alphabetical && (
                    <View style={styles.checkedCircle} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const mapStateToProps = state => ({
  search: state.search,
  location: state.location.location,
});

const mapDispatchToProps = {
  dispatchSetApp: actions.setApp,
  dispatchSetDeals: actions.setDeals,
  dispatchSetVenues: actions.setVenues,
  dispatchSetLocation: actions.setLocation,
  dispatchSetSearch: actions.setSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(SortModal);

const styles = StyleSheet.create({
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
});
