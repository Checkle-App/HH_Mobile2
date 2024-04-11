import functions from '@react-native-firebase/functions';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDistance} from 'geolib';
import {getVersion} from 'react-native-device-info';
import {
  getDay,
  getHours,
  getMinutes,
  addDays,
  startOfDay,
  getDate,
} from 'date-fns';
import timeSortString from './timeSortString';

/// New
import database from '@react-native-firebase/database';
import axios from 'axios';
import keys from '../../keys';

function cleanVenue(venue) {
  if (venue.followers) {
    delete venue.followers;
  }
  delete venue.team;
  if (venue.properties.placeId) {
    delete venue.properties.placeId;
  }
  venue.requestedVenueDeals = Object.keys(
    venue.requestedVenueDeals || {},
  ).length;

  return venue;
}

function cleanDeal(deal) {
  deal.hearts = Object.keys(deal.hearts || {}).length;
  return deal;
}

export const Position = (() => {
  let _position;

  const _getPosition = async () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        info => {
          resolve(info.coords);
        },
        error => {
          console.log(error);
          reject(null);
        },
      );
    });
  };

  return {
    get: async () => {
      const newPos = await _getPosition();
      return newPos;
    },
    latest: () => _position,
  };
})();

// Async Storage
export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(`${key}`, value);
  } catch (e) {
    // saving error
  }
};

export const getData = async key => {
  try {
    const value = await AsyncStorage.getItem(`${key}`);
    if (value !== null) {
      return value;
    } else {
      return false;
    }
  } catch (e) {
    // error reading value
  }
};

export const removeData = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
  }
};

