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
} from 'react-native';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default class Home extends Component < {} > {

	constructor(props) {
		super(props);

		var ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		this.state = {
			isLoading: true,
			dataSource: ds,
			suggegstions: {}, // 代表一个空json
		};
	}

	render() {
		if (this.state.isLoading) {
			return (
				<View>
					<Text>正在加载数据。。。</Text>
				</View>
			)
		}
		return (
			<View style={{flex: 1}}>
				<ImageBackground source={{uri: 'http://cn.bing.com/az/hprichbg/rb/BarHarborCave_ROW9345444229_1920x1080.jpg'}}  style={{width: screenWidth, height: screenHeight}}>
					<ScrollView style = {{flex: 1}}>
						{/*渲染头部信息*/}
						{this.reanderHeader()}
						{/*渲染天气预报列表*/}
						{this.reanderForecast()}
						{/*渲染天气质量*/}
						{this.renderAirquilty()}
						{/*渲染生活指数*/}
						{this.renderSuggestion()}
						<View></View>
					</ScrollView> 
				</ImageBackground>
			</View>
		);
	}

	componentDidMount() {
		console.log(screenWidth)
		console.log(screenHeight)
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
					isLoading: false,
					dataSource: this.state.dataSource.cloneWithRows(responseJson.HeWeather[0].daily_forecast),
					suggegstions: responseJson.HeWeather[0].suggestion,
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
	return (
		<View>
				<View style={styles.suggestion}>
					<Text style={{color: 'white',fontSize: 20,marginBottom: 20,marginTop: 20,marginLeft: 20}}>空气质量</Text>
					<View></View>
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

	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
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
	}
});