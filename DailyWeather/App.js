import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
  ImageBackground,
  TouchableHighlight,
  ListView,
  RefreshControl,
  ActivityIndicator,
  Button,
  VirtualizedList,
} from 'react-native';
import { StackNavigator } from 'react-navigation';


var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

class HomeScreen extends Component < {} > {

  // static navigationOptions = {

  // }

  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      isLoading: true,
      quiltyColor: true,
      refreshing: false,
      dataSource: ds,
      suggegstions: {}, // 代表一个空json,生活建议
      aqi: {}, // aqi
    };
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator/>
        </View>
      )
    }
    return (
      <View style={{flex: 1}}>
        <ImageBackground source={{uri: 'http://cn.bing.com/az/hprichbg/rb/BarHarborCave_ROW9345444229_1920x1080.jpg'}}  style={{width: screenWidth, height: screenHeight}}>
          <ScrollView style = {{flex: 1}} 
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh.bind(this)}/>
            }>
            
            {/*渲染头部信息*/}
            {this.reanderHeader()}
            {/*渲染天气预报列表*/}
            {this.reanderForecast()}
            {/*渲染天气质量*/}
            {this.renderAirquilty()}
            {/*渲染生活指数*/}
            {this.renderSuggestion()}
          </ScrollView> 
        </ImageBackground>
      </View>
    );
  }

  _onRefresh() {
    this.setupData();
  }

  componentDidMount() {
    console.log(screenWidth)
    console.log(screenHeight)
    this.setupData();
  }

  setupData() {
    fetch('http://guolin.tech/api/weather?cityid=CN101050101&key=41dd96cb90344217acbf5fe0813f16cd')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('success1', responseJson);
        console.log('success2', responseJson.HeWeather[0].daily_forecast);
        console.log('success3', responseJson.HeWeather[0].suggestion);
        console.log('success3', responseJson.HeWeather[0].suggestion['air']);
        // console.log(JSON.parse(responseJson));
        // alert(responseJson.toString());
        this.setState({
          refreshing: false,
          isLoading: false,
          dataSource: this.state.dataSource.cloneWithRows(responseJson.HeWeather[0].daily_forecast),
          suggegstions: responseJson.HeWeather[0].suggestion,
          aqi: responseJson.HeWeather[0].aqi,
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  reanderHeader() {
    return (
      <View style={styles.header}>
            <Text style={styles.headerTitle}>哈尔滨</Text>
            <Text style={styles.headerDes}>晴</Text>
            <Text style={styles.headerTepe}>8℃</Text>
            <Button style={{color: 'red'}}
              title="选择城市"
              onPress={() => this.props.navigation.navigate('City',{name: "哈尔滨"})}
              />
      </View>
    );
  }

  reanderForecast() {
    return (
      <View style={styles.forecast}>
            <Text style={{color: 'white', fontSize: 20, marginBottom: 10}}>预报</Text>
            <ListView 
              dataSource={this.state.dataSource}
              renderRow={(rowData) =>  (
                <View style={styles.listView}>
                  <Text style={{color: 'white',flex: 1}}>{rowData.date}</Text>
                  <Text style={{color: 'white',flex: 1}}>{rowData.cond.txt_d}</Text>
                  <Text style={{color: 'white',flex: 1}}>{rowData.tmp.max}</Text>
                  <Text style={{color: 'white',flex: 1}}>{rowData.tmp.min}</Text>
                </View>
              )}/> 
      </View>
    );
}
// ,marginBottom: 20,marginTop: 20,marginLeft: 20  ,marginBottom: 20,marginTop: 20
renderAirquilty() {
  let {
    aqi
  } = this.state;
  return (
    <View>
        <View style={styles.suggestion}>
          <View style={{flexDirection: 'row',justifyContent: 'flex-start', alignItems: 'center',padding: 20}}>
            <Text style={{color: 'white',fontSize: 20}}>空气质量：</Text>
            <Text style={{color: 'red',fontSize: 17}}>{aqi.city.qlty}</Text>
          </View>
          <View style={{flex: 1,flexDirection: 'row'}}>
            <View style={{flex: 1, alignItems: 'center' }}>
              <Text style={styles.airQuiltyDes}>AQI指数</Text>
              <Text style={styles.airQuiltyValue}>{aqi.city.aqi}</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center' }}>
              <Text style={styles.airQuiltyDes}>PM2.5</Text>
              <Text style={styles.airQuiltyValue}>{aqi.city.pm25}</Text>
            </View>
          </View>
          <View style={{flex: 1,flexDirection: 'row'}}>
            <View style={{flex: 1,alignItems: 'center' }}>
              <Text style={styles.airQuiltyDes}>PM10</Text>
              <Text style={styles.airQuiltyValue}>{aqi.city.pm10}</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center' }}>
              <Text style={styles.airQuiltyDes}>O3指数</Text>
              <Text style={styles.airQuiltyValue}>{aqi.city.o3}</Text>
            </View>
          </View>
        </View>
      </View>
  )
}

renderSuggestion() {
  let {
    suggegstions
  } = this.state;
  return (
    <View style={styles.suggestion}>
        <Text style={{color: 'white',fontSize: 20,marginBottom: 20,marginTop: 20,marginLeft: 20}}>生活建议</Text>

        <Text style={styles.suggestionDes}>空气质量：{suggegstions.air.txt}</Text>
        <Text style={styles.suggestionDes}>舒适度：{suggegstions.comf.txt}</Text>
        <Text style={styles.suggestionDes}>洗车：{suggegstions.cw.txt}</Text>
        <Text style={styles.suggestionDes}>穿衣：{suggegstions.drsg.txt}</Text>
        <Text style={styles.suggestionDes}>感冒：{suggegstions.flu.txt}</Text>
        <Text style={styles.suggestionDes}>运动：{suggegstions.sport.txt}</Text>
        <Text style={styles.suggestionDes}>旅游：{suggegstions.trav.txt}</Text>
        <Text style={styles.suggestionDes}>紫外线：{suggegstions.uv.txt}</Text>
      </View>
  );
}

}

class CityScreen extends React.Component {

  static navigationOptions = ({navigation}) => ({
    headerMode: 'float',
    gesturesEnabled: true,
    headerTitle: `${navigation.state.params.name}`,
    headerRight: <Button title="back" onPress={() => navigation.goBack(null)}/> ,
  });

  // static provinceData = this.props.navigation.state.params.itemData


  constructor(props) {
    super(props);
  
    this.state = {
      loading: true,
      currentLevel: 0, // 0:province, 1:city, 2:county;
      provinces: [{}],
      cities: [{}],
      counties: [{}],
    };
  }

  componentDidMount() {
    this.setupData()
  }

  setupData() {
    
    var urlstr = ''
    
    var level = this.state.currentLevel
    if (this.props.navigation.state.params.level) {
      level = this.props.navigation.state.params.level
    }
    console.log(level)
    console.log(this.props.navigation.state.params.level)
    console.log(this.state.currentLevel)

    if (level == 0) {
      urlstr = 'http://guolin.tech/api/china'
    } else if (level == 1) {
      let provinceData = this.props.navigation.state.params.provinceData
      urlstr = 'http://guolin.tech/api/china/' + `${provinceData.id}`
    } else if (level == 2) {
      let provinceData = this.props.navigation.state.params.provinceData
      let cityData = this.props.navigation.state.params.cityData
      urlstr = 'http://guolin.tech/api/china/' + `${provinceData.id}` + '/' + `${cityData.id}`
    }
    console.log(urlstr)
    fetch(urlstr)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      if (level == 0) {

      } else if (level == 1) {

      } else if (level == 2) {

      }
      this.setState({
        loading: false,
        provinces: responseJson,
        currentLevel: level,
      })
      // console.log(this.state.currentLevel)
    })
    .catch((error) => {
        console.error(error);
    });
  }

    render() {
      
      if (this.state.loading) {
        return  (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator/>
        </View>)
      } 
      return (
        <View style={{backgroundColor: 'white', width: screenWidth,height: screenHeight}}>
          <FlatList
            data={this.state.provinces}
            renderItem={({item}) => { return (
              <Button 
                title={`${item.name}`}
                style={{backgroundColor: 'white',height: 44, justifyContent: 'center', alignItems: 'center'}} 
                onPress={() => {
                    this.state.currentLevel == 0 ? this.props.navigation.navigate('City',{name: `${item.name}`, level: this.state.currentLevel + 1,provinceData: item}) : this.props.navigation.navigate('City',{name: `${item.name}`, level: this.state.currentLevel + 1,provinceData: this.props.navigation.state.params.provinceData,cityData: item})
                  }}>
                <Text style={{color: 'gray', fontSize: 20}}>{item.name}</Text>
              </Button>
               
            )} }
            ItemSeparatorComponent={ () => { return (
              <View style={{height: 1, backgroundColor: '#eee'}}/> //</View>
              )}}
          />
        </View>
        )
    }

    _renderItem = (item) => {
      return (
        <View style={{backgroundColor: 'white',height: 44}}>
          <Text style={{padding: 20, color: 'gray'}}>{item.name}</Text>
        </View>
        )
    }
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  listView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44
  },
  header: {
    flex: 1,
    backgroundColor: '#0000',
    alignItems: 'center'
  },
  headerTitle: {
    color: 'white',
    fontSize: 30,
    marginTop: 44,
    marginBottom: 10,
  },
  headerTepe: {
    color: 'white',
    fontSize: 40,
    marginTop: 20,
    marginBottom: 44,
  },
  headerDes: {
    color: 'white',
    fontSize: 20,
  },
  forecast: {
    backgroundColor: '#fff0',
    margin: 20,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  suggestion: {
    margin: 20,
    backgroundColor: '#0007',
  },
  suggestionDes: {
    fontSize: 16,
    color: 'white',
    marginBottom: 18,
    marginLeft: 20,
    marginRight: 20
  },
  airQuiltyDes: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    marginTop: 10,
    marginBottom: 10
  },
  airQuiltyValue: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    marginBottom: 10
  }
});

const StackCity = StackNavigator({
  City: {
      screen: CityScreen,
    }
});


const StackApp = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    City: {
      screen: StackCity,
    }
  },
  {
    headerMode: 'none',
    mode: 'modal'
  },
  );

export default class App extends React.Component {
  render() {
    return <StackApp />
  }
}