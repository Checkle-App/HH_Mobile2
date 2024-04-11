import React, {useState} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import ListItem from '../../../components/ListItem';
import * as actions from '../../../utils/redux/actions';
import {ListTypes, Functions} from '../../../utils/constants';
import {connect} from 'react-redux';
import NoLocation from '../../../components/NoLocation';
import SortBar from './SortBar';
import SortModal from './SortModal';
import NoDeals from '../../../components/NoDeals';

const FeedFlatlist = props => {
  const keyExtractor = item => item.id;

  const renderItem = ({item, index}) => {
    return <ListItem data={item} listType={ListTypes.Deal} index={index} />;
  };

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);

    const {searchQuery, activeSort} = props.search;
    let deals = await Functions.fetchDeals({
      searchQuery,
      userLocation: props.userLocation,
      sortType: activeSort,
    });

    props.dispatchSetDeals({
      deals,
    });
    setRefreshing(false);
  };

  const {deals, locationAvailable} = props;

  return !locationAvailable ? (
    <View
      style={{
        paddingHorizontal: 30,
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
      }}>
      <NoLocation />
    </View>
  ) : !deals.length ? (
    <View style={{marginTop: 20}}>
      <NoDeals />
    </View>
  ) : (
    <>
      <SortBar />
      <FlatList
        renderItem={renderItem}
        data={deals}
        keyExtractor={keyExtractor}
        style={[styles.contentContainer]}
        contentContainerStyle={{paddingBottom: 120}}
        horizontal={false}
        bounces={true}
        onEndReachedThreshold={2}
        scrollEventThrottle={200}
        refreshing={refreshing}
        onRefresh={deals.length ? handleRefresh : null}
      />
      <SortModal />
    </>
  );
};

const mapStateToProps = state => ({
  loading: state.app.loading,
  userLocation: state.location.location,
  deals: state.deals.deals || [],
  search: state.search,
  locationAvailable: state.location.locationAvailable,
});

const mapDispatchToProps = {
  dispatchSetSearch: actions.setSearch,
  dispatchSetDeals: actions.setDeals,
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedFlatlist);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
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
