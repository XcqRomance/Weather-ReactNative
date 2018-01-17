import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, ImageBackground, ListView, ActivityIndicator } from 'react-native';
import ImageList from './ImageList';
import AvatarList from './AvatarList';

export default class GrowListScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      refreshing: false,
      loading: false,
      dataSource: [],
      page: 1
    };
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator/>
        </View>
      )
    } else {
      return (
      <View style={styles.container}>
        <FlatList style={{flex: 1,}}
          data={this.state.dataSource}
          renderItem={this._renderItemComponent}
          keyExtractor={
            (item, index) => index
          }
          ItemSeparatorComponent={this._itemSeperatorComponent}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
          onEndReachedThreshold={0}
          onEndReached={({ distanceFromEnd }) => {
            console.log('on end reached ', distanceFromEnd)
            this.state.page += 1
            this.setState({
              page: this.state.page + 1,
              loading: true
            })
            this.setupData()
          }}
          ListFooterComponent={this.renderFooter()}
        />
      </View>
      );
    }
    
  }

  componentDidMount() {
    this.setupData()
  }

  _onRefresh = () => {
    this.setState({
      page: 1,
      refreshing: true,
      loading: false,
    }, () => {
      this.setupData();
    })
  }

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating  />
      </View>
    );
  };

  setupData() {
    setState = ({
      isLoading: true,
    })
    // this.state.isLoading = true
    // isLoading = true
    let urlstr = 'https://v4.firstleap.cn/mobileapi/v4/growrecord/teacher/growlist?class_id=55&role_id=6&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjg0Mzc4LCJpc3MiOiJodHRwOi8vdjQuZmlyc3RsZWFwLmNuIiwiaWF0IjoxNTE2MDgzOTQzLCJleHAiOjE1MTY2ODg3NDMsIm5iZiI6MTUxNTQ3OTE0MywianRpIjoiMTUxNjA4Mzk0MzMwNzM5MzIyNCJ9.SLQlG44lpJej3HEbXKTVOtT95sYqM38HvwnCGV-vh9k' + '&page=' + this.state.page
    console.log(urlstr)
    fetch(urlstr)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('success1', responseJson);
        console.log('success2', responseJson["data"]);
        // console.log('success3', responseJson.HeWeather[0].suggestion);
        this.state.page == 1 ? this.setState({
          isLoading: false,
          dataSource: responseJson["data"],
          refreshing: false
        }) : this.setState({
          isLoading: false,
          dataSource: this.state.dataSource.concat(responseJson["data"]),
        }) 
        
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          loading: false,
          refreshing: false,
        })
      });
  }

  _renderItemComponent = ({item, index}) => {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
    console.log('item', item.img_res, index, item.img_res.length);
    let imgs = item.img_res.split(',')
    // console.log('sssss111111',imgs)
    let students = item.students
    return (
      <View style={{backgroundColor: 'red'}}>
        {/*头像和名称*/}
        {this.renderHeader(item)}
        {/*文本内容*/}
        {this.renderTextComponent(item)}
        {/*九宫格图片*/}
        {
          item.img_res.length != 0 ? <ImageList 
                                      style={styles.imageList}
                                      list={ds.cloneWithRows(imgs)} 
                                      /> : null
        }
        
        {/*视频*/}
        {
          item.video_res.length != 0 ? this.renderVideo(item) : null
        }
        {/*音频*/}
        {
          item.voice_res.length != 0 ? this.renderAudio() : null
        }
        
        {/*孩子头像渲染*/}
        <AvatarList 
          style={styles.imageList}
          list={ds.cloneWithRows(students)} 
          />
        {this.renderBottomView()}
        <Text>{'index' + index}</Text>        
      </View>
      )
  }

  _itemSeperatorComponent = () => {
    return (
      <View style={{height: 2, backgroundColor: '#eee'}}/>
      )
  }

  renderHeader(item) {
    // 
    return (
      <View style={styles.itemHeader}>
        <Image 
          defaultSource={require('./img/img_teacher.png')} 
          source={{uri: item.avator}}
          style={styles.avator} />
        <Text style={styles.name}>{item.publisher}</Text>
      </View>
      )
  }

  renderTextComponent(item) {
    return (
      <View> 
        <Text style={styles.contentText}>{item.content}</Text>
      </View>
      )
  }

  renderImageView() {
    return (
      <View >
        <ImageBackground source={require('./img/bookDefault.png')} style={{width: 200, height: 200}}>
          <Image source={require('./img/img_video_play_gray.png')} style={{width: 200, height: 200}}/>
        </ImageBackground>
      </View>
      )
  }

  renderVideo(item) {
      return (
        <View style={styles.videoContainer}>
          <ImageBackground 
            defaultSource={require('./img/bookDefault.png')} 
            source={{uri: item.video_thumb}}
            style={styles.videImageView}>
            <Image source={require('./img/img_video_play_gray.png')} style={{width: 88, height: 88}}/>
          </ImageBackground>
        </View>
        )
  }

  renderAudio() {
    return (
        <View style={{height: 44,width: 100, backgroundColor: 'blue', marginLeft: 72, marginTop: 8}}>


        </View>
      )
  }

  renderBottomView() {
    return (
      <View style={{marginLeft: 72, flexDirection: 'row', marginTop: 8}}>
        <Text style={{flex: 1, backgroundColor: 'white'}}>2018-01-16</Text>
        <View style={{flex: 1, flexDirection: 'row',justifyContent: 'flex-end', backgroundColor: 'purple'}}>
          <Text style={{marginRight: 12}}>评论</Text>
          <Text style={{}}>删除</Text>
        </View>
      </View>
      )
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch', // 填充整个父容器
    justifyContent: 'center',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  itemHeader: {
    // backgroundColor: 'white',
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  avator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // marginTop: 20,
    marginLeft: 20
  },
  name: {
    marginLeft: 12,
    alignItems: 'center'
  },
  contentText: {
    marginTop: 12,
    marginLeft: 72,
  },
  videoContainer: {
    marginTop: 12,
    marginLeft: 72,
  },
  videImageView: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageList: {
    marginLeft: 72,
    marginTop: 12,
    backgroundColor: 'yellow',
  }

});