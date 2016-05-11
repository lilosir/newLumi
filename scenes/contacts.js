'use strict';

var {Actions} = require('react-native-router-flux');
var React = require('react-native');
var nav = require('../NavbarMixin');
// var apis = require('../apis');
// var Loading = require('./loading');
var Reload = require('./reload');
// var MynavigationView = require('./mynavigationView');
// var Friends = require('./friends');
// var Recent = require('./recent');
// var SearchFriends = require('./searchFriends');
// var CustomTabbar = require('./customTabbar').default;
// var TimerMixin = require('react-timer-mixin');
// var {Avatar, List, Subheader, IconToggle, Icon} = require('react-native-material-design');
// var ScrollableTabView = require('react-native-scrollable-tab-view');
var Icon = require('react-native-vector-icons/FontAwesome');

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

  componentDidMount: function(){
    this.setLeftButtons([{
      icon: 'menu',
      // onPress: this.openDrawer,
    }]);

    this.setRightButtons([{
      icon: 'inbox',
      onPress: Actions.pop
    }]);  
  },

  render: function() {
    return (
      <Reload/>
      
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