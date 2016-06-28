var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} = React;

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
var {Avatar, List, Subheader, IconToggle, Icon, Button} = require('react-native-material-design');

var nav  = require('../NavbarMixin');
var TimerMixin = require('react-timer-mixin');
var Loading = require('./loading');
var ScrollableTabView = require('react-native-scrollable-tab-view');
var CustomTabbar = require('./customTabbar').default;

var Important = require('./important');
var Others = require('./others');
var Sent = require('./sent');

var contents = {
  method: 'GET',
};

var Emails = React.createClass({

  mixins: [nav, TimerMixin],

  getInitialState: function() {
    return {
      user: null,
      msg_list: [],
      msg:[],
      loading: false,
      isLoadingOld: false,
      nextPageToken: "",
      // important: [],
      // others: [],
      // sent: [],
    };
  },

  componentDidMount: function() {

    this.props.setLockMode("locked-closed");

    this._setupGoogleSignin();

    this.setRightButtons([{
      icon: 'create',
      onPress: this.writeEmail,
    }]);

  },

  writeEmail: function(){
    // console.warn(this.state.important.length);
    // console.warn(this.state.others.length);
    // console.warn(this.state.sent.length);
  },

  fecthList: async function(user){

    this.setState({
      loading: true,
    });

    try{
      var messageList = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages?access_token='+user.accessToken+'&pageToken='+this.state.nextPageToken+'&maxResults=10', contents)
      messageList = await messageList.json();
      // var nextPageToken = messageList.nextPageToken;

      this.setState({
        msg_list: this.state.msg_list.concat(messageList.messages),
        nextPageToken: messageList.nextPageToken,
      });

      console.log("messageList",messageList)
      this.fetchListDetails(user);
      // return this.fecthList(user, nextPageToken);
    }catch(e){
      console.warn("err:",e);
    }

    // if(nextPage){
    //   try{
    //     var messageList = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages?access_token='+user.accessToken+'&pageToken='+nextPage, contents)
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
    console.log(this.state.msg_list)
    console.log(this.state.msg_list.length)
    var msg =  [];
    try{
      for (var i = 0; i < this.state.msg_list.length; i++) {
        var subject = "";
        var from = "";
        var message = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages/'+ this.state.msg_list[i].id +'?access_token='+user.accessToken, contents);
        message = await message.json();
        console.warn("message: ", message);
        // for (var i = 0; i < message.payload.headers.length; i++) {
        //   if(message.payload.headers[i].name == 'Subject'){
        //     subject = message.payload.headers[i].value;
        //   }
        //   if(message.payload.headers[i].name == 'From'){
        //     from = message.payload.headers[i].value;
        //   }
        // }
        
        var details = {
          // id: message.id,
          // from: from,
          // subject: subject,
          // snippet: message.snippet,
          id: 'message.id',
          from: 'from',
          subject: 'subject',
          snippet: 'message.snippet',
        }
        msg.push(details);
        console.log('msg', msg,)
      }
      
      // this.setState({
      //   msg: msg, 
      // });

      console.log("this.state.msg_list.messages",msg)

    }catch(e){
      console.warn("err:",e)
    }finally{
      this.setState({
        loading: false,
        msg: msg, 
      });
    }
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

      this.fecthList(user);

      // var messageList = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages?access_token='+user.accessToken, contents)
      // messageList = await messageList.json();
      // console.log("messageList:",messageList);

      // var messageList2 = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages?access_token='+user.accessToken+'&pageToken='+"1", contents)
      // messageList2 = await messageList2.json();
      // console.log("messageList2:",messageList2);

      // var messageList3 = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages?access_token='+user.accessToken+'&pageToken='+messageList2.nextPageToken, contents)
      // messageList3 = await messageList3.json();
      // console.log("messageList3:",messageList3);

      // var messageList4 = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages?access_token='+user.accessToken+'&pageToken='+messageList3.nextPageToken, contents)
      // messageList4 = await messageList4.json();
      // console.log("messageList4:",messageList4);


      

      // var message = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages/'+ messageList.messages[3].id +'?access_token='+user.accessToken, contents)
      // var message1 = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages/'+ messageList.messages[5].id +'?access_token='+user.accessToken, contents)
      // message = await message.json();
      // message1 = await message1.json();
      // console.log("message:", message);
      // console.log("message1:", message1);
      // console.log("from:", message.payload.headers[15].value);
      // console.log("subject:", message.payload.headers[18].value);
      // console.log("snippet:", message.snippet);


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

      // this.fecthList(user, "1");

      // var messageList = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages?access_token='+user.accessToken, contents)
      // messageList = await messageList.json();
      // console.log("login messageList:",messageList);

      // var message = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages/'+ messageList.messages[0].id +'?access_token='+user.accessToken, contents)
      // message = await message.json();
      // console.log("login first message:", message);
    }catch(e){
      console.warn("WRONG SIGNIN",e)
    }
  },

  _signOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
      this.setState({
        user: null,
        msg_list: [],
      });
    })
    .done();
  },

  loadmore: function(){

  },

  goMessage: function(){

  },

  render() {

    if(this.state.loading){
      return (
        <Loading/>
      )
    }

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

    if (this.state.user) {
      return (
        <ScrollView style={styles.containerView}>

          {this.state.msg.map((item,i)=>(

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
   
    if (!this.state.user) {
      return (
        <View style={styles.container}>
          <GoogleSigninButton
            style={{width: 312, height: 48}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this._signIn}/>
        </View>
      );
    }
    
  }

});

var styles = StyleSheet.create({
  containerView: {
    marginTop: 55,
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  containerview:{
    flex: 1,
    marginTop: 55,
    backgroundColor: '#F5FCFF',
  },

  text: {
    color: "#00437a"
  }
});

module.exports = Emails;

// <View style={styles.container}>
//           <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 20}}>Welcome {this.state.user.name}</Text>
//           <Text>Your email is: {this.state.user.email}</Text>

//           <TouchableOpacity onPress={() => {this._signOut(); }}>
//             <View style={{marginTop: 50}}>
//               <Text>Log out</Text>
//             </View>
//           </TouchableOpacity>
//         </View>

// <Others data={this.state.others} tabLabel='low-priority|Others'/>
          // <Sent data={this.state.sent} tabLabel='send|Sent Mail'/>

