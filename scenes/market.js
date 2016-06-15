'use strict';

var {Actions} = require('react-native-router-flux');
var React = require('react-native');
var apis = require('../apis');
var Loading = require('./loading');
var Reload = require('./reload');
var UserAPIS = require('../operations/users');
var {Avatar, List, Subheader, IconToggle, Icon, Button} = require('react-native-material-design');
var TimerMixin = require('react-timer-mixin');
var GCM = require('../gcmdata');
var apis = require('../apis');
var Spinner = require('react-native-spinkit');
var PostAPIS = require('../operations/posts');

var {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Animated,
  TextInput,
}= React;


var {height, width} = Dimensions.get('window');

var createLeft = width - 80;
var createTop = height - 200;

var Market = React.createClass({

  mixins: [TimerMixin],

  getInitialState: function() {
    return {
      create_animation: new Animated.Value(0),
      animateValueY: new Animated.Value(0),
      isRefreshing: false,
      news: [],
      isLoadingOld: false,
      loading: true,
      latest: new Date(),
      oldest: new Date(),
    };
  },

  componentDidMount: async function() {

    this.setTimeout(()=>{
          this.getInitialNews();

          Animated.timing(
        this.state.create_animation,
        {
          toValue: 100,
          duration: 1000,
        }
      ).start();

      Animated.timing(
        this.state.animateValueY,
        {
          toValue: createTop - height ,
          duration: 1000,
        }
      ).start();

      }, 2000); 
  },

  getInitialNews: async function(){

    try{
      var posts = await PostAPIS.getPosts({
        query:{
          category:'publicPost',
          direction: 'older',
          date: new Date(),
        }})

      if(posts.length > 0){

        var data = posts.map(function(item, i){
          var img;
          if(item.body.image.length != 0){
            img = item.body.image[0].uri;
          }

            return {
                id: item._id,
                updated_at: item.updated_at,
                subject: item.body.subject, 
                reply: item.comments.length,
                avatar: apis.BASE_URL+"/"+item.user.avatar,
                nickname: item.user.nickname,
                image: img,
            }
          })

          this.setState({
          news: data,
          loading: false,
          oldest: data[data.length - 1].updated_at,
          latest: data[0].updated_at,
        });

      }
        this.setState({
        loading: false,
      });

    }catch(e){
      console.warn(e);
    }
  },

  _goThisPost: function(id){
    Actions.aroundmepost({id: id});
  },

  _getNew: async function(){
    var posts = await PostAPIS.getPosts({
        query:{
          category:'publicPost',
          direction: 'newer',
          date: this.state.latest,
        }})

    if(posts.length > 0){
      var data = posts.map(function(item, i){
        var img;
        if(item.body.image.length != 0){
          img = item.body.image[0].uri;
        }

          return {
              id: item._id,
              updated_at: item.updated_at,
              subject: item.body.subject, 
              reply: item.comments.length,
              avatar: apis.BASE_URL+"/"+item.user.avatar,
              nickname: item.user.nickname,
              image: img,
          }
        })

        this.setState({
        latest: data[0].updated_at,
        news: data.concat(this.state.news),
      });
    }

  },

  _onRefresh() {
      this.setState({isRefreshing: true});
      this.setTimeout(() => {
        this._getNew();
  
      this.setState({isRefreshing: false});
      }, 1000);

  },

  olds: async function(){

    var posts = await PostAPIS.getPosts({
          query:{
            category:'publicPost',
            direction: 'older',
            date: this.state.oldest,
          }})

    if(posts.length > 0){
      var data = posts.map(function(item, i){
        var img;
        if(item.body.image.length != 0){
          img = item.body.image[0].uri;
        }

          return {
              id: item._id,
              updated_at: item.updated_at,
              subject: item.body.subject, 
              reply: item.comments.length,
              avatar: apis.BASE_URL+"/"+item.user.avatar,
              nickname: item.user.nickname,
              image: img,
          }
        })

        this.setState({
        oldest: data[data.length - 1].updated_at,
        news: this.state.news.concat(data),
      });
    }

    this.setState({
      isLoadingOld: false, 
    });
  },

  _getOld:async function(){

    this.setTimeout(() => {
      this.olds();
      }, 3000);
      
  },

  loadmore: function(){
    this.setState({
      isLoadingOld: true, 
    });
    this._getOld();   
  },

  create: function(){
    Actions.createsale();
  },

  render: function() {

    var rotateAnimation = this.state.create_animation.interpolate({
          inputRange: [0, 100],
          outputRange: ['0deg', '720deg']
      });

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
      <View style={{flex:1}}>
      <View>
        <View style={styles.bg1}>
          <View style={styles.bg2}>
            <TextInput
                style={styles.textInput}
                value={this.state.text}   
                underlineColorAndroid='rgba(0,0,0,0)'     
                placeholder={"Search for item you are interested in..."}/>
          </View>
        </View>
      </View>
      <ScrollView 
        ref={(component) => this._scrollView = component}
        style={styles.container}
        refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                titleColor="#00ff00"
                colors={['#f4cb0d']}
                progressBackgroundColor="#00437a"/>}>

            {this.state.news.map((item,i)=>(
            <View style={{marginTop:5, marginBottom:5}} key={i}>
              <TouchableOpacity onPress={()=> this._goThisPost(item.id)} >
                <View style={styles.listView}>
                  <View style={styles.icons}>
                    <Icon name={"sms"} color="#ff531a" size={20}/>
                    <Text style={styles.reply}> {item.reply} </Text>
                  </View>
                  <View style={styles.contents}>
                    <View style={styles.subjectAndImage}>
                      <View style={styles.subject}>
                        <Text style={styles.subjectText}> {item.subject} </Text>
                      </View>
                      <View style={styles.image}>
                        <Image style={{width: 50, height: 50}} source={{ uri: item.image }}/>
                      </View>
                    </View>
                    <View style={styles.avatarAndNickname}>
                      <View style={{marginLeft: 20}}>
                        <Avatar image={<Image source={{ uri: item.avatar }} />} size={25}/>
                      </View>
                      <View style={{marginLeft: 10}}>
                        <Text style={{color: '#1a0f00'}}> {item.nickname}</Text>
                      </View>
                    </View>
                  </View>
                </View>   
              </TouchableOpacity>   
            </View>
            ))}
            {spin}
            {button}
          </ScrollView>
          <Animated.View 
            style={
              [styles.create, 
              {transform: 
                [ 
                  {translateY: this.state.animateValueY},
                  {rotate: rotateAnimation},
                ]
              }]}>
            <TouchableOpacity onPress={this.create}>
              <View style={styles.create2}>
                <Icon size={40} name="add" color="#ffffff"/>
              </View>
            </TouchableOpacity>
          </Animated.View>
          
          </View>
      );
    }
});

              
var styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f0',
  },

  bg1: {
    backgroundColor: '#f5f5f0',
  },

  bg2: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
  },

  textInput: {
    height: 40, 
    fontSize: 18,
    // borderColor: '#ffffff', 
    padding: 4,
    borderWidth: 0,
  },

  create: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#99e6ff',
    justifyContent: 'center', 
    alignItems: 'center',
    alignSelf: 'center',
    opacity: 0.8,
    left: createLeft,
    top:  height,    
  },

  create2: {
    flex:1, 
    justifyContent: 'center', 
    alignItems: 'center',
    width:40,
    height: 40,
    borderRadius: 20,
    opacity: 0.95,
    backgroundColor: '#0099cc',
  },

  loadmore: {
    justifyContent:'center',
    alignItems: 'center',
    height: 40, 
    backgroundColor:'black',
  },

  listView: {
    flexDirection: 'row',
    borderBottomWidth:0.5,
    borderBottomColor: "#dddddd",
    borderTopWidth:0.5,
    borderTopColor: "#dddddd",
    height: 110,
    backgroundColor: "#ffffff"
  },

  icons: {
    flex: 1,
    alignItems: 'center',
    marginTop: 15,
  },

  reply: {
    fontSize : 10,
    color: '#eaeae1',
  },

  contents: {
    marginTop: 10,
    flexDirection: "column",
    flex: 8,
  },

  subjectAndImage: {
    flex:3,
    // backgroundColor: '#321312',
    flexDirection: 'row',
  },

  subject: {
    marginLeft: 15,
    flex: 5,
  },

  subjectText: {
    fontWeight: '200',
    fontSize: 18,
    color: '#1a0f00',
  },

  image: {
    flex:2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarAndNickname: {
    flex: 2,
    // backgroundColor: "#123123",
    alignItems: 'center',
    flexDirection: 'row',
  },
});

module.exports = Market;
