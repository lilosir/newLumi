'use strict';

var {Actions} = require('react-native-router-flux');
var React = require('react-native');
var apis = require('../apis');
var Loading = require('./loading');
var Reload = require('./reload');
var UserAPIS = require('../operations/users');
var {Avatar, List, Subheader, IconToggle, Icon, Button} = require('react-native-material-design');
var TimerMixin = require('react-timer-mixin');
var GCM = require('../gcmdata');
var apis = require('../apis');
var Spinner = require('react-native-spinkit');

var {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Image,
	TouchableOpacity,
	Dimensions,
	RefreshControl,
}= React;


var {height, width} = Dimensions.get('window');

var Bala = React.createClass({

	mixins: [TimerMixin],

	getInitialState: function() {
		return {
			isRefreshing: false,
			bala: [],
			isLoadingOld: false,
		};
	},

	componentDidMount: async function() {

		// this.setTimeout(()=>{
	 //      this.fetchRecent();
	 //    }, 500);   
		this.setState({
			bala: this.getInitialbala(),
		});

	},

	getInitialbala: function(){

		return [
			{
				contents:'This is the 1 bala',
				dislike: 20,
				like: 12,
			},
			{
				contents:'This is the 2 bala',
				dislike: 20,
				like: 12,
			},
			{
				contents:'This is the 3 bala xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
				dislike: 20,
				like: 12,
			},
			{
				contents:'This is the 4 bala',
				dislike: 20,
				like: 12,
			},
			{
				contents:'This is the 5 bala',
				dislike: 20,
				like: 12,
			},
		];

	},

	_goThisPost: function(item){
		Actions.aroundmepost();
	},

	_onRefresh() {
	    this.setState({isRefreshing: true});
	    setTimeout(() => {

	    	var newBala = [
	    		{
					contents:'This is a new bala',
					dislike: 20,
					like: 12,
				},
	    	]

	    	this.setState({
	    		bala: newBala.concat(this.state.bala),
	    	});

			this.setState({isRefreshing: false});
	    }, 3000);
	},

	_getOld: function(){

		setTimeout(() => {

	    	var oldBala = [
	    		{
					contents:'This is the very old bala',
					dislike: 20,
					like: 12,
				},
	    	]

	    	this.setState({
	    		bala: this.state.bala.concat(oldBala),
	    	});

			this.setState({isRefreshing: false});

			this.setState({
				isLoadingOld: false, 
			});

	    }, 3000);
	    
	},

	loadmore: function(){
		this.setState({
			isLoadingOld: true, 
		});
		this._getOld();		
	},

	render: function() {

	    if(this.state.isLoadingOld){
	    	var spin = <View style={styles.loadmore}>
	    					<Spinner size={30} type={'CircleFlip'} color={'grey'}/>
	    				</View>
	    }

	    if(!this.state.isLoadingOld){
	    	var button = <View style={styles.loadmore}>
				      		<Button text="load more" onPress={this.loadmore}/>
				      	</View>
	    }

		return (
			<ScrollView 
				ref={(component) => this._scrollView = component}
				style={styles.container}
				refreshControl={
		          <RefreshControl
		            refreshing={this.state.isRefreshing}
		            onRefresh={this._onRefresh}
		            titleColor="#00ff00"
		            colors={['#f4cb0d']}
		            progressBackgroundColor="#00437a"/>}>

		        {this.state.bala.map((item,i)=>(
		        <View style={{marginTop:5, marginBottom:5}} key={i}>
		        		<View style={styles.listView}>
				        	<View style={styles.contents}>
				        		<Text style={styles.contentsText}> {item.contents} </Text>
				        	</View>
				        	<View style={styles.likebar}>
					    		<View style={{marginRight: 5}}>
					    			<Icon size={20} name="thumb-up"/>
					    		</View>
					    		<View style={{marginRight: 20}}>
					    			<Text style={{fontSize : 12,color: '#eaeae1',}}> {item.like} </Text>
					    		</View>
					    		<View style={{marginRight: 5}}>
					    			<Icon size={20} name="thumb-down"/>
					    		</View>
					    		<View style={{marginRight: 20}}>
					    			<Text style={{fontSize : 12,color: '#eaeae1',}}> {item.dislike} </Text>
					    		</View>
					    	</View>
				        </View>			
		        </View>
		        ))}
		        {spin}
		        {button}
	      	</ScrollView>
    	);
  	}
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#001a33',
  },

  loadmore: {
  	justifyContent:'center',
  	alignItems: 'center',
  	height: 40, 
  	backgroundColor:'black',
  },

  listView: {
    borderBottomWidth:0.5,
    borderBottomColor: "#dddddd",
    borderTopWidth:0.5,
    borderTopColor: "#dddddd",
    backgroundColor: "#00284d"
  },

  like: {
  	flex: 1,
  	alignItems: 'center',
  	marginBottom: 15,
  },

  contentsText: {
  	fontSize : 16,
  	color: '#eaeae1',
  },

  contents: {
  	marginLeft: 10,
  	marginRight: 10,
  	marginTop: 30,
  	marginBottom:20,
  },

  likebar: {
  		flexDirection: 'row',
  		height: 30,
		justifyContent: 'center',
		alignSelf : 'flex-end',
  	},
});

module.exports = Bala;
