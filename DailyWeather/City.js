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
import { StackNavigator, NavigationActions, TabNavigator } from 'react-navigation';

export default class CityScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
      headerMode: 'float',
      gesturesEnabled: true,
      headerTitle: `${navigation.state.params.name}`,
      headerLeft: (
        <TouchableOpacity onPress={() => {
          navigation.goBack(null)        
      }}>
        <Image source={require('./img/moments_btn_back.png')} style={{marginLeft: 8}}/>    
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
