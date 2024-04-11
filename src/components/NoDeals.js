import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import {Title, Paragraph} from 'react-native-paper';
import {
  setDeals,
  setInitial,
  setLocation,
  setSearch,
} from '../utils/redux/actions';
import {connect} from 'react-redux';

const NoDeals = () => {
  return (
    <View
      style={{
        paddingHorizontal: 5,
        marginTop: 30,
        flexDirection: 'column',
      }}>
      <Title style={{textAlign: 'center'}}>Sorry! No deals found nearby.</Title>
      <View style={{marginTop: 30}}>
        <Paragraph style={{paddingHorizontal: 30, textAlign: 'center'}}>
          Please try searching another area or send us a request so we can find
          some happy hours near you.
        </Paragraph>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingVertical: 10,
          }}>
          <TouchableOpacity
            style={[
              {
                backgroundColor: '#624185',
                paddingVertical: 10,
                paddingHorizontal: 25,
                marginTop: 15,
                width: 250,
                borderRadius: 8,
              },
            ]}
            onPress={() =>
              Linking.openURL('https://www.checkle.com/happyhour_request')
            }>
            <Text style={{color: '#fff', textAlign: 'center'}}>
              Send request
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  loadingLocation: state.location.loadingLocation,
});

const mapDispatchToProps = {
  dispatchSetSearch: setSearch,
  dispatchSetInitial: setInitial,
  dispatchSetDeals: setDeals,
  dispatchSetLocation: setLocation,
};

export default connect(mapStateToProps, mapDispatchToProps)(NoDeals);
