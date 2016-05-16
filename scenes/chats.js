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

    return {
      messages: this._messages,
      isLoadingEarlierMessages: false,
      typingMessage: '',
      allLoaded: false,
    };
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

    this._isMounted = false;
    this._messages = this.getInitialMessages();

    this._isMounted = true;

    setTimeout(() => {
      this.setState({
        typingMessage: 'React-Bot is typing a message...',
      });
    }, 1000); // simulating network

    setTimeout(() => {
      this.setState({
        typingMessage: '',
      });
    }, 3000); // simulating network


    setTimeout(() => {
      this.handleReceive({
        text: 'Hello Awesome Developer',
        name: 'React-Bot',
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'left',
        date: new Date(),
        uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
      });
    }, 3300); // simulating network   
  },

  componentWillUnmount() {
    this._isMounted = false;
  },

  getInitialMessages() {
    return [
      {
        text: 'Are you building a chat app?',
        name: 'React-Bot',
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'left',
        date: new Date(2016, 3, 14, 13, 0),
        uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
      },
      {
        text: "Yes, and I use Gifted Messenger!",
        name: 'Awesome Developer',
        image: null,
        position: 'right',
        date: new Date(2016, 3, 14, 13, 1),
        uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
      },
    ];
  },

  setMessageStatus(uniqueId, status) {
    let messages = [];
    let found = false;

    for (let i = 0; i < this._messages.length; i++) {
      if (this._messages[i].uniqueId === uniqueId) {
        let clone = Object.assign({}, this._messages[i]);
        clone.status = status;
        messages.push(clone);
        found = true;
      } else {
        messages.push(this._messages[i]);
      }
    }

    if (found === true) {
      this.setMessages(messages);
    }
  },

  setMessages(messages) {
    this._messages = messages;

    // append the message
    this.setState({
      messages: messages,
    });
  },

  handleSend(message = {}) {

    // Your logic here
    // Send message.text to your server

    message.uniqueId = Math.round(Math.random() * 10000); // simulating server-side unique id generation
    this.setMessages(this._messages.concat(message));

    // mark the sent message as Seen
    setTimeout(() => {
      this.setMessageStatus(message.uniqueId, 'Seen'); // here you can replace 'Seen' by any string you want
    }, 1000);

    // if you couldn't send the message to your server :
    // this.setMessageStatus(message.uniqueId, 'ErrorButton');
  },

  onLoadEarlierMessages() {

    // display a loader until you retrieve the messages from your server
    this.setState({
      isLoadingEarlierMessages: true,
    });

    // Your logic here
    // Eg: Retrieve old messages from your server

    // IMPORTANT
    // Oldest messages have to be at the begining of the array
    var earlierMessages = [
      {
        text: 'React Native enables you to build world-class application experiences on native platforms using a consistent developer experience based on JavaScript and React. https://github.com/facebook/react-native',
        name: 'React-Bot',
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'left',
        date: new Date(2016, 0, 1, 20, 0),
        uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
      }, {
        text: 'This is a touchable phone number 0606060606 parsed by taskrabbit/react-native-parsed-text',
        name: 'Awesome Developer',
        image: null,
        position: 'right',
        date: new Date(2016, 0, 2, 12, 0),
        uniqueId: Math.round(Math.random() * 10000), // simulating server-side unique id generation
      },
    ];

    setTimeout(() => {
      this.setMessages(earlierMessages.concat(this._messages)); // prepend the earlier messages to your list
      this.setState({
        isLoadingEarlierMessages: false, // hide the loader
        allLoaded: true, // hide the `Load earlier messages` button
      });
    }, 1000); // simulating network

  },

  handleReceive(message = {}) {
    // make sure that your message contains :
    // text, name, image, position: 'left', date, uniqueId
    this.setMessages(this._messages.concat(message));
  },

  onErrorButtonPress(message = {}) {
    // Your logic here
    // re-send the failed message

    // remove the status
    this.setMessageStatus(message.uniqueId, '');
  },

  // will be triggered when the Image of a row is touched
  onImagePress(message = {}) {
    // Your logic here
    // Eg: Navigate to the user profile
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
          messages={this.state.messages}
          handleSend={this.handleSend}
          // onErrorButtonPress={this.onErrorButtonPress}
          maxHeight={Dimensions.get('window').height - navBarHeight - statusBarHeight}
          loadEarlierMessagesButton={!this.state.allLoaded}
          onLoadEarlierMessages={this.onLoadEarlierMessages}

          senderName='Developer'
          senderImage={null}
          onImagePress={this.onImagePress}
          displayNames={true}
          
          isLoadingEarlierMessages={this.state.isLoadingEarlierMessages}

          typingMessage={this.state.typingMessage}/>
      </View>
    )
  },

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 57,
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