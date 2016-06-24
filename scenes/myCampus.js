'use strict';

var {Actions} = require('react-native-router-flux');
var React = require('react-native');
var nav = require('../NavbarMixin');
var apis = require('../apis');
// var Loading = require('./loading');
var Reload = require('./reload');
var Friends = require('./friends');

var SearchFriends = require('./searchFriends');
var AroundMe = require('./aroundme');
var Bala = require('./bala');
var Market = require('./market');

var Notifications = require('./notifications');

var CustomTabbar = require('./customTabbar').default;
var {Avatar, List, Subheader, Card, Icon, TYPO, COLOR} = require('react-native-material-design');

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

const items =[
    {
      title:"Course Timetable",
      describe:"Campany the days on campus",
      name:'grid-on',
      color:"#ff751a",
      action: ()=>{
        Actions.coursetable();
      }
      
    },
    {
      title:"Notes",
      describe:"Taking notes is a good habit",
      name:'create',
      color:"#0066ff",
      action: function(){
        Actions.notes();
      }
    },
    {
      title:"My Emails",
      describe:"Check your Emails here",
      name:'mail-outline',
      color:"#990099",
      action: function(){
        console.warn("emails")
      }
    },
    {
      title:"Q & A",
      describe:"Meet problems on study? Come here!",
      name:'lightbulb-outline',
      color:"#ffff00",
      action: function(){
        console.warn("Q & A")
      }
    },
    {
      title:"Contact LU",
      describe:"We will help you",
      name:'phone',
      color:"#339966",
      action: function(){
        console.warn("Numbers")
      }
    },
];

var MyCampus = React.createClass({

  mixins: [nav],

  getInitialState: function() {
    return {
      notification_count: 0,
    };
  },



  openDrawer: function(){
    this.props.openDrawer(true);
  },

  componentDidMount: async function(){

    this.setState({
      notification_count: 0,
    });

    this.props.setLockMode("unlocked");

    this.setLeftButtons([{
      icon: 'menu',
      onPress: this.openDrawer,
    }]);

    this._getInitialNotificationNumber(); 
    
    GCM.subscribe(this._aroundmeOnMessage);
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
      }

      this.setState({
        notification_count: this.state.notification_count + count,
      });

      this.setRightButtons([{
        icon: 'inbox',
        notification_count: this.state.notification_count,
        onPress: this.goNotificaitons,
      }]);  
      
    }catch(e){
      console.warn("err: ",e);
    }

  },

  goNotificaitons(){
    Actions.notifications();
  },

  _aroundmeOnMessage(msg){
    // console.log('-----------------------',msg);
    var count = 0;
    for (var i = 0; i < GCM.messages.length; i++) {
      if(GCM.messages[i].key3 === 'addFriendRequest' && GCM.messages[i].key4 === 'unread'
          && GCM.messages[i].key2 === global.SESSION.user._id){
          count++;
        }
    }

    this.setState({
      notification_count: this.state.notification_count + count,
    });

    this.setRightButtons([{
      icon: 'inbox',
      notification_count: this.state.notification_count,
      onPress: Actions.pop
    }]);

    // Actions.contacts({initialPage: 1});
  },

  render: function() {
    // console.log('inital page:',this.props.initialPage);
    return (
      <View style={styles.container}>
        {
          items.map((item, i)=>(
            <View style={styles.item} key={i}>
              <TouchableOpacity onPress={item.action.bind(this)}>
                <List            
                  primaryText={item.title}
                  secondaryText={item.describe}
                  leftAvatar={<Icon color={item.color} size={40} name={item.name}/>}/>
              </TouchableOpacity>
            </View>
          ))
        }
      </View>
    )        
  },

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 55,
    backgroundColor: '#f5f5f0',
  },

  item: {
    backgroundColor:"#ffffff",
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    height: 80,
    borderWidth:1, 
    borderColor: "#eeeeee",
    justifyContent: 'center',
  },
});

module.exports = MyCampus;