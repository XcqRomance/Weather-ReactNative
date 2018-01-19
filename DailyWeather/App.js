import React from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import MapScreen from './Map';
import CityScreen from './City';
import GrowListScreen from './GrowList';
import WeatherScreen from './Weather';
import LargeListSample from './LargeListSample';

if (!__DEV__) { // 正式环境console不打印
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    debug: () => {},
    error: () => {},
  };
}

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
    // City: {
    //   screen: StackCity,
    // }
  },
  {
    headerMode: 'none',
    // mode: 'modal',
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
    Large: {
      screen: LargeListSample,
      navigationOptions: {
        tabBarLabel: 'LargeListSample'
      }
    }
  },
);

const StacksOverTabs = StackNavigator(
  {
    Root: {
      screen: TabsApp,
    },
    City: {
      screen: StackCity,
    }
  },
  {
    headerMode: 'none',
  }
)

export default class App extends React.Component {
  render() {
    return <StacksOverTabs />
  }
}