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

var contents = {
  method: 'GET',
};

var Important = React.createClass({

  mixins: [nav, TimerMixin],

  getInitialState: function() {
    return {
      important: [],
      msg_list: [],
      loading: false,
      nextPage: "",
    };
  },
  
  componentDidMount: function() {

    this._setupGoogleSignin();
  },

  _setupGoogleSignin: async function() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        scopes: [
          'email', 
          'profile', 
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://mail.google.com/',
          'https://www.googleapis.com/auth/gmail.modify'],
        webClientId: '652447600358-4le58p93fodbb43g38uh02mctihvr9t5.apps.googleusercontent.com',
        offlineAccess: true
      });

      const user = await GoogleSignin.currentUserAsync();
      console.log('user',user);
      this.setState({user});

      this.fecthList(user, "1");
    }
    catch(err) {
      console.log("Play services error", err.code, err.message);
    }
  },

  fecthList: async function(user, nextPage){

    this.setState({
      loading: true,
    });

    try{
      var messageList = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages?access_token='+user.accessToken+'&pageToken='+nextPage+'&maxResults=10', contents)
      messageList = await messageList.json();

      this.setState({
        pageToken: messageList.nextPageToken,
        msg_list: this.state.msg_list.concat(messageList.messages),
      });

      this.fetchListDetails(user);
      // var nextPageToken = messageList.nextPageToken;

      console.log("this.state.msg_list",this.state.msg_list)
      console.log("messageList",messageList)
      // return this.fecthList(user, nextPageToken);
    }catch(e){
      console.warn("err:",e);
    }

    // if(nextPage){
    //   try{
    //     var messageList = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages?access_token='+user.accessToken+'&pageToken='+nextPage+'&maxResults=10', contents)
    //     messageList = await messageList.json();
    //     var nextPageToken = messageList.nextPageToken;

    //     this.setState({
    //       msg_list: this.state.msg_list.concat(messageList.messages),
    //     });

    //     console.log("messageList",messageList)
    //     return this.fecthList(user, nextPageToken);
    //   }catch(e){
    //     console.warn("err:",e);
    //   }
    // }else{
    //   this.fetchListDetails(user);
    //   this.setState({
    //     loading: false,
    //   });
    // }
  },

  fetchListDetails:async function(user){
    var important = [];
    
    try{
      this.state.msg_list.forEach(async function(element, index){

        var message = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages/'+ element.id +'?access_token='+user.accessToken, contents);
        message = await message.json();
        console.log("index: ", message);
        if(message.labelIds){
          for (var i = 0; i < message.labelIds.length; i++) {
          
            if(message.labelIds[1] == 'IMPORTANT'){
              // this.setState({
              //   important: this.state.important.concat(element.id),
              // });
              var details = {
                id: element.id,
                // from: message.payload.headers[15].value,
                subject: "sdfsd",
                // subject: message.payload.headers[18].value,
                snippet: message.snippet,
              }
              important.push(details);
              break;
            }
          }
        }
      }.bind(this));

    }catch(e){
      console.warn("err:",e)
    }finally{
      this.setState({
        important: important,
        loading: false,
      });
    }
  },

  goMessage: function(){

  },

  render() {

    if(this.state.isLoadingOld){
        var spin = <View style={styles.loadmore}>
                <Spinner size={30} type={'CircleFlip'} color={'grey'}/>
              </View>
      }

      if(!this.state.isLoadingOld){
        var button = <View style={styles.loadmore}>
                  <Button text="load more" onPress={this.loadmore}/>
                </View>
      }

    if(this.state.loading){
      return (
        <Loading/>
      )
    }
   
    return (
      <ScrollView style={styles.container}>

        {this.state.important.map((item,i)=>(

        <View style={{borderBottomWidth:0.5, borderBottomColor: "#eeeeee",}}  key={i}>
        <TouchableOpacity onPress={() => this.goMessage()}>
          <List            
            primaryText={item.subject}
            secondaryText={item.snippet}/>
            
        </TouchableOpacity>
        </View>
        ))}
        {spin}
        {button}
      </ScrollView>
    );
  }

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

module.exports = Important;