export const Functions = Object.freeze({
  getVersion: () => {
    return parseFloat(getVersion());
  },
  isAppUpToDate: async () => {
    let {data: minimumAppVersion} = await functions().httpsCallable(
      'getMinimumAppVersion',
    )();
    const currentAppVersion = parseFloat(getVersion());
    if (currentAppVersion < minimumAppVersion || isNaN(currentAppVersion)) {
      return false;
    } else {
      return true;
    }
  },
  readConsumer: async (uid, userInfo) => {
    const consumerRef = database().ref('consumers').child(uid);

    if (userInfo) {
      await consumerRef.update(userInfo);
    }

    const updatedSnapshot = await new Promise(resolve =>
      consumerRef.once('value', resolve),
    );
    const consumer = updatedSnapshot.val();

    let likedDealsArray = [];
    if (consumer.likedDeals) {
      const {likedDeals} = consumer;
      let dealIds = [];
      let dealKeys = Object.keys(likedDeals);
      dealKeys.map(dealId => {
        const dealMoreKeys = Object.keys(likedDeals ? likedDeals[dealId] : {});
        if (dealMoreKeys.length > 0) {
          dealMoreKeys.map(id => {
            dealIds.push(`${dealId}/${id}`);
            return id;
          });
        } else {
          dealIds.push(dealId);
        }
        return dealId;
      });

      likedDealsArray = await Promise.all(dealIds.map(Functions.readDeal));
    }
    consumer.likedDeals = likedDealsArray;
    return consumer;
  },
  updateConsumerSettings: async (userId, userSettings) => {
    const updateConsumerSettings = functions().httpsCallable(
      'updateConsumerSettings',
    );
    await updateConsumerSettings({consumerId: userId, userSettings});
  },
  likeDeal: async dealId => {
    const likeDeal = functions().httpsCallable('likeDeal');
    await likeDeal({dealId});
  },
  unlikeDeal: async dealId => {
    const unlikeDeal = functions().httpsCallable('unlikeDeal');
    await unlikeDeal({dealId});
  },
  readDeal: async dealId => {
    const dealRef = database().ref('deals').child(dealId);
    const dealSnapshot = await new Promise(resolve =>
      dealRef.once('value', resolve),
    );
    const deal = dealSnapshot.val();
    const cleanedDeal = cleanDeal(deal);
    return cleanedDeal;
  },
  readVenue: async (venueId, userLocation, withDeals) => {
    //// DB
    const venueRef = database().ref('venues').child(`${venueId}`);
    let venueSnapshot = await new Promise(resolve =>
      venueRef.once('value', resolve),
    );
    let cleanVenueObj = venueSnapshot.val();
    if (withDeals) {
      if (cleanVenueObj.deals) {
        let dealIds = [];
        let dealKeys = Object.keys(cleanVenueObj.deals);
        dealKeys.map(dealId => {
          const dealMoreKeys = Object.keys(
            cleanVenueObj.deals ? cleanVenueObj.deals[dealId] : {},
          );
          if (dealMoreKeys.length > 0) {
            dealMoreKeys.map(id => {
              dealIds.push(`${dealId}/${id}`);
              return id;
            });
          } else {
            dealIds.push(dealId);
          }
          return dealId;
        });

        const deals = await Promise.all(dealIds.map(Functions.readDeal));
        cleanVenueObj.deals = deals;
      }
    } else {
      cleanVenueObj.deals = [];
    }
    cleanVenueObj = cleanVenue(cleanVenueObj);
    //////////////////////////////////////////

    if (userLocation && !cleanVenueObj.distance) {
      const userLatitude = userLocation.latitude;
      const userLongitude = userLocation.longitude;
      cleanVenueObj.distance = (
        getDistance(cleanVenueObj.location.coordinates, {
          latitude: userLatitude,
          longitude: userLongitude,
        }) * 0.000621371
      ).toFixed(1);
    } else {
      cleanVenueObj.distance = null;
    }
    return cleanVenueObj;
  },
  sendAnalytic: async (id, type, name, uid) => {
    const sendAnalytic = functions().httpsCallable('sendAnalyticEvent');
    sendAnalytic({
      analyticId:
        type === 'deal' ? (id.includes('/') ? id.split('/')[1] : id) : id,
      event: {name: name, uid},
    });
  },

  /* Homepage Call */
  getHomePage: async () => {
    try {
      const getHomePage = functions().httpsCallable('getHomePage');
      let {data: result} = await getHomePage();
      return result;
    } catch (err) {
      console.log(err);
    }
  },

  /* New Fetch Deals */
  fetchDeals: async ({userLocation, searchQuery, sortType}) => {
    const lowerCaseValue = `${searchQuery.text.toLowerCase()}`;

    const searchResult = async () => {
      const currentTime = new Date();
      const currentHH = getHours(currentTime);
      const currentMM = getMinutes(currentTime);
      const currentHours = `${currentHH < 10 ? `0${currentHH}` : currentHH}${
        currentMM < 10 ? `0${currentMM}` : currentMM
      }`;

      const dayOfMonth = getDate(currentTime);
      const dayOfMonthWeekOut = dayOfMonth + 7;
      const dayOfWeek = getDay(currentTime);
      const todayStart = startOfDay(currentTime).valueOf();
      const weekOut = addDays(todayStart, 7).valueOf();
      const monthOut = addDays(todayStart, 30).valueOf();

      const sortArray = () => {
        /* Time */
        if (!sortType) {
          return [
            {
              _script: {
                type: 'number',
                script: {
                  lang: 'painless',
                  source: timeSortString,
                  params: {
                    currentHours,
                    dayOfWeek,
                    dayOfMonth,
                    dayOfMonthWeekOut,
                    todayStart,
                    weekOut,
                    monthOut,
                  },
                },
                order: 'asc',
              },
            },
          ];
        }
        if (sortType === 'distance') {
          return [
            {
              _geo_distance: {
                'location.coordinates': {
                  lat: searchQuery.location.latitude,
                  lon: searchQuery.location.longitude,
                },
                order: 'asc',
                unit: 'km',
              },
            },
          ];
        }
        if (sortType === 'popularity') {
          return [
            {
              hearts: {
                order: 'desc',
              },
            },
          ];
        }
        if (sortType === 'alphabetical') {
          return [
            {
              'venueName.keyword': {
                order: 'asc',
              },
            },
          ];
        }
      };

      const dataObj = {
        size: 10000,
        sort: sortArray(),
        query: {
          bool: {
            must: [
              {
                match: {
                  type: {
                    query: 'deal',
                  },
                },
              },
              {
                nested: {
                  path: 'timeObject',
                  query: {
                    exists: {
                      field: 'timeObject',
                    },
                  },
                },
              },
              searchQuery.text
                ? {
                    multi_match: {
                      query: lowerCaseValue,
                      fuzziness: 2,
                      max_expansions: 2,
                      fields: ['name', 'categories', 'description', 'dealType'],
                    },
                  }
                : false,
              searchQuery.location.city
                ? {
                    match: {
                      'location.city': {
                        query: searchQuery.location.city,
                      },
                    },
                  }
                : false,
              searchQuery.location.city
                ? {
                    match: {
                      'location.state': {
                        query: searchQuery.location.state,
                      },
                    },
                  }
                : false,
            ].filter(i => i !== false),
            filter: {
              geo_distance: {
                distance: '24.14km',
                'location.coordinates': {
                  lat: searchQuery.location.latitude,
                  lon: searchQuery.location.longitude,
                },
              },
            },
          },
        },
      };

      let elasticSearchConfig = keys.elasticSearch;
      const elasticSearchUrl = `${elasticSearchConfig.url}/_search`;
      const elasticSearchMethod = 'POST';
      const elasticsearchRequest = {
        method: elasticSearchMethod,
        url: elasticSearchUrl,
        auth: {
          username: elasticSearchConfig.username,
          password: elasticSearchConfig.pw,
        },
        data: dataObj,
      };

      try {
        const response = await axios.request(elasticsearchRequest);
        const results = response.data.hits.hits.map(hit => hit._source);
        return results;
      } catch (err) {
        console.log(err);
        return [];
      }
    };
    const resultsHere = await searchResult();

    const deals = resultsHere;

    /* Fix Location Info on deals */
    const userLatitude = userLocation ? userLocation.latitude : null;
    const userLongitude = userLocation ? userLocation.longitude : null;

    const fixLocation = deals.map(event => {
      if (event.location.coordinates) {
        return {
          ...event,
          distance: (
            getDistance(
              {
                latitude: event.location.coordinates.lat,
                longitude: event.location.coordinates.lon,
              },
              {
                latitude: userLatitude || searchQuery.location.latitude,
                longitude: userLongitude || searchQuery.location.longitude,
              },
            ) * 0.000621371
          ).toFixed(1),
          location: {
            ...event.location,
            coordinates: {
              latitude: event.location.coordinates.lat,
              longitude: event.location.coordinates.lon,
            },
          },
        };
      } else {
        return null;
      }
    });

    const filteredDeals = fixLocation.filter(
      filteredDeal => filteredDeal !== undefined && filteredDeal !== null,
    );

    return filteredDeals;
  },

  /* New Fetch Deals */
  mixedSearch: async ({searchQuery}) => {
    const lowerCaseValue = `${searchQuery.text.toLowerCase()}`;
    const searchResult = async () => {
      let elasticSearchConfig = keys.elasticSearch;
      const elasticSearchUrl = `${elasticSearchConfig.url}/_search`;
      const elasticSearchMethod = 'POST';
      const elasticsearchRequest = {
        method: elasticSearchMethod,
        url: elasticSearchUrl,
        auth: {
          username: elasticSearchConfig.username,
          password: elasticSearchConfig.pw,
        },
        data: searchQuery.location.city
          ? {
              sort: [
                {'type.keyword': {order: 'asc'}},
                {
                  _geo_distance: {
                    'location.coordinates': {
                      lat: searchQuery.location.latitude,
                      lon: searchQuery.location.longitude,
                    },
                    order: 'asc',
                    unit: 'km',
                  },
                },
              ],
              size: 200,
              query: {
                bool: {
                  must: [
                    searchQuery.text
                      ? {
                          multi_match: {
                            query: lowerCaseValue,
                            fuzziness: 2,
                            max_expansions: 2,
                            fields: [
                              'name',
                              'venueName',
                              'categories',
                              'description',
                              'dealType',
                            ],
                          },
                        }
                      : null,
                    {
                      match: {
                        'location.city': {
                          query: searchQuery.location.city,
                        },
                      },
                    },
                    {
                      match: {
                        'location.state': {
                          query: searchQuery.location.state,
                        },
                      },
                    },
                  ],
                },
              },
            }
          : searchQuery.text.length
          ? {
              sort: [
                {'type.keyword': {order: 'asc'}},
                {
                  _geo_distance: {
                    'location.coordinates': {
                      lat: searchQuery.location.latitude,
                      lon: searchQuery.location.longitude,
                    },
                    order: 'asc',
                    unit: 'km',
                  },
                },
              ],
              size: 200,
              query: {
                bool: {
                  must: [
                    {
                      multi_match: {
                        query: lowerCaseValue,
                        fuzziness: 2,
                        max_expansions: 2,
                        fields: [
                          'name',
                          'venueName',
                          'categories',
                          'description',
                          'dealType',
                        ],
                      },
                    },
                  ],
                  filter: {
                    geo_distance: {
                      distance: '24.14km',
                      'location.coordinates': {
                        lat: searchQuery.location.latitude,
                        lon: searchQuery.location.longitude,
                      },
                    },
                  },
                },
              },
            }
          : {
              sort: [
                {'type.keyword': {order: 'asc'}},
                {
                  _geo_distance: {
                    'location.coordinates': {
                      lat: searchQuery.location.latitude,
                      lon: searchQuery.location.longitude,
                    },
                    order: 'asc',
                    unit: 'km',
                  },
                },
              ],
              size: 100,
              query: {
                bool: {
                  filter: {
                    geo_distance: {
                      distance: '24.14km',
                      'location.coordinates': {
                        lat: searchQuery.location.latitude,
                        lon: searchQuery.location.longitude,
                      },
                    },
                  },
                },
              },
            },
      };

      const response = await axios.request(elasticsearchRequest);
      const results = response.data.hits.hits.map(hit => hit._source);
      return results;
    };
    const resultsHere = await searchResult();

    return resultsHere;
  },

  /* Request Venue */
  venueDealRequest: async venueId => {
    const venueDealRequest = functions().httpsCallable('venueDealRequest');
    await venueDealRequest({venueId});
  },
  deleteUserAccount: async uid => {
    if (uid) {
      const deleteUserAccountCall = functions().httpsCallable('deleteConsumer');
      await deleteUserAccountCall({uid});
    }
  },
});

