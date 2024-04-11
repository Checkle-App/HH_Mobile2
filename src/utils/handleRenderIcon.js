import React from 'react';
import {View, Dimensions} from 'react-native';
import CatergoryIcons from '../../assets/Category_Icons';

const {width: viewportWidth} = Dimensions.get('window');
function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

export default category => {
  const type = category.toLowerCase();
  const categorySize = wp(9);
  return (
    <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
      {type.includes('arcade') && (
        <CatergoryIcons.ArcadeIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('american') && (
        <CatergoryIcons.HamburgerIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('appetizers') && (
        <CatergoryIcons.AppetizerIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('bar') && (
        <CatergoryIcons.BarIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('barbecue') && (
        <CatergoryIcons.BBQIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('beer') && (
        <CatergoryIcons.PintIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('black-tie') && (
        <CatergoryIcons.BlackTieIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('breakfast') && (
        <CatergoryIcons.PancakeIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('brunch') && (
        <CatergoryIcons.BreakfastIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('buffet') && (
        <CatergoryIcons.BuffetIcon width={categorySize} height={categorySize} />
      )}
      {type.includes(`bloody mary’s`) && (
        <CatergoryIcons.BloodyMaryIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('charity') && (
        <CatergoryIcons.CharityIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('chicken wings') && (
        <CatergoryIcons.ChickenIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('chili') && (
        <CatergoryIcons.ChiliIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('chinese') && (
        <CatergoryIcons.BentoIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('club') && (
        <CatergoryIcons.DJIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('cocktail') && (
        <CatergoryIcons.CocktailIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('coffee') && (
        <CatergoryIcons.CoffeeIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('carryout') && (
        <CatergoryIcons.CoronaVirusCarryoutIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('coronavirus carryout') && (
        <CatergoryIcons.CoronaVirusCarryoutIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('dessert') && (
        <CatergoryIcons.IcecreamIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('dine-in') && (
        <CatergoryIcons.DineInIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('dinner') && (
        <CatergoryIcons.DinnerIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('fast-food') && (
        <CatergoryIcons.FrenchFriesIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('food truck') && (
        <CatergoryIcons.FoodTruckIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('french') && (
        <CatergoryIcons.FrenchIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('gluten free') && (
        <CatergoryIcons.NoGlutenIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('greek') && (
        <CatergoryIcons.GreekIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('healthy') && (
        <CatergoryIcons.HealthyIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('hamburger') && (
        <CatergoryIcons.Hamburger2Icon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('happy hour') && (
        <CatergoryIcons.HappyHourIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('indian') && (
        <CatergoryIcons.NaanIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('italian') && (
        <CatergoryIcons.ItalianIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('japanese') && (
        <CatergoryIcons.RiceBowlIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('karaoke') && (
        <CatergoryIcons.MicrophoneIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('kids eat free') && (
        <CatergoryIcons.ChildrenIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('late night') && (
        <CatergoryIcons.LateNightIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('liquor') && (
        <CatergoryIcons.GlassIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('live music') && (
        <CatergoryIcons.MusicIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('lounge') && (
        <CatergoryIcons.LoungeIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('lunch') && (
        <CatergoryIcons.LunchIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('margarita') && (
        <CatergoryIcons.MargaritaIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('mexican') && (
        <CatergoryIcons.MexicanIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('mimosas') && (
        <CatergoryIcons.MimosaIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('night life') && (
        <CatergoryIcons.NightIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('pet friendly') && (
        <CatergoryIcons.DogPrintIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('pizza') && (
        <CatergoryIcons.PizzaIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('rooftop') && (
        <CatergoryIcons.RooftopIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('sandwiches') && (
        <CatergoryIcons.SandwichIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('seafood') && (
        <CatergoryIcons.CrabIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('speakeasy') && (
        <CatergoryIcons.SpeakEasyIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('sports bar') && (
        <CatergoryIcons.SportsIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('steak') && (
        <CatergoryIcons.SteakIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('sushi') && (
        <CatergoryIcons.SushiIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('tacos') && (
        <CatergoryIcons.TacoIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('thai') && (
        <CatergoryIcons.ThailandIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('trivia') && (
        <CatergoryIcons.AskIcon width={categorySize} height={categorySize} />
      )}
      {type.includes('video game') && (
        <CatergoryIcons.VideoGameIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('vietnamese') && (
        <CatergoryIcons.VietnamIcon
          width={categorySize}
          height={categorySize}
        />
      )}
      {type.includes('wine') && (
        <CatergoryIcons.WineIcon width={categorySize} height={categorySize} />
      )}
    </View>
  );
};
