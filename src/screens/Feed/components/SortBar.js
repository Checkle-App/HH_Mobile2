import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as actions from '../../../utils/redux/actions';
import {SortTypes} from '../../../utils/constants';
import {connect} from 'react-redux';

const sortBarHeight = 52;
const SortBar = props => {
  const handleSortOpen = () => {
    props.dispatchSetSearch({
      sortOpen: true,
    });
  };

  return (
    <View
      style={[
        styles.sortBar,
        {
          height: sortBarHeight,
        },
      ]}>
      <View style={styles.sorts}>
        <TouchableOpacity
          onPress={handleSortOpen}
          style={[
            styles.sortButton,
            [
              SortTypes.Distance,
              SortTypes.Popularity,
              SortTypes.Alphabetical,
            ].includes(props.search.activeSort) && styles.activeSort,
          ]}>
          <MaterialCommunityIcon
            name="sort-descending"
            size={18}
            color={
              [
                SortTypes.Distance,
                SortTypes.Popularity,
                SortTypes.Alphabetical,
              ].includes(props.search.activeSort)
                ? '#FFF'
                : 'rgba(0,0,0,.7)'
            }
            style={{marginRight: 8}}
          />
          <Text
            style={[
              [
                SortTypes.Distance,
                SortTypes.Popularity,
                SortTypes.Alphabetical,
              ].includes(props.search.activeSort) && styles.activeSort,
            ]}>{`Sort${
            props.search.activeSort === SortTypes.Distance
              ? ': Distance'
              : props.search.activeSort === SortTypes.Popularity
              ? ': Popularity'
              : props.search.activeSort === SortTypes.Alphabetical
              ? ': Venue Name'
              : ''
          }`}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  search: state.search,
});

const mapDispatchToProps = {
  dispatchSetApp: actions.setApp,
  dispatchSetSearch: actions.setSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(SortBar);

const styles = StyleSheet.create({
  sortBar: {
    backgroundColor: '#F6FAFF',
    padding: 8,
    position: 'relative',
    left: 0,
    right: 0,
    height: 55,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#d6d7da',
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
});
