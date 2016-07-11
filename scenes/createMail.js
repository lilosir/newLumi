var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
  ToastAndroid,
} = React;

var {Actions} = require('react-native-router-flux');
var nav  = require('../NavbarMixin');
var Loading = require('./loading');
var TimerMixin = require('react-timer-mixin');
var {Avatar, List, Subheader, IconToggle, Icon, Button} = require('react-native-material-design');
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
var Buffer = require('buffer/').Buffer;


var CreateMail = React.createClass({

  mixins: [nav, TimerMixin],

  getInitialState: function() {
    return {
      user: null, 
      to: '',
      subject: '',
      contentText: '',
      contentHeight: 0,
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

    var from = "From: " + "rsheng@lakeheadu.ca";
    var to = "To: "+ this.state.to;
    var subject = "Subject: "+ this.state.subject;
    var content = this.state.contentText;
    var msgId = 'Message-ID: '+ "<123sdfsd4dsfsdf@gmail>";

    var result = from + "\n" + to +"\n"  + msgId + "\n" + subject +"\n" + content;

    console.log(result);

    var ba = new Buffer(result);
    // var ba = new Buffer('From: Renyuan Sheng <rsheng@lakeheadu.ca>\nTo: Oliver Sheng <sryoliver@gmail.com>\nDate: Thu, 29 Jun 2016 20:14:32 +0000\nMessage-ID: <123sdfsd4dsfsdf@gmail>\nSubject: Saying Hello\n\nThis is a message just to say hello. So, "Hello".');
    var s = ba.toString('base64');
    console.log("s",s)
    var body = JSON.stringify({raw: s});

    var headers = {
        'Content-Type': 'application/json',
    }

    var options = {
      method: 'POST',
      body: body,
      headers:headers,
    }

    var sendResult = await fetch('https://www.googleapis.com/gmail/v1/users/'+this.state.user.email+'/messages/send?access_token='+this.state.user.accessToken, options)
    sendResult = await sendResult.json();
    console.log("sendResult:",sendResult)

    if(sendResult.labelIds.length > 0){
      ToastAndroid.show("mail sent successfully", ToastAndroid.SHORT);
      Actions.emails();
    }
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
        <ScrollView style={styles.container}>
          <View style={styles.title}>
            <Text style={{
              alignItems: 'center', 
              marginLeft: 10, 
              justifyContent: 'center', 
              flex: 1,
              fontSize: 16}}> To: </Text>
            <TextInput 
              value={this.state.to}
              onChangeText={(text) => this.setState({to:text})}
              underlineColorAndroid='rgba(0,0,0,0)'
              style={[styles.input, {flex: 8}]}/>
          </View>
          <View style={styles.title}>
            <Text style={{
              alignItems: 'center', 
              marginLeft: 10, 
              justifyContent: 'center', 
              flex: 1,
              fontSize: 16}}> Subject: </Text>
            <TextInput 
              value={this.state.subject}
              onChangeText={(text) => this.setState({subject:text})}
              underlineColorAndroid='rgba(0,0,0,0)'
              style={[styles.input, {flex: 3}]}/>
          </View>
          <TextInput
            multiline={true}
            onChange={(event)=>{
              this.setState({
                contentText: event.nativeEvent.text,
                contentHeight: event.nativeEvent.contentSize.height,
              });
            }}
            underlineColorAndroid='rgba(0,0,0,0)'
            style={{margin: 10, fontSize: 16, height: Math.max(46, this.state.contentHeight+10)}}/>
        </ScrollView>
      )
    }
    else{ 
      return (
        <View style={styles.container}>
          <Text> Hi </Text>
        </View>
      );
    }
    
  }

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:55,
    backgroundColor: '#F5FCFF',
  },

  title:{
    marginTop:10,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  input:{
    width: 200,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: -10,
    marginRight: 10,
    fontSize: 16,
  },
});

module.exports = CreateMail;
