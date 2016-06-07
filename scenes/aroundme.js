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

var AroundMe = React.createClass({

	mixins: [TimerMixin],

	getInitialState: function() {
		return {
			isRefreshing: false,
			news: [],
			isLoadingOld: false,
		};
	},

	componentDidMount: async function() {

		// this.setTimeout(()=>{
	 //      this.fetchRecent();
	 //    }, 500);   
		this.setState({
			news: this.getInitialNews()
		});

	},

	getInitialNews: function(){

		return [
			{
				subject:'This is the 1 post',
				reply: 20,
				like: 12,
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "Daibi",
				image: apis.BASE_URL + '/' + 'images/react.png',
			},
			{
				subject:'This is the 2 post',
				reply: 320,
				like: 120,
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "Niubi",
				image: apis.BASE_URL + '/' + 'images/react.png',
			},
			{
				subject:'This is the 3 post',
				reply: 20,
				like: 12,
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "Daibi",
				image: apis.BASE_URL + '/' + 'images/react.png',
			},
			{
				subject:'This is the 4 post',
				reply: 320,
				like: 120,
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "Niubi",
				image: apis.BASE_URL + '/' + 'images/react.png',
			},
			{
				subject:'This is the 5 post',
				reply: 20,
				like: 12,
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "Daibi",
				image: apis.BASE_URL + '/' + 'images/react.png',
			},
		];

	},

	_goThisPost: function(item){
		Actions.aroundmepost();
	},

	_onRefresh() {
	    this.setState({isRefreshing: true});
	    setTimeout(() => {

	    	var newPost = [
	    		{
					subject:'New one',
					reply: 310,
					like: 212,
					avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
					nickname: "X!!!!!",
					image: apis.BASE_URL + '/' + 'images/react.png',
				},
	    	]

	    	// newPost = newPost.concat(this.state.news);

	    	this.setState({
	    		news: newPost.concat(this.state.news),
	    	});

			this.setState({isRefreshing: false});
	    }, 3000);
	},

	_getOld: function(){

		setTimeout(() => {

	    	var oldPost = [
	    		{
					subject:'very old one',
					reply: '32K',
					like: '12K',
					avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
					nickname: "PIS",
					image: apis.BASE_URL + '/' + 'images/react.png',
				},
	    	]

	    	this.setState({
	    		news: this.state.news.concat(oldPost),
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

		        {this.state.news.map((item,i)=>(
		        	<TouchableOpacity onPress={()=> this._goThisPost(item)} key={i}>
		        		<View style={styles.listView}>
				        	<View style={styles.icons}>
				        		<Icon name={"sms"} color="#ff531a" size={20}/>
				        		<Text style={styles.reply}> {item.reply} </Text>
				        	</View>
				        	<View style={styles.contents}>
				        		<View style={styles.subjectAndImage}>
				        			<View style={styles.subject}>
					        			<Text style={styles.subjectText}> {item.subject} </Text>
					        		</View>
					        		<View style={styles.image}>
					        			<Image style={{width: 50, height: 50}} source={{ uri: item.image }}/>
					        		</View>
				        		</View>
				        		<View style={styles.avatarAndNickname}>
				        			<View style={{marginLeft: 20}}>
				        				<Avatar image={<Image source={{ uri: item.avatar }} />} size={25}/>
				        			</View>
				        			<View style={{marginLeft: 10}}>
				        				<Text> {item.nickname}</Text>
				        			</View>
				        		</View>
				        	</View>
				        </View>		
		        	</TouchableOpacity>		
		        ))}
		        {spin}
		        {button}
	      	</ScrollView>
    	);
  	}
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },

  loadmore: {
  	justifyContent:'center',
  	alignItems: 'center',
  	height: 40, 
  	backgroundColor:'black',
  },

  listView: {
  	flexDirection: 'row',
    borderBottomWidth:0.5,
    borderBottomColor: "#dddddd",
    height: 110,
  },

  icons: {
  	flex: 1,
  	alignItems: 'center',
  	marginTop: 15,
  },

  like: {
  	flex: 1,
  	alignItems: 'center',
  	marginBottom: 15,
  },

  reply: {
  	fontSize : 10,
  },

  contents: {
  	marginTop: 10,
  	flexDirection: "column",
  	flex: 8,
  },

  subjectAndImage: {
  	flex:3,
  	// backgroundColor: '#321312',
  	flexDirection: 'row',
  },

  subject: {
  	marginLeft: 15,
  	flex: 5,
  },

  subjectText: {
  	fontWeight: '200',
  	fontSize: 18,
  	color: 'black',
  },

  image: {
  	flex:2,
  	alignItems: 'center',
  	justifyContent: 'center',
  },

  avatarAndNickname: {
  	flex: 2,
  	// backgroundColor: "#123123",
  	alignItems: 'center',
  	flexDirection: 'row',
  },
});

module.exports = AroundMe;
