import React from 'react';
import {Text, View} from 'react-native';
import {format} from 'date-fns-tz';
import {parseISO} from 'date-fns';

const days = [
  {string: 'Monday', num: 1},
  {string: 'Tuesday', num: 2},
  {string: 'Wednesday', num: 3},
  {string: 'Thursday', num: 4},
  {string: 'Friday', num: 5},
  {string: 'Saturday', num: 6},
  {string: 'Sunday', num: 0},
];
const normalDate = format(parseISO(new Date().toISOString()), 'MMM dd, yyyy');

export default hours => {
  return (
    <View style={{marginVertical: 20}}>
      <Text
        style={{
          fontSize: 16,
          marginBottom: 10,
          fontWeight: '500',
        }}>
        Hours of operation
      </Text>
      {days.map(day => (
        <View
          key={day.num}
          style={{display: 'flex', flexDirection: 'row', marginBottom: 2}}>
          <View style={{width: 100}}>
            <Text style={{fontSize: 15}}>{day.string}</Text>
          </View>
          <View>
            {hours.findIndex(hourObj => hourObj.open.day === day.num) < 0 ? (
              <Text>Closed</Text>
            ) : (
              hours
                .filter(hourObj => hourObj.open.day === day.num)
                .map((time, timeIndex) => {
                  const openTime = format(
                    new Date(
                      `${normalDate} ${time.open.time.substring(
                        0,
                        2,
                      )}:${time.open.time.substring(2, 4)}`,
                    ),
                    'h:mm a',
                  );
                  const closeTime = format(
                    new Date(
                      `${normalDate} ${time.open.time.substring(
                        0,
                        2,
                      )}:${time.open.time.substring(2, 4)}`,
                    ),
                    'h:mm a',
                  );
                  return (
                    <Text key={timeIndex} style={{fontSize: 15}}>
                      {openTime && closeTime === null
                        ? '24 hours'
                        : `${openTime} - ${closeTime}`}
                    </Text>
                  );
                })
            )}
          </View>
        </View>
      ))}
    </View>
  );
};
