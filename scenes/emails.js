var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Dimensions,
} = React;

import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
var {Avatar, List, Subheader, IconToggle, Icon, Button} = require('react-native-material-design');
var {Actions} = require('react-native-router-flux');
var nav  = require('../NavbarMixin');
var TimerMixin = require('react-timer-mixin');
var Loading = require('./loading');
var ScrollableTabView = require('react-native-scrollable-tab-view');
var CustomTabbar = require('./customTabbar').default;
var apis = require('../apis');

var Spinner = require('react-native-spinkit');
var {height, width} = Dimensions.get('window');
var Left = width - 40;
var Top = height - 150;

var contents = {
  method: 'GET',
};

var lables = [
  {
    name: 'IMPORTANT',
    text: 'Important',
  },
  {
    name: 'INBOX',
    text: 'All Inbox Mail',
  },
  {
    name: 'SENT',
    text: 'Sent Mail',
  }
];

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
      currentLable: 'IMPORTANT',
      // important: [],
      // others: [],
      // sent: [],
    };
  },

  componentDidMount: function() {

    this.props.setLockMode("locked-closed");

    this._setupGoogleSignin();


    this.setLeftButtons([{
      icon: 'arrow-back',
      onPress: this.back,
    }]);

    this.setRightButtons([{
      icon: 'create',
      onPress: this.writeEmail,
    }]);

    this.setState({
      loading: true,
      isLoadingOld: true,
    });
  },

  back: function(){
    Actions.mycampus();
  },

  writeEmail: function(){
    // console.warn(this.state.currentLable);
    Actions.createmail();
  },

  fecthList: async function(user){
    try{
      var messageList = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages?access_token='+user.accessToken+'&pageToken='+this.state.nextPageToken+'&maxResults=10&labelIds='+this.state.currentLable, contents)
      messageList = await messageList.json();
      // var nextPageToken = messageList.nextPageToken;

      this.setState({
        msg_list: this.state.msg_list.concat(messageList.messages),
        nextPageToken: messageList.nextPageToken,
      });

      console.log("messageList",messageList)
      this.fetchListDetails(user);
    }catch(e){
      console.warn("err:",e);
    }

  },

  fetchListDetails:async function(user){
    
    var msg =  [];
    var message;
    try{
      for (var i = 0; i < this.state.msg_list.length; i++) {
        var subject = "";
        var from = "";
        var date = '';
        message = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages/'+ this.state.msg_list[i].id +'?access_token='+user.accessToken, contents);
        message = await message.json();
        console.log("message: ", message);

        for (var j = 0; j < message.payload.headers.length; j++) {
          if(message.payload.headers[j].name == 'Subject'){
            subject = message.payload.headers[j].value;
          }
          if(message.payload.headers[j].name == 'From'){

            from = message.payload.headers[j].value.split("<")[0];
            if(from.indexOf("\"") > -1){
              from = from.split("\"")[1];
            }
          }
          if(message.payload.headers[j].name == 'Date'){
            date = message.payload.headers[j].value.split(" ")[1] +" "+ message.payload.headers[j].value.split(" ")[2];
          }
        }
        
        var details = {
          id: message.id,
          from: from,
          subject: subject,
          snippet: message.snippet,
          date:date,
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
        isLoadingOld: false,
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

      if(user == null){
        this._signIn();
      }else{
        this.setState({user});
        this.fecthList(user);
      }
      

      // var messageList = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages?access_token='+user.accessToken, contents)
      // messageList = await messageList.json();
      // console.log("messageList:",messageList);

      // var messageList2 = await fetch('https://www.googleapis.com/gmail/v1/users/'+user.email+'/messages?access_token='+user.accessToken+'&pageToken='+"1", contents)
      // messageList2 = await messageList2.json();
      // console.log("messageList2:",messageList2);
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

      this.fecthList(user);

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
        msg:[],
        loading: false,
        isLoadingOld: false,
        nextPageToken: "",
        currentLable: 'IMPORTANT',
      });
    })
    .done();
  },

  loadmore:async function(){
    this.setState({
      isLoadingOld: true,
    });
    this.fecthList(this.state.user);
    
  },

  goMessage: function(){

  },

  changeLable: function(lable){
    this.setState({
      currentLable: lable, 
      loading: true,
      msg_list: [],
      msg:[],
      isLoadingOld: false,
      nextPageToken: "",
    });
    this.fecthList(this.state.user);
  },

  scrollTo: function(position){
    let innerScrollView = this._scrollView.refs.InnerScrollView;
        let scrollView = this._scrollView.refs.ScrollView;

        requestAnimationFrame(() => {
            innerScrollView.measure((innerScrollViewX, innerScrollViewY, innerScrollViewWidth, innerScrollViewHeight) => {
                scrollView.measure((scrollViewX, scrollViewY, scrollViewWidth, scrollViewHeight) => {
                    var scrollTo = innerScrollViewHeight - scrollViewHeight + innerScrollViewY;

                    if (innerScrollViewHeight < scrollViewHeight) {
                        return;
                    }
                    if(position == 'bottom')
                    // scroll to bottom
                    this._scrollView.scrollTo({y:scrollTo});

                    if(position == 'top')
                    // scroll to top
                    this._scrollView.scrollTo({y:0});
                });
            });
        });
  },

  render() {
    if(this.state.user){
      var user = 
        <View style={styles.currentUser}>
          <View style={{marginLeft: 20, flex:1}}>
          {
            function(){
              if(this.state.user.photo){
                return (
                  <Avatar image={<Image source={{ uri: this.state.user.photo }} />} size={25}/>
                )
              }
              else{
                return (
                  <Avatar image={<Image source={{ uri: apis.BASE_URL+"/images/default_avatar.png", }} />} size={25}/>
                )
              }
            }.bind(this).call()
          }
          </View>
          <Text style={{marginLeft: -15, fontSize: 16, color: 'black', flex:4}}> {this.state.user.email} </Text>
          <TouchableOpacity onPress={this._signOut} style={styles.signOut}>
            <Text style={{color: 'white', fontSize: 13, fontWeight: 'bold'}}> Sign Out </Text>
          </TouchableOpacity>
        </View>
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
        <View style={styles.container}>
        {user}
        {
          function(){
            if(this.state.loading){
              return (
                <Loading/>
              )
            }
            else{
              return(
                <View style={{flex:1}}>

                <ScrollView ref={(component) => this._scrollView = component}>
                  {this.state.msg.map((item,i)=>(

                  <View style={{borderBottomWidth:0.5, borderBottomColor: "#eeeeee",}}  key={i}>
                  <TouchableOpacity onPress={() => this.goMessage()}>
                    <View style={styles.fromAndTime}>
                      <View style={{alignSelf:'flex-start',flex:3}}>
                        <Text numberOfLines={1} style={{color: 'black', marginLeft: 20, fontSize: 16, fontWeight:'bold', }}>{item.from}</Text>
                      </View>
                      <View style={{flex:1}}>
                        <Text style={{color: 'black',alignSelf:'flex-end', marginRight: 10, fontSize: 12, }}>{item.date}</Text>
                      </View>
                    </View>
                    <View style={styles.subject}>
                      <Text style={{color: 'black', fontSize: 13, marginLeft: 20}}>{item.subject}</Text>
                    </View>
                    <View style={styles.snippet}>
                      <Text style={{fontSize: 13, marginLeft: 20}}>{item.snippet}</Text>
                    </View>
                  </TouchableOpacity>
                  </View>
                  ))}
                  {spin}
                  {button}
                </ScrollView>

                <View style={styles.goUp}>
                  <TouchableOpacity onPress={()=>this.scrollTo('top')}>
                    <View style={{flex:1}}>
                      <Icon name="publish" color="#f4cb0d"/>
                    </View>
                  </TouchableOpacity>
                </View>
                </View>
              )
            }
          }.bind(this).call()
        }
          <View style={styles.chooseBar}>
          {
            lables.map((item, i)=>(
            <View key={i} style={{flex:1,}}>
            {
              function(){
                if(this.state.currentLable == item.name){
                  return(
                    <View 
                      style={{
                        backgroundColor:"#f4cb0d",
                        height: 30,
                        justifyContent: 'center', 
                        alignItems: 'center',
                        width: 1/3*width}}>
                      <Text style={{color: 'black'}}> {item.text} </Text>
                    </View>
                  )
                }else{
                  return(
                    <TouchableOpacity 
                      style={{
                        backgroundColor:"#00437a",
                        height: 30,
                        justifyContent: 'center', 
                        alignItems: 'center',
                        width: 1/3*width}}
                      onPress={()=> this.changeLable(item.name)}>
                      <Text style={{color: 'white'}}> {item.text} </Text>
                    </TouchableOpacity>
                  )
                }
              }.bind(this).call()
            }
            </View>
            ))
          }
          </View>
        </View>
      );
    }
   
    if (!this.state.user) {
      return (
        <View style={styles.container2}>
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
  container: {
    flex: 1,
    marginTop: 55,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  container2: {
    flex: 1,
    marginTop: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  currentUser: {
    flexDirection: "row",
    height: 40,
    alignItems: 'center',
    backgroundColor: '#eeeeee',
  },

  signOut: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: 'red',
    alignItems : 'center',
    justifyContent: 'center',
    height: 30,
    marginRight: 10,
  },

  fromAndTime: {
    marginTop:10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  subject:{

  },

  snippet: {
    marginBottom: 10,
  },

  chooseBar: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'row',
    height: 30,
  },

  goUp: {
      position: 'absolute',
      width: 30,
      height: 30,
      backgroundColor: '#00437a',
      justifyContent: 'center', 
      alignItems: 'center',
      alignSelf: 'center',
      opacity: 0.8,
      left: Left,
      top: Top,
  },

  loadmore: {
    justifyContent:'center',
    alignItems: 'center',
    height: 40, 
    backgroundColor:'black',
  },
});

module.exports = Emails;