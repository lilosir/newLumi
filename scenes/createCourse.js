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
var {Actions} = require('react-native-router-flux');

const items = [
  {
    name:'subject',
    value: '',
  },
  {
    name:'instructor',
    value: '',
  },
  {
    name: 'room',
    value: '',
  },
  {
    name:'days',
    value: '',
  },
  {
    name: 'starttime',
    value: '',
  },
  {
    name: 'endtime',
    value: '',
  }
];
var createCourse = React.createClass({

  mixins: [nav],

  // getInitialState: function() {
  //   return {
  //     subject: null,
  //     instructor: null,
  //     room: null,
  //     starttime: null,
  //     endtime: null,
  //   };
  // },
  
  componentDidMount: function() {

    this.setRightButtons([{
      text: 'Save',
      onPress: this.send,
    }]);
  },

  send: async function(){
    this.setState({
      items: items,
    });
    
    if(this.checkIfEmpty()){
      console.log(this.state);
    }
  },

  checkIfEmpty: function(){
    for (var i = 0; i < this.state.items.length; i++) {
      if(i != 1 && this.state.items[i].value ==''){
        ToastAndroid.show(items[i].name + " can not be empty", ToastAndroid.LONG);
        return false;
      }
    }
    return true;
  },

  assignValue: function(text, i){
    items[i].value = text;
  },

  render() {
   
    return (
      <View style={styles.container}>
        {
          items.map((item, i)=>(
            <View style={styles.itemContainer} key={i}>
              <Text style={styles.itemText}> {item.name} </Text>
              {
                function(){
                  if(i == 3){
                    return(
                      <TextInput 
                        underlineColorAndroid='rgba(0,0,0,0)'
                        style={styles.content}
                        placeholder='M,T,W,TH,F, use "," to seperate'
                        onChangeText={(text)=>this.assignValue(text, i)}/> 
                    )
                  }
                  if(i == 4 || i == 5){
                    return (
                      <TextInput 
                        underlineColorAndroid='rgba(0,0,0,0)'
                        style={styles.content}
                        placeholder="10, 11:00, 14:30"
                        onChangeText={(text)=>this.assignValue(text, i)}/> 
                    )
                  }else{
                    return(
                      <TextInput 
                        underlineColorAndroid='rgba(0,0,0,0)'
                        style={styles.content}
                        onChangeText={(text)=>this.assignValue(text, i)}/> 
                    )
                  }
                }.bind(this).call()
              }
              
            </View>
          ))
        }
  		</View>
    );
  }

});

 

 

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 55,
    //垂直居中
    // justifyContent: 'center',
    //水平居中
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  itemContainer: {
    flexDirection: 'row', 
    borderBottomWidth:0.5, 
    borderBottomColor: "#dddddd",
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginBottom: 0,
  },

  itemText: {
    flex: 2,
    fontSize: 16,
    color: 'black',
  },

  content: {
    flex: 5,
    height: 40,
    margin: 10,
    fontSize: 16,
    padding: 4,
    marginRight: 10,
  }
});

module.exports = createCourse;
