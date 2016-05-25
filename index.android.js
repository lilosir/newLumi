'use strict';

var {Router, Route, Schema, Animations, TabBar} = require('react-native-router-flux');
var React = require('react-native');

// var Initial = require('./scenes/initial');
var Login = require('./scenes/login');
var CreateAccount = require('./scenes/createAccount');
var Contacts = require('./scenes/contacts');
var Chats = require('./scenes/chats');
var Me = require('./scenes/me');
var Bus = require('./scenes/bus');

// var Loading = require('./scenes/loading');
// var Reload = require('./scenes/reload');
// var Profile = require('./scenes/profile');
// var Me = require('./scenes/me');

var RightButtons  = require('./NavBarParts/RightActionButtons');
var LeftButtons   = require('./NavBarParts/LeftActionButtons');
var BarTitleView  = require('./NavBarParts/BarTitleView');
var MynavigationView = require('./scenes/mynavigationView');

// var GCM = require('./gcm/gcmListeners');

require('./beforeActions');
require('./afterActions');

var GCM = require('./gcmdata');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  DrawerLayoutAndroid,
  Navigator,
  DeviceEventEmitter,
  AsyncStorage,
} = React;

var GcmAndroid = require('react-native-gcm-android');
import Notification from 'react-native-system-notification';

if (GcmAndroid.launchNotification) {
  var notification = GcmAndroid.launchNotification;
  var info = JSON.parse(notification.info);
  Notification.create({
    subject: info.subject,
    message: info.message,
  });
  GcmAndroid.stopService();

} else {

  var renderTitle =  function(navigator, index, state) {
    return  <BarTitleView 
          navigator={navigator}
            index={index}
            state={state}/>;
  };

  var renderRightButton = function(navigator, index, state) {
    let currentReoute = state.routeStack[index];
      return <RightButtons routeName={currentReoute.name}/>;
  };

  var renderLeftButton = function(navigator, index, state) {
    let currentReoute = state.routeStack[index];
    return <LeftButtons routeName={currentReoute.name} 
        navigator={navigator}
        index={index}
        state={state}/>;
  };

  var Lumi = React.createClass({

    getInitialState: function() {
      return {
         drawerLockMode : "locked-closed",
      };
    },

    componentDidMount: function() {

      // GcmAndroid.addEventListener('register', function(token){
      //   console.log('send gcm token to server', token);
      // });
      // GcmAndroid.addEventListener('registerError', function(error){
      //   console.log('registerError', error.message);
      // });
      GcmAndroid.addEventListener('notification', function(notification){
        console.log('receive gcm notification', notification);

        GCM.addMessage(notification.data);
        
        // var info = JSON.parse(notification.data.info);
        // if (!GcmAndroid.isInForeground) {
        //   Notification.create({
        //     subject: info.subject,
        //     message: info.message,
        //   });
        // }
      });

      // DeviceEventEmitter.addListener('sysNotificationClick', function(e) {
      //   console.log('sysNotificationClick', e);
      // });

      GcmAndroid.requestPermissions();
    },

    _setLockMode: function(val) {
      this.setState({
        drawerLockMode: val ||  "locked-closed"
      });
    },

    _openDrawer: function(value){
      if(value){
        this.refs["DRAWER"].openDrawer();
      }else{
        this.refs["DRAWER"].closeDrawer();
      }      
    },

    _getInfo: function(data){
      this.setState({info: data})
    },
    
    render: function() {
      return (
        <DrawerLayoutAndroid
          drawerLockMode={this.state.drawerLockMode}
          drawerWidth={220}
          ref={'DRAWER'}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={() => <MynavigationView openDrawer={this._openDrawer} Info={this.state.info}></MynavigationView>}>
        
          <Router hideNavBar={false} 
              barButtonTextStyle={{
                color: '#f4cb0d'
              }}

              barButtonIconStyle={{
                tintColor: '#f4cb0d'
              }}

              navigationBarStyle={{
                backgroundColor: '#00437a'
              }}

              setLockMode={this._setLockMode}

              openDrawer={this._openDrawer}

              getInfo = {this._getInfo}

              renderTitle={ renderTitle }
              renderLeftButton={ renderLeftButton }
              renderRightButton={ renderRightButton }

              titleStyle = {{color:'#f4cb0d',}}>
            <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
            <Route name="login" component={Login} title="login" schema="modal"/>
            <Route name="createAccount" component={CreateAccount}  title="New Account" schema="modal"/>
            <Route name="contacts" component={Contacts}  title="Contacts"/>
            <Route name="chats" component={Chats}  title="Chats"/>
            <Route name="me" component={Me}  title="Me"/>
            <Route name="bus" initial={true} component={Bus}  title="Bus"/>
          </Router>
        </DrawerLayoutAndroid>
        
      );
    }
  });

  var styles = StyleSheet.create({
    
  });

  AppRegistry.registerComponent('Lumi', () => Lumi);

}



