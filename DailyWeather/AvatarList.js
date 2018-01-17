import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, ItemSeparatorComponent, ImageBackground, ListView } from 'react-native';

export default class AvatarList extends React.Component {
	constructor(props) {
	  super(props);
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
	  this.state = {
	  	dataSource: ds.cloneWithRows(['row 1', 'row 2','row 1', 'row 2','row 1', 'row 2','row 1', 'row 2','row 1', 'row 2']),
	  };
	}

	render() {
		return (
			<ListView 
				style={this.props.style}
				contentContainerStyle={styles.list}
	      dataSource={this.props.list}//{this.state.dataSource}
	      renderRow={this._renderRow}
	      scrollRenderAheadDistance={500}
	      pageSize={3} 
    	/>
		)
	}

	_renderRow = (rowData) => {
		// console.log('sfsjfllksdfkl',rowData.avator)
		let url = rowData.avator.length == 0 ? "http://image.firstleap.cn/image/20160125/1453701957e8Gh.jpg" : rowData.avator
		console.log('sfsjfllksdfkl', url)
		return (
			<View style={styles.row}>
				<Image 
					defaultSource={require('./img/bookDefault.png')} 
					source={{uri: url}} 
					style={styles.avator} />
				
			</View>
			)
	}
}

const styles = StyleSheet.create({
	list: {
    justifyContent: 'flex-start',//'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
	avator: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    marginBottom: 5,
    width: 30,
    height: 30,
    backgroundColor: '#F6F6F6',
    
  },
})