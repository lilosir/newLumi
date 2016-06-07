'use strict';

var React = require('react-native');
var nav = require('../NavbarMixin');
var {Actions} = require('react-native-router-flux');
var {Avatar, List, Subheader, IconToggle, Icon} = require('react-native-material-design');
var apis = require('../apis');
var UserAPIS = require('../operations/users');

var {
	View,
	Text,
	StyleSheet, 
	Image,
	Dimensions,
	ScrollView,
} = React;

var {height, width} = Dimensions.get('window');

var AroundMePost = React.createClass({

	mixins: [nav],

	getInitialState: function() {
		return {
			subject: null,
			contents: null,
			nickname: null,
			avatar: null,
			image: null,
			comments:[],
		};
	},

	componentDidMount: function() {
		this.setLeftButtons([{
	      icon: 'navigate-before',
	      onPress: Actions.pop
	    }]);

	    this.setTitleView(" ");

	    this.setState({
			subject:'This is the 1 post, I feel really good!!!I feel really good!!!I feel really good!!!',
			contents: 'Likewise, Android also supports custom extensions, the methods are just slightly different. \n\nTo create a simple module in Android, create a new class that extends the ReactContextBaseJavaModule class, and annotate the function that you want to make available to JavaScript with @ReactMethod. Additionally, the class itself must be registered in the ReactPackage of your React Native application.',
			nickname: "Daibi",
			avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
			image: apis.BASE_URL + '/' + 'images/react.png',
		});

		this.setState({
			comments: this.getInitialComments(),
		});

	},

	getInitialComments: function(){
		return [
			{	
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "kk",
				text:'good!',
			},
			{	
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "12312",
				text:'wow!',
			},
			{	
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "OL",
				text:'goodsdfsdfttttttttttiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiisdfsdfttttttttttiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii',
			},
			{	
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "123",
				text:'sdfsdfttttttttttiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii!',
			},
		];
	},

	render: function() {
		return (
			<ScrollView style={styles.container}>
				<View style={styles.title}>
					<Text style={styles.titleText}> {this.state.subject} </Text>
				</View>
				<View style={styles.author}>
					<View>
	    				<Avatar image={<Image source={{ uri: this.state.avatar }} />} size={30}/>
	    			</View>
	    			<View style={{marginLeft: 10}}>
	    				<Text> {this.state.nickname}</Text>
	    			</View>
				</View>
				<View style={styles.contents}>
    				<Text style={styles.contentsText}> {this.state.contents} </Text>
	    		</View>
	    		<View style={styles.imageContainer}>
	    			<Image 
		    			style={styles.image}
		    			source={{uri: this.state.image}}/>
		    	</View>

		    	<View style={styles.commentbar}>
		    		<View style={{marginRight: 40}}>
		    			<Icon size={20} name="thumb-up"/>
		    		</View>
		    		<View style={{marginRight: 20}}>
		    			<Icon size={20} name="textsms"/>
		    		</View>
		    	</View>

		    	<View style={styles.commentsText}>
		    		<View style={{marginLeft: 10}}>
			    		<Text style={{color: 'black', fontSize: 16}}> 122 comments </Text>
			    	</View>
		    	</View>

		    	{this.state.comments.map((item,i)=>(
        		<View style={{flexDirection: 'row', borderBottomWidth:0.5, borderBottomColor: "#dddddd",}} key={i}>
        			<View style={{flex: 1, alignItems: 'center', marginTop: 5}}>
		        		<Avatar image={<Image source={{ uri: item.avatar }} />} size={35}/>
		        	</View>
		        	<View style={{flex: 4, flexDirection:'column', justifyContent:'center'}}>
		        		<View style={{marginTop: 5, height: 18}}>
		        			<Text style={{fontSize: 14, color: 'black',fontWeight: 'bold',}}> {item.nickname} </Text>
		        		</View>
		        		<View style={{marginTop: 5, marginRight: 10, marginBottom: 10}}>
		        			<Text style={{fontSize: 14, color: 'black'}}> {item.text} </Text>
		        		</View>
		        	</View>
		        </View>			
		        ))}
			</ScrollView>
		);
	}

});

var styles = StyleSheet.create({
	container:{
		marginTop: 55,
		backgroundColor: '#f5f5ef'
	},

	title: {
		margin:10,
	},

	titleText: {
		fontWeight: '100',
	  	fontSize: 26,
	  	color: 'black',
	},

	author: {
		margin: 10,
		flexDirection: 'row'
	},

	contents: {
		margin: 10,
		alignItems: 'stretch',
	},

	contentsText: {
		color: 'black',
		lineHeight: 20,
	},

	imageContainer: {
		margin: 10,
	},

	image: {
		// width: 300,
		height: 200,
	    backgroundColor: 'transparent',
  	},

  	commentbar: {
  		flexDirection: 'row',
  		height: 30,
		justifyContent: 'center',
		alignSelf : 'flex-end',
  	},

  	commentsText: {
  		height: 40,
  		justifyContent: 'center',
  		borderTopWidth:2, 
		borderTopColor: "#eeeeee",
		borderBottomWidth:2,
	    borderBottomColor: "#eeeeee",
  	},

});

module.exports = AroundMePost;