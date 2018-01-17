import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  // Dimensions,
  Image,
  ImageBackground,
  ListView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';

// var screenWidth = Dimensions.get('window').width;
// var screenHeight = Dimensions.get('window').height;

export default class WeatherScreen extends React.Component {

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
      <View>
        {/*北京图*/}
        <ImageBackground source={{uri: 'http://cn.bing.com/az/hprichbg/rb/BarHarborCave_ROW9345444229_1920x1080.jpg'}} style={{width: '100%', height: '100%'}}>
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
                <Image source={require('./img/address.png')}/>
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

const styles = StyleSheet.create({
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
    width: '100%',
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