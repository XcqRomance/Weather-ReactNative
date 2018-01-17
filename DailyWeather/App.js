import React from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import MapScreen from './Map';
import CityScreen from './City';
import GrowListScreen from './GrowList';
import WeatherScreen from './Weather';

const StackCity = StackNavigator({
  City: {
      screen: CityScreen,
    },
});


const WeatherTab = StackNavigator(
  {
    Weather: {
      screen: WeatherScreen,
    },
    City: {
      screen: StackCity,
    }
  },
  {
    headerMode: 'none',
    mode: 'modal',
  },
);

const GrowListTab = StackNavigator(
  {
    GrowList: {
      screen: GrowListScreen,
      navigationOptions: {
        title: 'Long List',
      },
    }
  }

)

const MapTab = StackNavigator(
  {
    Map: {
      screen: MapScreen,
      navigationOptions: {
        title: 'Map View',
      },
    }
  }
);

const TabsApp = TabNavigator(
  {
    WeatherTab: {
      screen: WeatherTab,
      navigationOptions: {
        tabBarLabel: '天气',
      },
    },
    ListTab: {
      screen: GrowListTab,
      navigationOptions: {
        tabBarLabel: '长列表'
      }
    },
    MapTab: {
      screen: MapTab,
      navigationOptions: {
        tabBarLabel: '地图'
      }
    },
    
  },
  // {
  //   tabBarPosition: 'bottom',
  //   animationEnabled: false,
  //   swipeEnabled: false,
  //   tabBarOptions: {
  //     activeTintColor: Platform.OS === 'ios' ? '#e91e63' : '#fff',
  //   },
  // }
);

export default class App extends React.Component {
  render() {
    return <TabsApp />
  }
}