var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} = React;

var nav  = require('../NavbarMixin');
var Loading = require('./loading');
var TimerMixin = require('react-timer-mixin');
var {Avatar, List, Subheader, IconToggle, Icon, Button} = require('react-native-material-design');
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';


var CreateMail = React.createClass({

  mixins: [nav, TimerMixin],

  getInitialState: function() {
    return {
      user: null, 
    };
  },

  componentDidMount: function() {
    this.setRightButtons([{
      icon: 'send',
      onPress: this.send,
    }]);

    this._setupGoogleSignin();
  },

  send: async function(){
    var body = {raw: {
                payload: {
                    body: { date: 'PHA-SGk8L1A-' },
                    headers: [{ name: 'to',
                                value: 'sryoliver@gmail.com'},
                              { name: 'from',
                                value: this.state.user.email},
                              { name: 'subject',
                                value: 'Hi'}],
                    mimeType: 'text/plain'
                }
            }};

    var headers = {
        'Content-Type': 'application/json',
    }

    var content = {
      method: 'POST',
      body: body,
      headers:headers,
    }

    var sendResult = await fetch('https://www.googleapis.com/gmail/v1/users/'+this.state.user.email+'/messages/send?access_token='+this.state.user.accessToken, content)
    sendResult = await sendResult.json();
    console.log("sendResult:",sendResult)
  },

  _setupGoogleSignin: async function() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        scopes: [
          'email', 
          'profile', 
          'https://www.googleapis.com/auth/gmail.compose',
          'https://mail.google.com/',
          'https://www.googleapis.com/auth/gmail.modify',
          'https://www.googleapis.com/auth/gmail.send'],
        webClientId: '652447600358-4le58p93fodbb43g38uh02mctihvr9t5.apps.googleusercontent.com',
        offlineAccess: true
      });

      const user = await GoogleSignin.currentUserAsync();
      console.log('user',user);
      if(user == null){
        this._signIn();
      }else{
        this.setState({user});
      }
    }
    catch(err) {
      console.log("Play services error", err.code, err.message);
    }
  },

  _signIn: async function(){
    try{
      var user = await GoogleSignin.signIn();
      console.log('login user,',user);
      this.setState({user: user});

    }catch(e){
      console.warn("WRONG SIGNIN",e)
    }
  },

  render() {

    if(this.state.user){
      return(
        <View style={styles.container}>
        <Text> {this.state.user.email} </Text>
      </View>
      )
    }
 
    return (
      <View style={styles.container}>
        <Text> Hi </Text>
      </View>
    );
  }

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:55,
    backgroundColor: '#F5FCFF',
  },
});

module.exports = CreateMail;
