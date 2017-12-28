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
  TouchableOpacity
} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

class HomeScreen extends Component < {} > {

  //组件的构造方法，在组建创建的时候调用
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
      basic: {},
      title: '海淀' // 默认获取海淀区的天气
    };
  }

  // 页面的渲染
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
        {/*北京图*/}
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
    this.setupData(this.state.title);
  }

  // 组件已经装载，绘制完毕调用
  componentDidMount() {
    console.log(screenWidth)
    console.log(screenHeight)
    this.setupData(this.state.title);
  }

  // 组件即将卸载，组件要被从界面上移除时调用
  componentWillUnmount() {
    console.log('HomeScreen','componentWillUnmount')
  }

  setupData(cityname) {
    // cityid可以使用cityid 也可以使用 城市名，选择城市回调回来
    let urlstr = 'http://guolin.tech/api/weather?key=41dd96cb90344217acbf5fe0813f16cd' + '&cityid=' + cityname
    console.log(urlstr)
    fetch(urlstr)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('success1', responseJson);
        console.log('success2', responseJson.HeWeather[0].daily_forecast);
        console.log('success3', responseJson.HeWeather[0].suggestion);

        this.setState({
          refreshing: false,
          isLoading: false,
          dataSource: this.state.dataSource.cloneWithRows(responseJson.HeWeather[0].daily_forecast),
          suggegstions: responseJson.HeWeather[0].suggestion,
          aqi: responseJson.HeWeather[0].aqi,
          title: responseJson.HeWeather[0].basic.city,
          des: responseJson.HeWeather[0].now.cond.txt,
          temp: responseJson.HeWeather[0].now.tmp,
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  reanderHeader() {
    return (
      <View style={styles.header}>

            <View style={{flexDirection: 'row', alignItems: 'center' ,marginTop: 44, marginBottom: 10}}>
              <Text style={styles.headerTitle}>{this.state.title}</Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('City',{name: this.state.title, currentLevel: 0, callBack: (data) => {
                  console.log(data) // weather_id
                  this.setupData(data);
                }})}>
                <Image source={require('./address.png')}/>
              </TouchableOpacity>
            </View>
            <Text style={styles.headerDes}>{this.state.des}</Text>
            <Text style={styles.headerTepe}>{this.state.temp}℃</Text>
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

    static navigationOptions = ({ navigation }) => ({
      headerMode: 'float',
      gesturesEnabled: true,
      headerTitle: `${navigation.state.params.name}`,
      headerLeft: (
        <TouchableOpacity onPress={() => {
          navigation.goBack(null)        
      }}>
        <Image source={require('./moments_btn_back.png')} style={{marginLeft: 8}}/>    
      </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#6666ff',
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontSize: 20
      }
    });

    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        currentLevel: 0, // 0:province, 1:city, 2:county;
        provinces: [{}],
        provinceData: {},
        cityData: {}
      };
    }

    render() {
        const { navigation } = this.props;
        const { state, setParams, goBack } = navigation;
        const { params, currentLevel } = state;
        if (this.state.loading) {
          return (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator/>
      </View>)
        }
        return (
            <FlatList style={{backgroundColor: 'white'}}
          data={this.state.provinces}
          renderItem={({item}) => { 
            return (
              <TouchableOpacity 
                  style={{justifyContent: 'center', alignItems: 'center',height: 44}}
                  onPress={() => {
                    setParams({name: item.name})
                    let level = this.state.currentLevel
                    if (this.state.currentLevel === 0) {
                      this.state.provinceData = item
                    } else if (this.state.currentLevel === 1) {
                      this.state.cityData = item
                    }
                    if (this.state.currentLevel === 2) {
                      console.log("goBack")
                      state.params.callBack(item.weather_id) // 回调
                      goBack(null)
                    } else {
                      this.state.currentLevel = level + 1
                      setParams({currentLevel: level + 1})
                      console.log(this.state.currentLevel)
                      // console.log(this.state.provinceData )
                      this.state.loading = true 
                      this.setupData(this.state.currentLevel)
                    }
                  }}>
                  <Text style={{ color: 'gray', fontSize: 20}} >{item.name} </Text>   
              </TouchableOpacity>
             
            )} }
          ItemSeparatorComponent={ () => { return (
            <View style={{height: 1, backgroundColor: '#eee'}}/> //</View>
            )}}
          keyExtractor={
            (item, index) => item.id
          }
        />
      )
  }

  componentDidMount() {
    this.setupData(0)
  }

  setupData(level) {

    var urlstr = ''

    if (level == 0) {
      urlstr = 'http://guolin.tech/api/china'
    } else if (level == 1) {
      let provinceData = this.state.provinceData
      console.log(provinceData)
      urlstr = 'http://guolin.tech/api/china/' + `${provinceData.id}`
    } else if (level == 2) {
      let provinceData = this.state.provinceData
      let cityData = this.state.cityData
      urlstr = 'http://guolin.tech/api/china/' + `${provinceData.id}` + '/' + `${cityData.id}`
    }
    console.log(urlstr)
    fetch(urlstr)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
          loading: false,
          provinces: responseJson,
          currentLevel: level,
        })
      })
      .catch((error) => {
        console.error(error);
      });
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
  headerTitleContainer: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: 44,
    backgroundColor: 'red',
    width: screenWidth,
  },
  headerTitle: {
    color: 'white',
    fontSize: 30,
    marginRight: 20,
    // marginTop: 44,
    // marginBottom: 10,
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
    },
})


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
    mode: 'modal',
  },
)

export default class App extends React.Component {
  render() {
    return <StackApp />
  }
}