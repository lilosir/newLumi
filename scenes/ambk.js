'use strict';

var {Actions} = require('react-native-router-flux');
var React = require('react-native');
var apis = require('../apis');
var Loading = require('./loading');
var Reload = require('./reload');
var UserAPIS = require('../operations/users');
var {Avatar, List, Subheader, IconToggle, Icon} = require('react-native-material-design');
var TimerMixin = require('react-timer-mixin');
var GCM = require('../gcmdata');
var apis = require('../apis');

var {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Image,
	TouchableOpacity,
	Dimensions,
	RefreshControl,
	Component,
    PanResponder,
    Animated,
}= React;


var {height, width} = Dimensions.get('window');

var AroundMe = React.createClass({

	mixins: [TimerMixin],

	getInitialState: function() {
		return {
			isRefreshing: false,
			news: [],
			scroll: true,
			pan: new Animated.ValueXY(),   //Step 1
		};
	},

	componentWillMount: function() {
	    this._panResponder = PanResponder.create({
	      onStartShouldSetPanResponder: (evt, gestureState) => true,
	      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
	      onMoveShouldSetPanResponder: (evt, gestureState) => true,
	      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
	      onPanResponderGrant: () => this.setState({scroll: false}),
	      onPanResponderMove: Animated.event([null, {
	      	// dx: this.state.pan.x, 
	      	dy: this.state.pan.y
	      }]),
	      onPanResponderRelease: () => this.setState({scroll: true})
	    })
  },

	componentDidMount: async function() {

		// this.panResponder = PanResponder.create({    //Step 2
	 //        onStartShouldSetPanResponder : () => true,
	 //        onPanResponderMove           : Animated.event([null,{ //Step 3
	 //            dx : this.state.pan.x,
	 //            dy : this.state.pan.y,
	 //        }]),
	 //        onPanResponderRelease        : (e, gesture) => {} //Step 4
	 //    });

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
				subject:'This is the first post',
				reply: 20,
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "Daibi",
				image: apis.BASE_URL + '/' + 'images/react.png',
			},
			{
				subject:'This is the second post',
				reply: 320,
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "Niubi",
				image: apis.BASE_URL + '/' + 'images/react.png',
			},
			{
				subject:'This is the first post',
				reply: 20,
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "Daibi",
				image: apis.BASE_URL + '/' + 'images/react.png',
			},
			{
				subject:'This is the second post',
				reply: 320,
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "Niubi",
				image: apis.BASE_URL + '/' + 'images/react.png',
			},
			{
				subject:'This is the first post',
				reply: 20,
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "Daibi",
				image: apis.BASE_URL + '/' + 'images/react.png',
			},
			{
				subject:'This is the second post',
				reply: 320,
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "Niubi",
				image: apis.BASE_URL + '/' + 'images/react.png',
			},
		]
	},

	_onRefresh() {
	  //   this.setState({isRefreshing: true});
	  //   setTimeout(() => {

	  //   	var newPost = [
	  //   		{
			// 		subject:'New one',
			// 		reply: 310,
			// 		avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
			// 		nickname: "X!!!!!",
			// 		image: apis.BASE_URL + '/' + 'images/react.png',
			// 	},
	  //   	]

	  //   	// newPost = newPost.concat(this.state.news);

	  //   	this.setState({
	  //   		news: newPost.concat(this.state.news),
	  //   	});

			// this.setState({isRefreshing: false});
	  //   }, 3000);
	},

	_getOld: function(){
		setTimeout(() => {

	    	var oldPost = [
	    		{
					subject:'very old one',
					reply: '32K',
					avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
					nickname: "PIS",
					image: apis.BASE_URL + '/' + 'images/react.png',
				},
	    	]

	    	this.setState({
	    		news: this.state.news.concat(oldPost),
	    	});

			this.setState({isRefreshing: false});
	    }, 3000);
	},

	_onscroll: function(event: Object){
		let innerScrollView = this._scrollView.refs.InnerScrollView;
        let scrollView = this._scrollView.refs.ScrollView;
        let mouseY = event.nativeEvent.contentOffset.y;

        requestAnimationFrame(() => {
            innerScrollView.measure((innerScrollViewX, innerScrollViewY, innerScrollViewWidth, innerScrollViewHeight) => {
                scrollView.measure((scrollViewX, scrollViewY, scrollViewWidth, scrollViewHeight) => {
                    var scrollTo = innerScrollViewHeight - scrollViewHeight + innerScrollViewY;

                    if (innerScrollViewHeight < scrollViewHeight) {
                        return;
                    }

                    if(mouseY == scrollTo){
                    	this._getOld();
                    	this._scrollView.scrollTo({y:scrollTo});
                    }
                });
            });
        });

	},


	render: function() {
		if(this.state.reload){
	      return(
	        <Reload onPress={this.onPress}/>
	      )
	    }

	    if(this.state.loading){
	      return (
	        <Loading/>
	      )
	    }


	    // refreshControl={
		   //        <RefreshControl
		   //          refreshing={this.state.isRefreshing}
		   //          onRefresh={this._onRefresh}
		   //          titleColor="#00ff00"
		   //          colors={['#f4cb0d']}
		   //          progressBackgroundColor="#00437a"/>}

		return (
			<View style={styles.container}>
			<ScrollView 
				ref={(component) => this._scrollView = component}
				style={styles.container}
				onScroll={this._onscroll}
				scrollEnable={this.state.scroll}
				
		        >

		        {this.state.news.map((item,i)=>(

		        <Animated.View 
		        	{...this._panResponder.panHandlers} 
		        	style={[this.state.pan.getLayout(), styles.listView]} key={i}>
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
		        </Animated.View>
		        ))}
	  
	      	</ScrollView>
	      	</View>
    	);
  	}
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  topView: {
  	height: 100,
  	backgroundColor: '#F5FCFF',
  },

  listView: {
  	flexDirection: 'row',
    borderBottomWidth:0.5,
    borderBottomColor: "#dddddd",
    height: 110,
    backgroundColor: '#F5FCFF',
  },

  icons: {
  	flex: 1,
  	alignItems: 'center',
  	marginTop: 15,
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
