var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  Image,
  ScrollView,
  ToastAndroid,
} = React;

var nav  = require('../NavbarMixin');
var {height, width} = Dimensions.get('window');
var {Avatar, List, Subheader, IconToggle, Icon, Button} = require('react-native-material-design');
var ImagePickerManager = require('NativeModules').ImagePickerManager;
var PostAPIS = require('../operations/posts');
var {Actions} = require('react-native-router-flux');

var CreateBala = React.createClass({

  mixins: [nav],

  getInitialState: function() {
    return {
      contentText: '',
      contentHeight: 0,
    };
  },
  
  componentDidMount: function() {

    this.setRightButtons([{
      icon: 'send',
      onPress: this.send,
    }]);
  },

  send: async function(){
    try{
      var post = await PostAPIS.createPost(global.SESSION.user._id, {body:{
        category: "bala",
        subject: "",
        text: this.state.contentText,
        image: [],
        current: 0,
        original: 0,
      }});

      // if(post.message == 'send post successfully!'){
      //   ToastAndroid.show(post.message, ToastAndroid.LONG);
      // }
      if(!post.message){
        ToastAndroid.show('send bala successfully!', ToastAndroid.SHORT);

        Actions.mycircle({initialPage: 3});
      }
      
    }catch(e){
      console.warn(e);
    }
    
  },

  render() {
   
    return (
      <ScrollView style={styles.container}>
          
        <TextInput 
          multiline={true}
          onChange={(event) => {
            this.setState({
              contentText: event.nativeEvent.text,
              contentHeight: event.nativeEvent.contentSize.height,
            });
          }}
          placeholder="Say anything you like, and no one knows who you are!"
          underlineColorAndroid='rgba(0,0,0,0)'
          style={[styles.content, {height: Math.max(40, this.state.contentHeight)}]}/>         
        
      </ScrollView>
    );
  }

});

 

 

var styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginTop: 55,
    //垂直居中
    // justifyContent: 'center',
    //水平居中
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  content: {
    margin: 10,
    fontSize: 14,
    padding: 4,
  },
});

module.exports = CreateBala;

