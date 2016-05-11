'use strict';

var {Actions} = require('react-native-router-flux');
var React = require('react-native');
var SessionAPIS = require('../operations/sessions');
var  TimerMixin = require('react-timer-mixin');
var nav  = require('../NavbarMixin');


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
  InteractionManager,
} = React;

var Initial = React.createClass({

  mixins: [TimerMixin, nav],

  getInitialState: function(){
    return {username:null,serverTime:0, localTime:0};
  },

  componentWillMount: function(){
 

  },

  componentDidMount: function(){
    // AsyncStorage.removeItem("username");
    
    // this.setLeftButtons([{
    //   icon: 'close',
    //   onPress: Actions.pop
    // }]);

    // this.setRightButtons([{
    //   icon: 'close',
    //   onPress: Actions.pop
    // }]);

    // this.setTitleView("string" || <View>);

    // InteractionManager.runAfterInteractions(() => {
      this.checkStatus();
    // });
  },

  checkStatus: function(){

    console.log("initial");
    this.setTimeout(
      async function(){ 
        var username = await this.getUsername();
        console.log("username:",username);
        if(!username){
          return Actions.login();
        }
        else{
          var serverTime = await this.getServerSession(username);  
          console.log("serverTime:",serverTime);
         
          if(serverTime.error.message === "login please!"){
            return Actions.login();
          }       
        }
      }.bind(this),
      3000,
    );
  },

  componentWillUnmount: function() {
  },

  getUsername: async function(){
    try{
      let username = await AsyncStorage.getItem("username");
      if(username !== null){
        console.log("local username:",username);
        return username;
      }else{
        return null;
      }  
    }catch(e){
      console.log("Get local username error:",e);
    }
  },

  getServerSession: async function (username){
    try{
      let session = await SessionAPIS.getExpireTime({
        body:{
          username: username,
        }
      });
      console.log("session:", session);
      // let res = await session;
      global.SESSION = session;
      Actions.contacts();
      return session;
    }catch(e){
      console.log("Get Server Session err:",e);
      return {"error":e}
    }  

  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text>Hello</Text>
        <Image 
        source={require("../img/initial.png")}
        style={{width: 300, height: 300, justifyContent: 'center',alignSelf: 'center',}}/>
      </View>
    )    
  },

});

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
  },
});

module.exports = Initial;