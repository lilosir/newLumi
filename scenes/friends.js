'use strict';

var {Actions} = require('react-native-router-flux');
var SessionAPIS = require('../operations/sessions');
var UserAPIS = require('../operations/users');
var React = require('react-native');
var nav = require('../NavbarMixin');
var apis = require('../apis');
var Loading = require('./loading');
var Reload = require('./reload');
var MynavigationView = require('./mynavigationView');

var TimerMixin = require('react-timer-mixin');
var {Avatar, List, Subheader, IconToggle, Icon} = require('react-native-material-design');

var { 
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

var Friends = React.createClass({

  mixins: [TimerMixin,nav],

  getInitialState: function(){
    return {friends: [], loading: true, reload: false,};
  },

  openDrawer:function() {
    // if(this.state.opendrawer){
    //   this.refs['DRAWER'].closeDrawer();
    // }else{
    //   this.refs['DRAWER'].openDrawer();
    // }    
    this.state.opendrawer ? this.refs['DRAWER'].closeDrawer() : this.refs['DRAWER'].openDrawer();
  },

  componentDidMount: async function(){
    // console.log("contacts global.SESSION:",global.SESSION);

    // InteractionManager.runAfterInteractions(() => {
    //   this.fetchFriends();
    // });
  
    this.setTimeout(()=>{
      this.fetchFriends();
    }, 500);   
    
  },

  fetchFriends: async function(){
    try{
      var friends = await UserAPIS.getFriends(global.SESSION.user._id);

      // console.log("user's friends",friends);

      var fri = friends.map(function(item) {
        console.log("----------------------",item.nickname)
        return {"nickname":item.nickname, "status":item.status, "id":item._id, "avatar":apis.BASE_URL+"/"+item.avatar}});

      fri.sort(function(a,b){
        if(a.nickname > b.nickname) return 1;
        if(a.nickname < b.nickname) return -1;
        return 0;
      });

      this.setState({
        friends: fri,
        loading: false,
        reload: false,
      });
    }catch(e){
      console.warn(e);
      console.warn("here");
      this.setState({reload: true});
    }
    
  },

  onPress: function(){
    // Actions.login();   
    this.setState({
        reload: false,
        loading: true,
      });  

    this.setTimeout(()=>{
      this.fetchFriends();
    }, 500);
  },

  goContacts: function(){
    Actions.contacts();
  },

  render: function() {

    if(this.state.reload){
      return(
        <Reload onPress={this.onPress}/>
      )
    }

    if(this.state.loading){
      return (
        <Loading/>
      )
    }

    if(this.state.friends.length < 1){
      return(
        <View style={{flex :1, justifyContent: 'center', alignItems: 'center',}}>
          <Text style={{fontSize: 20, textAlign: 'center', color:'black'}}> Sorry, you do not have any friends</Text>
        </View>
      )
    }
    
    return (
      <ScrollView style={styles.container}>

        {this.state.friends.map((item,i)=>(

        <View style={{borderBottomWidth:0.5, borderBottomColor: "#eeeeee",}}  key={i}>
          <TouchableOpacity onPress={() => this.goChat(item.nickname, item.id)}>
            <List            
              primaryText={item.nickname}
              secondaryText={item.status}
              leftAvatar={<Avatar image={<Image source={{ uri: item.avatar }} />} />}/>
          </TouchableOpacity>
        </View>
        ))}
  
      </ScrollView>
      
    )        
  },

  goChat: function(nickname, id){
    Actions.chats({titleName: nickname, id: id});
  },

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-start',
    // padding: 20,
    backgroundColor: '#ffffff',
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#ffffff',
  },
});

module.exports = Friends;
