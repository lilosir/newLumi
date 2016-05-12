'use strict';

var {Actions} = require('react-native-router-flux');
var SessionAPIS = require('../operations/sessions');
var MessagesAPIS = require('../operations/messages');
var UserAPIS = require('../operations/users');
var React = require('react-native');
var nav = require('../NavbarMixin');
var Reload = require('./reload');
var Loading = require('./loading');
var MynavigationView = require('./mynavigationView');
var TimerMixin = require('react-timer-mixin');
var apis = require('../apis');

var {Avatar, List, Subheader, IconToggle, Icon} = require('react-native-material-design');
var GiftedMessenger = require('react-native-gifted-messenger');
var Dimensions = require('Dimensions');

// window.navigator.userAgent = "react-native";
var apis = require('../apis');

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
  Platform,
} = React;

var Chats = React.createClass({

  mixins: [TimerMixin,nav],

  getInitialState: function(){
    return {friends: [], earlierMessages:[], loading:true, reload: false, opendrawer:false};
  },

  componentDidMount: async function(){
    this.setLeftButtons([{
      icon: 'navigate-before',
      onPress: this.goRecent,
    }]);

    this.setRightButtons([{
      icon: 'inbox',
      onPress: Actions.pop
    }]);

    if(this.props.titleName){
      this.setTitleView(this.props.titleName);
    }else{
      this.setTitleView("Chats");
    }

    //Must specifiy 'jsonp: false' since react native doesn't provide the dom
    //and thus wouldn't support creating an iframe/script tag
    // this.socket = io(apis.BASE_URL,{jsonp: false});
    
    var username = global.SESSION.user.username;

    // this.socket.emit('init', username);
    // if(username !== null){
    //   var socketID = username.split("@lakeheadu.ca")[0]; 
    //   this.socket.emit('init', socketID);  
    // }else{
    //   console.warn("no username");
    //   Actions.login();
    // }
        

    // try{

    //   var username = await AsyncStorage.getItem("username");
    //   this.username = username;
    //   // console.warn(username);
    //   // let username = await AsyncStorage.getItem("username");
    //   if(username !== null){
    //     this.from = this.username.split("@lakeheadu.ca")[0]; 
    //     this.socket.emit('init', this.from);       
    //     // console.warn("local username:",from);
    //   }else{
    //     console.warn("no username");
    //     Actions.login();
    //   }  
    // }
    // catch(e){
    //   console.warn("Get local username error:",e);
    //   Actions.login();
    // }
    

    // this.socket.on('chat message', (msg) =>{
      // this.state.messages.push(msg);
      // this.forceUpdate();
      // console.warn(msg);
      // this.handleReceive({text: msg, name: this.props.titleName, image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, position: 'left', date: new Date()});
    //   this._GiftedMessenger.appendMessage({text: msg, name: this.props.titleName, image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, position: 'left', date: new Date()});
    // });

    this.setTimeout(()=>{
      this.setState({ loading: false,reload: false,})
    }, 500);   
   
  },

  getMessages() {
    return [
      { text: 'Are you building a chat app?', 
        name: 'React-Native', 
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, 
        position: 'left', 
        date: new Date(2015, 10, 16, 19, 0)},
      {
        text: "Yes, and I use Gifted Messenger!", 
        name: 'Developer', 
        image: null, 
        position: 'right', 
        date: new Date(2015, 11, 17, 19, 0)
        // If needed, you can add others data (eg: userId, messageId)
      },
    ];
  },

  fetchEarlierMessages: async function(){
    
    try{
      var messages = await MessagesAPIS.getEarlierMessages({query:{from:'rsheng',to:this.props.titleName}});
      
      // retur 
      // messages = JSON.stringify(messages);
      // console.warn(messages);
      return messages;
    }catch(e){
      console.warn("fetch messages wrong")
      this.setState({reload: true});
    }
  },

  onLoadEarlierMessages: async function(oldestMessage = {}, callback = () => {}) {    
    
    //get the earlier messages from server    
    var messages = await this.fetchEarlierMessages();
 
    // newest messages have to be at the begining of the array
    // console.warn('global',global.SESSION);
    // console.warn(apis.BASE_URL+"/"+item.from.avater);
    var earlierMessages = messages.map(function(item){
      var server_from = item.from.username.split("@lakeheadu.ca")[0];

      //check this message from whom
        return {
          text: item.message,
          name: server_from,
          image: {uri: apis.BASE_URL+"/"+item.from.avatar},
          position: server_from === global.SESSION.user.username.split("@lakeheadu.ca")[0] ? 'right' : 'left',
          date: item.created_at,
        }
    })

    setTimeout(() => {
      callback(earlierMessages, false); // when second parameter is true, the "Load earlier messages" button will be hidden      
    }, 1000);
  },
  
  async handleSend(message = {}, rowID = null) {
    // Your logic here
    // Send message.text to your server
    
    var myObject = this._GiftedMessenger.getMessage(rowID);

    this.socket.emit('chat message', {text:myObject.text, from: this.from, to:this.props.titleName});

    // console.warn(JSON.stringify(this._GiftedMessenger.getMessage(rowID)));
    // var myObject = this._GiftedMessenger.getMessage(rowID);
    // for(var propertyName in myObject) {
    //   console.warn(propertyName);
    // }
    this._GiftedMessenger.setMessageStatus('Sent', rowID);
    // this._GiftedMessenger.setMessageStatus('Seen', rowID);
    // this._GiftedMessenger.setMessageStatus('Custom label status', rowID);
    // this._GiftedMessenger.setMessageStatus('ErrorButton', rowID); // => In this case, you need also to set onErrorButtonPress
    
  },

  openDrawer:function() {   
    this.state.opendrawer ? this.refs['DRAWER'].closeDrawer() : this.refs['DRAWER'].openDrawer();
  },

  handleReceive(message = {}) {
    this._GiftedMessenger.appendMessage(message);
  },

  goRecent: function(){
    UserAPIS.updateRecent(global.SESSION.user._id,{
      body:{
        friendID: this.props.id,
      }
    });
    Actions.contacts({initialPage: 0});
  },

  render: function() {
    if(this.state.reload){
      return(
        <Reload onPress={this.onReload}/>
      )
    }

    if(this.state.loading){
      return (
        <Loading/>
      )
    }

    return (
      <View style={styles.container}>
        <GiftedMessenger
          ref={(c) => this._GiftedMessenger = c}
      
          styles={{
            bubbleRight: {
              marginLeft: 70,
              backgroundColor: '#007aff',
            },
          }}
          
          autoFocus={true}
          messages={this.getMessages()}
          handleSend={this.handleSend}
          // onErrorButtonPress={this.onErrorButtonPress}
          maxHeight={Dimensions.get('window').height - navBarHeight - statusBarHeight}
          loadEarlierMessagesButton={true}
          onLoadEarlierMessages={this.onLoadEarlierMessages}

          senderName='Developer'
          senderImage={null}
          autoScroll={false}
          scrollAnimated={true}
          // onImagePress={this.onImagePress}
          displayNames={true}
          
          inverted={true}/>
      </View>
    )
  },

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#ffffff',
  },
});

var navBarHeight = (Platform.OS === 'android' ? 56 : 64);
// warning: height of android statusbar depends of the resolution of the device
// http://stackoverflow.com/questions/3407256/height-of-status-bar-in-android
// @todo check Navigator.NavigationBar.Styles.General.NavBarHeight
var statusBarHeight = (Platform.OS === 'android' ? 25 : 0);

module.exports = Chats;