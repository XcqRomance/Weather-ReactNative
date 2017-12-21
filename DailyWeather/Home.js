import React, {
	Component
} from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	View,
	ScrollView,
	FlatList,
	Dimensions,
	Image,
	ImageBackground
} from 'react-native';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default class Home extends Component < {} > {

	componentDidMount() {
		console.log(screenWidth)
		console.log(screenHeight)
	}
	// 	<View style={{height: 44,padding: 20,backgroundColor: 'blue'}}>

	// 	</View>

	render() {
		return (
			<View style={{flex: 1}}>
				<ImageBackground source={{uri: 'http://cn.bing.com/az/hprichbg/rb/BarHarborCave_ROW9345444229_1920x1080.jpg'}}  style={{width: screenWidth, height: screenHeight}}>
					<ScrollView style = {{flex: 1}}>
					<View style={styles.header}>
						<Text style={styles.headerTitle}>哈尔滨</Text>
						<Text style={styles.headerDes}>晴</Text>
						<Text style={styles.headerTepe}>8℃</Text>
						
					</View>
					<View style={styles.forecast}>
						<Text>预报</Text>
						<FlatList
							data={[
				            {key: 'Devin'},
				            {key: 'Jackson'},
				            {key: 'James'},
				            {key: 'Joel'},
				            {key: 'John'},
				            {key: 'Jillian'},
				            {key: 'Jimmy'},
				            {key: 'Julie'},
				          ]}
				          renderItem={({item}) => <Text style={styles.item}>{item.key}</Text> }
				        />
					</View>
					<View style={{backgroundColor: 'purple',margin: 20}}>
						<Text>空气质量</Text>
					</View>
					<View style={{backgroundColor: 'orange'}}>
							<FlatList
							data={[
				            {key: 'Devin'},
				            {key: 'Jackson'},
				            {key: 'James'},
				            {key: 'Joel'},
				            {key: 'John'},
				            {key: 'Jillian'},
				            {key: 'Jimmy'},
				            {key: 'Julie'},
				          ]}
				          renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
				        />
					</View>
				</ScrollView>
				</ImageBackground>

			
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
});