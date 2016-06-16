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
  TouchableWithoutFeedback,
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
      sales: [],
      isLoadingOld: false,
      loading: true,
      latest: new Date(),
      oldest: new Date(),
    };
  },

  componentDidMount: async function() {

    this.setTimeout(()=>{
          this.getSales();

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

  getSales: async function(){

    try{
      var posts = await PostAPIS.getPosts({
        query:{
          category:'market',
          direction: 'older',
          date: new Date(),
        }})

      if(posts.length > 0){

        var data = posts.map(function(item, i){
          var img = [];
          if(item.body.image.length != 0){
            img = item.body.image;
          }

          return {
              id: item._id,
              updated_at: item.updated_at, 
              avatar: apis.BASE_URL+"/"+item.user.avatar,
              nickname: item.user.nickname,
              image: img,
              content: item.body.text,
              current: item.body.current,
              origin: item.body.origin,
          }
        })

      this.setState({
          sales: data,
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
          category:'market',
          direction: 'newer',
          date: this.state.latest,
        }})

    if(posts.length > 0){
      var data = posts.map(function(item, i){
        var img = [];
        if(item.body.image.length != 0){
          img = item.body.image;
        }

          return {
              id: item._id,
              updated_at: item.updated_at,
              avatar: apis.BASE_URL+"/"+item.user.avatar,
              nickname: item.user.nickname,
              image: img,
              content: item.body.text,
          }
        })

        this.setState({
        latest: data[0].updated_at,
        sales: data.concat(this.state.sales),
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
            category:'market',
            direction: 'older',
            date: this.state.oldest,
          }})

    if(posts.length > 0){
      var data = posts.map(function(item, i){
        var img = [];
        if(item.body.image.length != 0){
          img = item.body.image;
        }

          return {
              id: item._id,
              updated_at: item.updated_at,
              avatar: apis.BASE_URL+"/"+item.user.avatar,
              nickname: item.user.nickname,
              image: img,
              content: item.body.text,
          }
        })

        this.setState({
        oldest: data[data.length - 1].updated_at,
        sales: this.state.sales.concat(data),
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

        {this.state.sales.map((item,i)=>(
        <View style={{marginTop:5, marginBottom:5}} key={i}>
          
            <View style={styles.listView}>
            <TouchableWithoutFeedback onPress={()=> this._goThisPost(item.id)} key={i}>
              <View style={styles.avatarAndNickname}>
                <View>
                  <Avatar image={<Image source={{ uri: item.avatar }} />} size={40}/>
                </View>
                <View style={{marginLeft: 10}}>
                  <Text style={{color: '#1a0f00', fontSize: 16}}> {item.nickname}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
              <ScrollView
                horizontal={true}
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                  backgroundColor:"#123123"}}>

                {item.image.map((image,i)=>(
                  <TouchableWithoutFeedback onPress={()=> this._goThisPost(item.id)} key={i}>
                    <View style={styles.image}>
                      <Image style={{width: 100, height: 100}} source={image}/>
                    </View>
                  </TouchableWithoutFeedback>
                ))}
                
              </ScrollView>
              <TouchableWithoutFeedback onPress={()=> this._goThisPost(item.id)}>
              <View style={[styles.price, {flexDirection: 'row'}]}>
                <Text style={styles.current}> $ {item.current} </Text>
                <Text style={styles.origin}> original price: $ {item.origin} </Text>
              </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={()=> this._goThisPost(item.id)}>
              <View style={styles.contents}>
                <Text style={styles.contentsText}> {item.content} </Text>
              </View>
              </TouchableWithoutFeedback>
            </View>    
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
    // flex:1, 
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
    flexDirection: 'column',
    borderBottomWidth:0.5,
    borderBottomColor: "#dddddd",
    borderTopWidth:0.5,
    borderTopColor: "#dddddd",
    backgroundColor: "#ffffff"
  },

  price: {
    alignItems: 'flex-end',
    margin: 10,
  },

  contentsText: {
    color: 'black',
    fontSize: 15,
  },

  current:{
    color: 'red',
    fontSize: 17,
    marginRight: 20,
  },

  origin:{
    textDecorationLine:'underline',
    color: '#c2c2a3',
    fontSize: 14,
  },

  contents:{
    margin:10,
  },

  image: {
    marginRight: 10,
    alignItems: 'center',
  },

  avatarAndNickname: {
    // backgroundColor: "#123123",
    margin:10,
    alignItems: 'center',
    flexDirection: 'row',
  },
});

module.exports = Market;


