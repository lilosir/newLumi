'use strict';
		
var React = require('react-native');
var NotificationAPIS = require('../operations/notifications');
var {Avatar, List, Subheader, IconToggle, Icon} = require('react-native-material-design');
var apis = require('../apis');
var {Actions} = require('react-native-router-flux');
var UserAPIS = require('../operations/users');
var nav = require('../NavbarMixin');
var GCM = require('../gcmdata');

var { 
  StyleSheet, 
  Text, 
  View, 
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  ToastAndroid,
} = React;

var Notifications = React.createClass({

  mixins: [nav],

	getInitialState: function() {
		return {
			isempty:true,
			notifications: [], 
		};
	},

	componentDidMount: function() {
    this.setLeftButtons([{
      icon: 'navigate-before',
      onPress: this.goContact,
    }]);

		this._getInitialNotification();

    // console.log("before add...........",GCM.getMessages());
	},

  goContact: function(){
    Actions.contacts({initialPage: 1});
  },

	_getInitialNotification: async function(){

    try{
      var notifications = await NotificationAPIS.getnotifications(global.SESSION.user._id);

      if(notifications.length > 0){
      	this.setState({
      		isempty: false,
      	});

        var allnotifications = notifications[0].contents.map(function(item){
          if(!item.ifread){
            return {
              id: item.from._id,
              avatar: apis.BASE_URL+"/"+item.from.avatar,
              nickname: item.from.nickname,
              text: "sent you a friend request",
              ifread: (
                <TouchableOpacity onPress={()=> this.add(item.from._id, item.from.nickname)}>
                    <View style={styles.add}>
                      <Text style={styles.addText}> Add </Text>
                    </View>
                  </TouchableOpacity>
                )
            }
          }else{
            return {
              id: item.from._id,
              avatar: apis.BASE_URL+"/"+item.from.avatar,
              nickname: item.from.nickname,
              text: "sent you a friend request",
              ifread: (
                <View style={{marginRight: 15}}>
                    <Text> Added </Text>
                </View>
                )
            }
          }
        	
        }.bind(this))

        this.setState({
        	notifications: allnotifications,
        });

      }

    }catch(e){
      console.warn("err: ",e);
    }

  },

  checkInfo: function(value){
    Actions.profile({id:value});
  },

  add: async function(id, nickname){
    //GCM message unread => read
    // change database notification unread => read
    try{
      var user = await UserAPIS.addFriend(global.SESSION.user._id, {
        body:{
          id: id,
        }
      })

      if(user.friends){
        if(user.friends.indexOf(id) > -1){
          ToastAndroid.show(nickname+" added", ToastAndroid.SHORT);
        }
      }

      var messages = GCM.getMessages();

      for (var i = 0; i < messages.length; i++) {
        if(messages[i].key3 === 'addFriendRequest' && messages[i].key4 === 'unread'
            && messages[i].key2 === global.SESSION.user._id && messages[i].key1 === id){
            // console.log("--------------",messages[i]);
            messages[i].key4 = 'read';
          }
      }

      var notification = await NotificationAPIS.changeToRead(global.SESSION.user._id, {
        body:{
          classificaiton: 'addFriendRequest',
          id:id,
        }
      });

      // console.log("after add...........",messages);
      Actions.contacts({initialPage: 1});
    }catch(e){
      console.warn("err:",e);
    }
    
  },

	render: function() {

		return (
        <ScrollView style={styles.container}>

            {this.state.notifications.map((item,i)=>(

              <View style={{flexDirection:'row', alignItems: 'center', borderBottomWidth:0.5, borderBottomColor: "#eeeeee",}} key={i} >
                <View  style={{flex:4}}>
                  <List       
                    primaryText={item.nickname}
                    secondaryText={item.text}
                    leftAvatar={
                      <TouchableOpacity onPress={()=> this.checkInfo(item.id)}>
                          <Avatar image={<Image source={{ uri: item.avatar }} />}/>
                      </TouchableOpacity>        
                     }
                  />
                </View>
                {
                  item.ifread
                }
                
                
              </View>
            ))}
    
          </ScrollView>
		);
	}

});	

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: 57,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#ffffff',
  },
  add: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: 'green',
    alignItems : 'center',
    justifyContent: 'center',
    height: 30,
    width: 40,
    marginRight: 10,
  },

  addText: {
    color: "white",
    fontSize: 14,
  },
});	

module.exports = Notifications;	

