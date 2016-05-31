'use strict';

var {Actions} = require('react-native-router-flux');
var React = require('react-native');
var nav = require('../NavbarMixin');
var apis = require('../apis');
// var Loading = require('./loading');
var Reload = require('./reload');
var Friends = require('./friends');
var Recent = require('./recent');
var SearchFriends = require('./searchFriends');
var CustomTabbar = require('./customTabbar').default;
// var {Avatar, List, Subheader, IconToggle, Icon} = require('react-native-material-design');
var ScrollableTabView = require('react-native-scrollable-tab-view');
var Icon = require('react-native-vector-icons/FontAwesome');
var UserAPIS = require('../operations/users');
var MessagesAPIS = require('../operations/messages');
var GcmAndroid = require('react-native-gcm-android');
var NotificationAPIS = require('../operations/notifications');

var GCM = require('../gcmdata');

var { 
  AppRegistry, 
  StyleSheet, 
  Text, 
  View, 
  Image,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage,
  ToastAndroid,
  ListView,
  ScrollView,
  InteractionManager,
  DrawerLayoutAndroid,
  navigationView,
} = React;

var Contacts = React.createClass({

  mixins: [nav],

  getInitialState: function() {
    return {
      notification_count: 0,
    };
  },

  openDrawer: function(){
    this.props.openDrawer(true);
  },

  getmyself: async function(){
    try{
      var user = await UserAPIS.myself(global.SESSION.user._id);
      
      if(user){        
        let avatar = apis.BASE_URL+"/"+user.avatar;
        // let name = user.username.split("@lakeheadu.ca")[0];
        this.props.getInfo({avatar: avatar, nickname:user.nickname});
      }      
    }catch(e){
      console.log(e);
    }
  },

  componentDidMount: function(){
    this.props.setLockMode("unlocked");

    this.setLeftButtons([{
      icon: 'menu',
      onPress: this.openDrawer,
    }]);

    this._getInitialNotificationNumber();
    // this.setRightButtons([{
    //   icon: 'inbox',
    //   // notification_count: this._getInitialNotificationNumber(),
    //   notification_count: 0,
    //   onPress: Actions.pop
    // }]);  

    GcmAndroid.addEventListener('register', function(token){
      // console.warn('send gcm token', token);
      try{
          MessagesAPIS.register({
            body:{
              token: token,
              userid: global.SESSION.user._id
            }
          });
      }catch(e){
        console.warn(e)
      }            
    });        
    GcmAndroid.requestPermissions();

    
    GCM.subscribe(this._contactOnMessage);
  },

  _getInitialNotificationNumber: async function(){
    var count = 0;
    try{
      var notifications = await NotificationAPIS.getnotifications(global.SESSION.user._id);

      if(notifications.length > 0){
        for (var i = 0; i < notifications[0].contents.length; i++) {
          if(notifications[0].contents[i].ifread == false){
            count ++;
          }
        }

        this.setState({
          notification_count: count,
        });

        this.setRightButtons([{
          icon: 'inbox',
          notification_count: count,
          onPress: Actions.pop
        }]);  

      }else{
         this.setRightButtons([{
          icon: 'inbox',
          notification_count: 0,
          onPress: Actions.pop
        }]);  
      }
    }catch(e){
      console.warn("err: ",e);
      return 0;
    }

  },

  _contactOnMessage(msg){
    // console.log('-----------------------',msg);
    var counter = 0;
    for (var i = 0; i < GCM.messages.length; i++) {
      if(GCM.messages[i].key3 === 'addFriendRequest' && GCM.messages[i].key4 === 'unread'
          && GCM.messages[i].key2 === global.SESSION.user._id){
          counter++;
        }
    }

    this.setState({
      notification_count: this.state.notification_count+counter,
    });

    this.setRightButtons([{
      icon: 'inbox',
      notification_count: this.state.notification_count,
      onPress: Actions.pop
    }]);
  },

  render: function() {
    // console.log('inital page:',this.props.initialPage);
    return (
      <ScrollableTabView 
        initialPage={this.props.initialPage} 
        tabBarPosition="bottom" 
        style={styles.container}
        tabBarUnderlineColor="#f4cb0d"
        tabBarBackgroundColor="#00437a"
        tabBarActiveTextColor="#f4cb0d"
        tabBarInactiveTextColor="#f4cb0d"
        renderTabBar={() => <CustomTabbar/>}>
        <Recent tabLabel='access-time|Recent'/>
        <Friends tabLabel='group|Friends'/>
        <SearchFriends tabLabel='search|Search'/>
      </ScrollableTabView>
    )        
  },

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-start',
    marginTop: 55,
    // padding: 20,
    backgroundColor: '#ffffff',
  },
});

module.exports = Contacts;