export const URLS = Object.freeze({
  generalFeedback:
    'https://docs.google.com/forms/d/e/1FAIpQLScamdZ4WNas9CIfkWRPY5aPSuShZtHO44-tMzfckFCm30ZPbw/viewform',
  featureRequest: 'https://checkle.hellonext.co/b/feature-request?sort=top',
  venueRequest: 'https://checkle.hellonext.co/b/venue-request?sort=top',
  reportDeal:
    'https://docs.google.com/forms/d/e/1FAIpQLSfbGZdEGHSVv-ZspyEYGK02w9zfGN9n3bsCD5HpBeM6J2wwHg/viewform',
});

export const ListTypes = Object.freeze({
  Deal: 'Deal',
  VenueDealList: 'Venue_Deal_List',
  SettingsVenuesFollowed: 'Settings_Venue_Followed',
  SettingsLikedDeals: 'Settings_Liked_Deals',
});

export const DealTypes = Object.freeze({
  All: 'all',
  Food: 'food',
  Drink: 'drink',
  Event: 'event',
});

export const SortTypes = Object.freeze({
  Time: 'time',
  Distance: 'distance',
  Popularity: 'popularity',
  Alphabetical: 'alphabetical',
});

export const ModalTypes = Object.freeze({
  Deal: 'Deal',
  Map: 'Map',
  Settings: 'Settings',
  Venue: 'Venue',
  Search: 'Search',
});

