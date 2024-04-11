import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {format, getMonth, parseISO} from 'date-fns';

const dealDays = [
  {string: 'Monday', num: 1},
  {string: 'Tuesday', num: 2},
  {string: 'Wednesday', num: 3},
  {string: 'Thursday', num: 4},
  {string: 'Friday', num: 5},
  {string: 'Saturday', num: 6},
  {string: 'Sunday', num: 0},
];
const handleDealSimpleFormat = hours => {
  let hoursSame = true;

  hours.map(period => {
    const sameOpenClose = hours.filter(hour =>
      period.open && period.close
        ? period.open.time === hour.open.time &&
          period.close.time === hour.close.time
        : false,
    );
    if (sameOpenClose.length !== hours.length) {
      hoursSame = false;
    }

    return period;
  });

  return hoursSame;
};

const handleDealTimeTitle = (deal, timeObject) => {
  const occurence = timeObject.occurence;
  const startDate = timeObject.startDate;
  const endDate = timeObject.endDate;
  const sameMonth = getMonth(startDate) === getMonth(endDate);

  if (occurence === 'weekly') {
    const dealHours = timeObject.hoursOfOperation;

    /* Check if same open close times to use simple format */
    const dealSimpleFormat = handleDealSimpleFormat(dealHours);
    const simpleDays = dealDays
      .map(day => {
        const dayActive = dealHours
          ? dealHours.findIndex(hourObj => hourObj.open.day === day.num) < 0
            ? false
            : true
          : true;
        if (dayActive) {
          return day.string.substring(0, 3);
        }
        return null;
      })
      .filter(d => d !== null);

    if (dealSimpleFormat && simpleDays.length === 7) {
      const simpleStart = dealHours[0].open.time;
      const simpleEnd = dealHours[0].close.time;

      return (
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={[styles.dealTime, {paddingBottom: 2}]}>
            {'Everyday'}
          </Text>
          <Text style={styles.dealTime}>
            {`${format(
              new Date(
                `${normalDate} ${simpleStart.substring(
                  0,
                  2,
                )}:${simpleStart.substring(2, 4)}`,
              ),
              'h:mm a',
            )} ${
              simpleEnd
                ? ` - ${format(
                    new Date(
                      `${normalDate} ${simpleEnd.substring(
                        0,
                        2,
                      )}:${simpleEnd.substring(2, 4)}`,
                    ),
                    'h:mm a',
                  )}`
                : ''
            }`}
          </Text>
        </View>
      );
    }

    return (
      <View style={{flex: 1}}>
        {dealDays.map(day => {
          const dayActive = dealHours
            ? dealHours.findIndex(hourObj => hourObj.open.day === day.num) < 0
              ? false
              : true
            : true;
          if (!dayActive) {
            return null;
          }

          return (
            <View
              key={`${deal.id}-${day.num}`}
              style={{
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-between',
                paddingBottom: 2,
              }}>
              <Text>{day.string}</Text>
              <View>
                {dealHours
                  ? dealHours
                      .filter(hourObj => hourObj.open.day === day.num)
                      .map(time => {
                        const openTime =
                          time.open.time === '24 hours'
                            ? '24 hours'
                            : format(
                                new Date(
                                  `${normalDate} ${time.open.time.substring(
                                    0,
                                    2,
                                  )}:${time.open.time.substring(2, 4)}`,
                                ),
                                'h:mm a',
                              );
                        const closeTime = time.close
                          ? format(
                              new Date(
                                `${normalDate} ${time.close.time.substring(
                                  0,
                                  2,
                                )}:${time.close.time.substring(2, 4)}`,
                              ),
                              'h:mm a',
                            )
                          : null;
                        return (
                          <Text key={`${deal.id}-${day.num}-${openTime}`}>
                            {openTime && closeTime === null
                              ? '24 hours'
                              : `${openTime} - ${closeTime}`}
                          </Text>
                        );
                      })
                  : null}
              </View>
            </View>
          );
        })}
      </View>
    );
  }
  // if (occurence === 'once') {
  //   if (endDate) {
  //     return (
  //       <View>
  //         <Text style={styles.dealTime}>
  //           {format(startDate, 'MMM do')} -{' '}
  //           {format(endDate, sameMonth ? 'do' : 'MMM do')}
  //         </Text>
  //       </View>
  //     );
  //   }
  //   return (
  //     <View>
  //       <Text style={styles.dealTime}>{format(startDate, 'MMMM do')}</Text>
  //     </View>
  //   );
  // }
  // if (occurence === 'monthly') {
  //   return (
  //     <Text style={styles.dealTime}>Monthly on {format(startDate, 'do')}</Text>
  //   );
  // }
};

const normalDate = format(parseISO(new Date().toISOString()), 'MMM dd, yyyy');
const handleDealTimeInfo = (deal, timeObject) => {
  const occurence = timeObject.occurence;
  if (['once', 'monthly'].includes(occurence)) {
    const intervals = timeObject.intervals;
    return (
      <View>
        {intervals.map(interval => (
          <Text
            key={`${deal.id}-${interval.startTime}-${interval.endTime}`}
            style={[styles.dealTime, {paddingBottom: 2, textAlign: 'right'}]}>
            {`${format(
              new Date(
                `${normalDate} ${interval.startTime.substring(
                  0,
                  2,
                )}:${interval.startTime.substring(2, 4)}`,
              ),
              'h:mm a',
            )} - ${format(
              new Date(
                `${normalDate} ${interval.endTime.substring(
                  0,
                  2,
                )}:${interval.endTime.substring(2, 4)}`,
              ),
              'h:mm a',
            )}`}
          </Text>
        ))}
      </View>
    );
  }
};

export default (deal, dealPage) => {
  console.log('deal', deal);
  if (deal.timeObject) {
    const timeObject = deal.timeObject;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          maxWidth: dealPage ? 275 : '100%',
        }}>
        {handleDealTimeTitle(deal, timeObject)}
        {handleDealTimeInfo(deal, timeObject)}
      </View>
    );
  }
  if (deal.time) {
    return null;
  }
};

const styles = StyleSheet.create({
  dealTime: {
    fontWeight: '400',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.7)',
  },
});
