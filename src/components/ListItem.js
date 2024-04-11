import React from 'react';
import Card from './Card';
import {ListTypes} from '../utils/constants';

const ListItem = props => {
  const handleRenderItem = (
    data,
    listType,
    index,
    // setDealOpen,
    // setVenueOpen,
    // handleDealLike,
    // likedDeals,
    // listView,
    // index,
    // isLastDeal,
    // generalLoading,
    // swipeArrowsOpen,
  ) => {
    switch (listType) {
      case ListTypes.Deal:
        return (
          <Card
            deal={data}
            type={listType}
            topBorder={index === 0 ? false : true}
            // setDealOpen={setDealOpen}
            // setVenueOpen={setVenueOpen}
            // handleDealLike={handleDealLike}
            // liked={Object.keys(likedDeals).includes(data.id)}
            // listView={listView}
            // topBorder={index === 0 ? false : true}
            // generalLoading={generalLoading}
            // swipeArrowsOpen={swipeArrowsOpen}
          />
        );
      case ListTypes.VenueDealList:
        return (
          <Card
            deal={data}
            type={listType}
            // setDealOpen={setDealOpen}
            // setVenueOpen={setVenueOpen}
            // handleDealLike={handleDealLike}
            // liked={Object.keys(likedDeals).includes(data.id)}
            // isLastDeal={isLastDeal}
          />
        );
      case ListTypes.SettingsVenuesFollowed:
        return (
          <Card
            venue={data}
            type={listType}
            // setVenueOpen={setVenueOpen}
            // topBorder={index === 0 ? false : true}
          />
        );
      case ListTypes.SettingsLikedDeals:
        return (
          <Card
            deal={data}
            type={listType}
            // setDealOpen={setDealOpen}
            // setVenueOpen={setVenueOpen}
            // topBorder={index === 0 ? false : true}
            // active={data.isActive}
          />
        );
      default:
        break;
    }
  };

  return handleRenderItem(props.data, props.listType, props.index);
};

export default ListItem;
