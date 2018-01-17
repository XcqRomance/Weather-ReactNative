import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, ItemSeparatorComponent, ImageBackground, ListView } from 'react-native';

export default class ImageList extends React.Component {
	constructor(props) {
	  super(props);
		// var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
	 //  this.state = {
	 //  	dataSource: ds.cloneWithRows(['row 1', 'row 2','row 1', 'row 2','row 1', 'row 2','row 1', 'row 2','row 1', 'row 2']),
	 //  };
	}

	render() {
		// console.log('sssss222222',this.props.list)
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
		console.log('sssss33333333',rowData)
		let url = rowData.length == 0 ? "http://image.firstleap.cn/image/20160125/1453701957e8Gh.jpg" : rowData
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
    width: 90,
    // height: 40,
    // padding: 1,
    // margin: 10,
    justifyContent: 'center',
    alignItems: 'stretch',
    flex: 1
  },
  row: {
  	// flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    marginBottom: 5,
    width: 90,
    height: 90,
    backgroundColor: '#F6F6F6',
    
  },
})