const StorageKeys = Object.freeze({
  GeolocationPrompt: '@Checkle:GeolocationPrompt',
  SessionDuration: '@Checkle:SessionDuration',
  HourOfDay: '@Checkle:HourOfDay',
});

export const Storage = Object.freeze({
  storeGeolocationPrompt: async hasPrompted => {
    try {
      await AsyncStorage.setItem(
        StorageKeys.GeolocationPrompt,
        hasPrompted ? Number(1).toString() : Number(0).toString(),
      );
    } catch (error) {
      console.error(error);
    }
  },
  retreiveGeolocationPrompt: async () => {
    try {
      const value = await AsyncStorage.getItem(StorageKeys.GeolocationPrompt);
      if (!value) {
        return false;
      }
      return parseInt(value) ? true : false;
    } catch (error) {
      console.error(error);
    }
  },
  storeSessionDuration: async time => {
    try {
      await AsyncStorage.setItem(
        StorageKeys.SessionDuration,
        parseFloat(time).toString(),
      );
    } catch (error) {
      console.error(error);
    }
  },
  retrieveSessionDuration: async () => {
    try {
      return await AsyncStorage.getItem(StorageKeys.SessionDuration);
    } catch (error) {
      console.error(error);
    }
  },
  storeHourOfDay: async hourOfDay => {
    try {
      await AsyncStorage.setItem(
        StorageKeys.HourOfDay,
        parseInt(hourOfDay).toString(),
      );
    } catch (error) {
      console.error(error);
    }
  },
  retrieveHourOfDay: async () => {
    try {
      return await AsyncStorage.getItem(StorageKeys.HourOfDay);
    } catch (error) {
      console.error(error);
    }
  },
});

