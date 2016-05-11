'use strict';

var {Actions} = require('react-native-router-flux');
var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var apis = require('../apis');
var Loading = require('./loading');
var Reload = require('./reload');
var UserAPIS = require('../operations/users');
var {Avatar, List, Subheader, IconToggle, Icon} = require('react-native-material-design');
var TimerMixin = require('react-timer-mixin');
var {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Image,
	TouchableOpacity,
}= React;

var Recent = React.createClass({

	mixins: [TimerMixin],

	getInitialState: function() {
		return {
			recent: [],
			loading: false, 
			reload: false,
		};
	},

	componentDidMount: async function() {

		this.setTimeout(()=>{
	      this.fetchRecent();
	    }, 500);   
	},

	fetchRecent: async function(){
		try{
			var friends_recent = await UserAPIS.getRecent(global.SESSION.user._id);
			friends_recent.reverse();
			friends_recent = friends_recent.map(function(item){
				return {
					username: item.username,
					id: item._id,
					avatar: apis.BASE_URL+"/"+item.avatar,
				}
			})
			
			this.setState({
				recent: friends_recent,
				loading: false,
				reload: false,
			});
		}catch(e){
			console.warn(e);			
		}
	},

	onPress: function(){
	    // Actions.login();   
	    this.setState({
	        reload: false,
	        loading: true,
	    });  

	    this.setTimeout(()=>{
	      this.fetchRecent();
	    }, 500);
	  },

	goChat: function(username, id){
	    var username = username.split("@lakeheadu.ca");
	    Actions.chats({titleName: username[0], id: id});
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

		return (
			<ScrollView style={styles.container}>

		        {this.state.recent.map((item,i)=>(

		        <View style={{borderBottomWidth:0.5, borderBottomColor: "#eeeeee",}}  key={i}>
		        <TouchableOpacity onPress={() => this.goChat(item.username, item.id)}>
		          <List            
		            primaryText={item.username}
		            secondaryText={item.id}
		            leftAvatar={<Avatar image={<Image source={{ uri: item.avatar }} />} />}/>
		        </TouchableOpacity>
		        </View>
		        ))}
	  
	      	</ScrollView>
    	);
  	}
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-start',
    // padding: 20,
    backgroundColor: '#ffffff',
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#ffffff',
  },
});

module.exports = Recent;
