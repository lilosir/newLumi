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
var PostAPIS = require('../operations/posts');

var {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Image,
	TouchableOpacity,
	Dimensions,
	RefreshControl,
	Animated,
}= React;


var {height, width} = Dimensions.get('window');

var createLeft = width - 80;
var createTop = height - 200;

var Bala = React.createClass({

	mixins: [TimerMixin],

	getInitialState: function() {
		return {
			create_animation: new Animated.Value(0),
			animateValueY: new Animated.Value(0),
			isRefreshing: false,
			bala: [],
			isLoadingOld: false,
			loading: true,
			latest: new Date(),
			oldest: new Date(),
		};
	},

	componentDidMount: async function() {

		this.setTimeout(()=>{
		    this.getInitialbala();

	        Animated.timing(
				this.state.create_animation,
				{
					toValue: 100,
					duration: 1000,
				}
			).start();

			Animated.timing(
				this.state.animateValueY,
				{
					toValue: createTop - height ,
					duration: 1000,
				}
			).start();

	    }, 2000);   
		

	},

	getInitialbala: async function(){


		try{
			var posts = await PostAPIS.getPosts({
				query:{
					category:'bala',
					direction: 'older',
					date: new Date(),
				}})

			// console.warn(posts[0].dislike.length)
			if(posts.length > 0){
				var data = posts.map(function(item, i){

				    return {
				      	id: item._id,
				      	updated_at: item.updated_at,
				        like:item.like,
				        dislike: item.dislike,
				        contents: item.body.text,
				    }
			    })

			    this.setState({
					bala: data,
					loading: false,
					oldest: data[data.length - 1].updated_at,
					latest: data[0].updated_at,
				});
			}

			this.setState({
				loading: false,
			});
		}catch(e){
			console.warn(e);
		}

	},

	_goThisPost: function(item){
		Actions.aroundmepost();
	},

	_onRefresh() {

		this.setState({isRefreshing: true});
	    this.setTimeout(() => {
	    	this._getNew();
	
			this.setState({isRefreshing: false});
	    }, 1000);
	},

	_getNew: async function(){
		var posts = await PostAPIS.getPosts({
				query:{
					category:'bala',
					direction: 'newer',
					date: this.state.latest,
				}})

		if(posts.length > 0){
			var data = posts.map(function(item, i){

			    return {
			    	id: item._id,
			      	updated_at: item.updated_at,
			        like:item.like,
			        dislike: item.dislike,
			        contents: item.body.text,
			    }
		    })

		    this.setState({
				latest: data[0].updated_at,
				bala: data.concat(this.state.bala),
			});
		}

	},

	_getOld: function(){
		this.setTimeout(() => {
			this.olds();
	    }, 3000);	    
	},

	olds: async function(){

		var posts = await PostAPIS.getPosts({
					query:{
						category:'bala',
						direction: 'older',
						date: this.state.oldest,
					}})

		if(posts.length > 0){
			var data = posts.map(function(item, i){
			    return {
			      	id: item._id,
			      	updated_at: item.updated_at,
			        like:item.like,
			        dislike: item.dislike,
			        contents: item.body.text,
			    }
		    })

		    this.setState({
				oldest: data[data.length - 1].updated_at,
				bala: this.state.news.concat(bala),
			});
		}

		this.setState({
			isLoadingOld: false, 
		});
	},

	loadmore: function(){
		this.setState({
			isLoadingOld: true, 
		});
		this._getOld();		
	},

	create: function(){
		Actions.createbala();
	},

	_likeOrDislike: async function(boolean, id, i){
		var result = await PostAPIS.likeOrDislike(global.SESSION.user._id, {body:{
			id: id,
			ifLike: boolean,
		}});

		var index1 = this.state.bala[i].like.indexOf(global.SESSION.user._id);
		var index2 = this.state.bala[i].dislike.indexOf(global.SESSION.user._id);

		if(boolean){
			if(index1 < 0 && index2 < 0){
			    this.state.bala[i].like.push(global.SESSION.user._id);
			}
			else if(index2 > -1){
				this.state.bala[i].dislike.splice(index2, 1);
				this.state.bala[i].like.push(global.SESSION.user._id);
			}
			
		}else{
			if(index1 < 0 && index2 < 0){
				this.state.bala[i].dislike.push(global.SESSION.user._id);
			}
			else if(index1 > -1){
				this.state.bala[i].like.splice(index1, 1);
				this.state.bala[i].dislike.push(global.SESSION.user._id);
			}
			
		}

		this.setState({
			bala: this.state.bala,
		});
	},

	render: function() {

		var rotateAnimation = this.state.create_animation.interpolate({
	        inputRange: [0, 100],
	      	outputRange: ['0deg', '720deg']
	    });

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

	    if(this.state.loading){
	      return (
	        <Loading/>
	      )
	    }

		return (
			<View style={{flex:1}}>
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
					        	<TouchableOpacity onPress={()=> this._likeOrDislike(true,item.id, i)}>
					        	{
					        		function(){
					        			if(item.like.indexOf(global.SESSION.user._id) > -1){
					        				return (
									    		<View style={{marginRight: 5}}>
									    			<Icon color='#ff0000' size={20} name="thumb-up"/>
									    		</View>
					        				)
					        			}else{
					        				return (
									    		<View style={{marginRight: 5}}>
									    			<Icon size={20} name="thumb-up"/>
									    		</View>
					        				)
					        			}
					        		}.bind(this).call()
					        	}
					        	</TouchableOpacity>	
					    		<View style={{marginRight: 20}}>
					    			<Text style={{fontSize : 12,color: '#eaeae1',}}> {item.like.length} </Text>
					    		</View>
					    		<TouchableOpacity onPress={()=> this._likeOrDislike(false,item.id, i)}>
						    	{
					        		function(){
					        			if(item.dislike.indexOf(global.SESSION.user._id) > -1){
					        				return (
									    		<View style={{marginRight: 5}}>
									    			<Icon color='#ff0000' size={20} name="thumb-down"/>
									    		</View>
					        				)
					        			}else{
					        				return (
									    		<View style={{marginRight: 5}}>
									    			<Icon size={20} name="thumb-down"/>
									    		</View>
					        				)
					        			}
					        		}.bind(this).call()
					        	}
					    		</TouchableOpacity>
					    		<View style={{marginRight: 20}}>
					    			<Text style={{fontSize : 12,color: '#eaeae1',}}> {item.dislike.length} </Text>
					    		</View>
					    	</View>
				        </View>			
		        </View>
		        ))}
		        {spin}
		        {button}
	      	</ScrollView>
	      	<Animated.View 
		      	style={
		      		[styles.create, 
		      		{transform: 
		      			[	
		      				{translateY: this.state.animateValueY},
		      				{rotate: rotateAnimation},
		      			]
		      		}]}>
		      	<TouchableOpacity onPress={this.create}>
		      		<View style={styles.create2}>
		      			<Icon size={40} name="add" color="#ffffff"/>
		      		</View>
		      	</TouchableOpacity>
	      	</Animated.View>
	      	</View>
    	);
  	}
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#001a33',
  },

  create: {
  	position: 'absolute',
  	width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#99e6ff',
    justifyContent: 'center', 
  	alignItems: 'center',
  	alignSelf: 'center',
    opacity: 0.8,
    left: createLeft,
    top:  height,    
  },

  create2: {
  	flex:1, 
  	justifyContent: 'center', 
  	alignItems: 'center',
  	width:40,
    height: 40,
    borderRadius: 20,
    opacity: 0.95,
    backgroundColor: '#0099cc',
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
