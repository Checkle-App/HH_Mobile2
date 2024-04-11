import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CatergoryIcons from '../../assets/Category_Icons';

const styles = StyleSheet.create({
  /* Categroy Icon */
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    lineHeight: 30,
    fontSize: 16,
    color: '#000',
    marginLeft: 2,
    marginRight: 15,
  },
});

export default props => {
  const types = props.dealType.map(type => type.toLowerCase());
  return (
    <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
      {types.includes('arcade') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.ArcadeIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Arcade</Text>}
        </View>
      )}
      {types.includes('american') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.HamburgerIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>American</Text>}
        </View>
      )}
      {types.includes('appetizers') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.AppetizerIcon width={24} height={24} />
          </View>
          {props.showName && (
            <Text style={styles.categoryText}>Appetizers</Text>
          )}
        </View>
      )}
      {types.includes('bar') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.BarIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Bar</Text>}
        </View>
      )}
      {types.includes('barbecue') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.BBQIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Barbecue</Text>}
        </View>
      )}
      {types.includes('beer') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.PintIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Beer</Text>}
        </View>
      )}
      {types.includes('black-tie') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.BlackTieIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Black-Tie</Text>}
        </View>
      )}
      {types.includes('breakfast') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.PancakeIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Breakfast</Text>}
        </View>
      )}
      {types.includes('brunch') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.BreakfastIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Brunch</Text>}
        </View>
      )}
      {types.includes('buffet') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.BuffetIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Buffet</Text>}
        </View>
      )}
      {types.includes(`bloody mary’s`) && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.BloodyMaryIcon width={24} height={24} />
          </View>
          {props.showName && (
            <Text style={styles.categoryText}>Bloody Mary</Text>
          )}
        </View>
      )}
      {types.includes('charity') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.CharityIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Charity</Text>}
        </View>
      )}
      {types.includes('chicken wings') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.ChickenIcon width={24} height={24} />
          </View>
          {props.showName && (
            <Text style={styles.categoryText}>Chicken Wings</Text>
          )}
        </View>
      )}
      {types.includes('chili') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.ChiliIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Chili</Text>}
        </View>
      )}
      {types.includes('chinese') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.BentoIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Chinese</Text>}
        </View>
      )}
      {types.includes('club') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.DJIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Club</Text>}
        </View>
      )}
      {types.includes('cocktail') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.CocktailIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Cocktail</Text>}
        </View>
      )}
      {types.includes('coffee') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.CoffeeIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Coffee</Text>}
        </View>
      )}
      {types.includes('carryout') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.CoronaVirusCarryoutIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Carryout</Text>}
        </View>
      )}
      {types.includes('coronavirus carryout') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.CoronaVirusCarryoutIcon width={24} height={24} />
          </View>
          {props.showName && (
            <View style={{flexDirection: 'column', justifyContent: 'center'}}>
              <Text
                style={{
                  lineHeight: 20,
                  fontSize: 16,
                  color: '#000',
                  marginLeft: 2,
                  marginRight: 15,
                }}>
                Coronavirus
              </Text>
              <Text
                style={{
                  lineHeight: 20,
                  fontSize: 16,
                  color: '#000',
                  marginLeft: 2,
                  marginRight: 15,
                }}>
                Carryout
              </Text>
            </View>
          )}
        </View>
      )}
      {types.includes('dessert') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.IcecreamIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Dessert</Text>}
        </View>
      )}
      {types.includes('dine-in') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.DineInIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Dine-In</Text>}
        </View>
      )}
      {types.includes('dinner') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.DinnerIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Dinner</Text>}
        </View>
      )}
      {types.includes('fast-food') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.FrenchFriesIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Fast Food</Text>}
        </View>
      )}
      {types.includes('food truck') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.FoodTruckIcon width={24} height={24} />
          </View>
          {props.showName && (
            <Text style={styles.categoryText}>Food Truck</Text>
          )}
        </View>
      )}
      {types.includes('french') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.FrenchIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>French</Text>}
        </View>
      )}
      {types.includes('gluten free') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.NoGlutenIcon width={24} height={24} />
          </View>
          {props.showName && (
            <Text style={styles.categoryText}>Gluten-Free</Text>
          )}
        </View>
      )}
      {types.includes('greek') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.GreekIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Greek</Text>}
        </View>
      )}
      {types.includes('healthy') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.HealthyIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Healthy</Text>}
        </View>
      )}
      {types.includes('hamburger') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.Hamburger2Icon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Hamburger</Text>}
        </View>
      )}
      {types.includes('happy hour') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.HappyHourIcon width={24} height={24} />
          </View>
          {props.showName && (
            <Text style={styles.categoryText}>Happy Hour</Text>
          )}
        </View>
      )}
      {types.includes('indian') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.NaanIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Indian</Text>}
        </View>
      )}
      {types.includes('italian') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.ItalianIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Italian</Text>}
        </View>
      )}
      {types.includes('japanese') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.RiceBowlIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Japanese</Text>}
        </View>
      )}
      {types.includes('karaoke') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.MicrophoneIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Karaoke</Text>}
        </View>
      )}
      {types.includes('kids eat free') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.ChildrenIcon width={24} height={24} />
          </View>
          {props.showName && (
            <Text style={styles.categoryText}>Kids Eat Free</Text>
          )}
        </View>
      )}
      {types.includes('late night') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.LateNightIcon width={24} height={24} />
          </View>
          {props.showName && (
            <Text style={styles.categoryText}>Late Night</Text>
          )}
        </View>
      )}
      {types.includes('liquor') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.GlassIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Liquor</Text>}
        </View>
      )}
      {types.includes('live music') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.MusicIcon width={24} height={24} />
          </View>
          {props.showName && (
            <Text style={styles.categoryText}>Live Music</Text>
          )}
        </View>
      )}
      {types.includes('lounge') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.LoungeIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Lounge</Text>}
        </View>
      )}
      {types.includes('lunch') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.LunchIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Lunch</Text>}
        </View>
      )}
      {types.includes('margarita') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.MargaritaIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Margarita</Text>}
        </View>
      )}
      {types.includes('mexican') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.MexicanIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Mexican</Text>}
        </View>
      )}
      {types.includes('mimosas') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.MimosaIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Mimosas</Text>}
        </View>
      )}
      {types.includes('night life') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.NightIcon width={24} height={24} />
          </View>
          {props.showName && (
            <Text style={styles.categoryText}>Night Life</Text>
          )}
        </View>
      )}
      {types.includes('pet friendly') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.DogPrintIcon width={24} height={24} />
          </View>
          {props.showName && (
            <Text style={styles.categoryText}>Pet Friendly</Text>
          )}
        </View>
      )}
      {types.includes('pizza') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.PizzaIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Pizza</Text>}
        </View>
      )}
      {types.includes('rooftop') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.RooftopIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Rooftop</Text>}
        </View>
      )}
      {types.includes('sandwiches') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.SandwichIcon width={24} height={24} />
          </View>
          {props.showName && (
            <Text style={styles.categoryText}>Sandwiches</Text>
          )}
        </View>
      )}
      {types.includes('seafood') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.CrabIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Seafood</Text>}
        </View>
      )}
      {types.includes('speakeasy') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.SpeakEasyIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Speakeasy</Text>}
        </View>
      )}
      {types.includes('sports bar') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.SportsIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Sports</Text>}
        </View>
      )}
      {types.includes('steak') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.SteakIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Steak</Text>}
        </View>
      )}
      {types.includes('sushi') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.SushiIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Sushi</Text>}
        </View>
      )}
      {types.includes('tacos') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.TacoIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Tacos</Text>}
        </View>
      )}
      {types.includes('thai') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.ThailandIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Thai</Text>}
        </View>
      )}
      {types.includes('trivia') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.AskIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Trivia</Text>}
        </View>
      )}
      {types.includes('video game') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.VideoGameIcon width={24} height={24} />
          </View>
          {props.showName && (
            <Text style={styles.categoryText}>Video Games</Text>
          )}
        </View>
      )}
      {types.includes('vietnamese') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.VietnamIcon width={24} height={24} />
          </View>
          {props.showName && (
            <Text style={styles.categoryText}>Vietnamese</Text>
          )}
        </View>
      )}
      {types.includes('wine') && (
        <View style={styles.container}>
          <View
            style={[
              styles.categoryIcon,
              props.listView ? {marginLeft: 5} : {marginRight: 5},
            ]}>
            <CatergoryIcons.WineIcon width={24} height={24} />
          </View>
          {props.showName && <Text style={styles.categoryText}>Wine</Text>}
        </View>
      )}
    </View>
  );
};