export const categoriesList = [
  {
    id: 'Arcade',
    name: 'Arcade',
  },
  {
    id: 'American',
    name: 'American',
  },
  {
    id: 'Appetizers',
    name: 'Appetizers',
  },
  {
    id: 'Bar',
    name: 'Bar',
  },
  {
    id: 'Barbecue',
    name: 'Barbecue',
  },
  {
    id: 'Beer',
    name: 'Beer',
  },
  {
    id: 'Black-Tie',
    name: 'Black-Tie',
  },
  {
    id: 'Breakfast',
    name: 'Breakfast',
  },
  {
    id: 'Brunch',
    name: 'Brunch',
  },
  {
    id: 'Buffet',
    name: 'Buffet',
  },
  {
    id: 'Bloody Mary’s',
    name: 'Bloody Mary’s',
  },
  {
    id: 'Carryout',
    name: 'Carryout',
  },
  {
    id: 'Charity',
    name: 'Charity',
  },
  {
    id: 'Chicken Wings',
    name: 'Chicken Wings',
  },
  {
    id: 'Chinese',
    name: 'Chinese',
  },
  {
    id: 'Club',
    name: 'Club',
  },
  {
    id: 'Cocktail',
    name: 'Cocktail',
  },
  {
    id: 'Coffee',
    name: 'Coffee',
  },
  {
    id: 'Dessert',
    name: 'Dessert',
  },
  {
    id: 'Dine-In',
    name: 'Dine-In',
  },
  {
    id: 'Dinner',
    name: 'Dinner',
  },
  {
    id: 'Fast-food',
    name: 'Fast-food',
  },
  {
    id: 'Food Truck',
    name: 'Food Truck',
  },
  {
    id: 'French',
    name: 'French',
  },
  {
    id: 'Gluten Free',
    name: 'Gluten Free',
  },
  {
    id: 'Greek',
    name: 'Greek',
  },
  {
    id: 'Healthy',
    name: 'Healthy',
  },
  {
    id: 'Hamburger',
    name: 'Hamburger',
  },
  {
    id: 'Happy Hour',
    name: 'Happy Hour',
  },
  {
    id: 'Indian',
    name: 'Indian',
  },
  {
    id: 'Italian',
    name: 'Italian',
  },
  {
    id: 'Japanese',
    name: 'Japanese',
  },
  {
    id: 'Karaoke',
    name: 'Karaoke',
  },
  {
    id: 'Kids Eat Free',
    name: 'Kids Eat Free',
  },
  {
    id: 'Liquor',
    name: 'Liquor',
  },
  {
    id: 'Live Music',
    name: 'Live Music',
  },
  {
    id: 'Lounge',
    name: 'Lounge',
  },
  {
    id: 'Lunch',
    name: 'Lunch',
  },
  {
    id: 'Margarita',
    name: 'Margarita',
  },
  {
    id: 'Mexican',
    name: 'Mexican',
  },
  {
    id: 'Mimosas',
    name: 'Mimosas',
  },
  {
    id: 'Night Life',
    name: 'Night Life',
  },
  {
    id: 'Pet Friendly',
    name: 'Pet Friendly',
  },
  {
    id: 'Pizza',
    name: 'Pizza',
  },
  {
    id: 'Rooftop',
    name: 'Rooftop',
  },
  {
    id: 'Sandwiches',
    name: 'Sandwiches',
  },
  {
    id: 'Seafood',
    name: 'Seafood',
  },
  {
    id: 'Speakeasy',
    name: 'Speakeasy',
  },
  {
    id: 'Sports Bar',
    name: 'Sports Bar',
  },
  {
    id: 'Steak',
    name: 'Steak',
  },
  {
    id: 'Sushi',
    name: 'Sushi',
  },
  {
    id: 'Tacos',
    name: 'Tacos',
  },
  {
    id: 'Trivia',
    name: 'Trivia',
  },
  {
    id: 'Video Game',
    name: 'Video Game',
  },
  {
    id: 'Vietnamese',
    name: 'Vietnamese',
  },
  {
    id: 'Wine',
    name: 'Wine',
  },
];
