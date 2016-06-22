/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {Actions} = require('react-native-router-flux');
var UserAPIS = require('../operations/users');
var t = require('tcomb-form-native');
var nav = require('../NavbarMixin');
var apis = require('../apis');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Image,
  AsyncStorage,
} = React;

var Form = t.form.Form;

Form.stylesheet = require('../styles/form');

var Address = t.refinement(t.String, function(n){
  return n.endsWith('@lakeheadu.ca');
});

Address.getValidationErrorMessage = function(value, path, context){
  if(value){
    return 'please enter a valid Lakehead Address';
  }
  return 'please enter username';
};

//process password
var Password = t.refinement(t.String, function(n){
  
  if(n.length >= 6){
    return true;
  }
  return false;
});

Password.getValidationErrorMessage = function(value, path, context){
  if(value){
    return 'your paaword need to be at least length of 6';
  }
  return 'please enter password';
};

var Domain = t.struct({
  username: Address,
  password: Password,
});

var options = {
  fields:{
    password:{
      secureTextEntry:true,
    }
  }  
};

var Login = React.createClass({

  mixins: [nav],

  componentDidMount: function() {
    this.refs.form.getComponent('username').refs.input.focus();
  },

  getInitialState: function() {
    return {
      value:{username:"rsheng1@lakeheadu.ca",password:"123456"}
    };

  },

  _onPressSignUp: function(){
    Actions.createAccount();
  },

  _onPressLogin: async function(){ 
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value willconsole.log( be null
      
      AsyncStorage.setItem("username",value.username);

      try{
        var session = await UserAPIS.login({
            body:{
              username: value.username,
              password: value.password,
            }
          });
        global.SESSION = await session;
        console.log("after login:",global.SESSION);
        
        var user = await UserAPIS.myself(global.SESSION.user._id);
      
        if(user){        
          let avatar = apis.BASE_URL+"/"+user.avatar;
          this.props.getInfo({avatar: avatar, nickname:user.nickname});
        }      

        // Actions.contacts({initialPage: 0});
        // Actions.mycampus({initialPage: 2});
        Actions.mymap();
      }catch(e){
        console.warn("login action error:", e.message);
      }   
    }
    
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Form
          ref="form"
          type={Domain}
          options={options}
          value={this.state.value}/>

        <TouchableOpacity onPress={this._onPressSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={{fontSize:15, marginTop: 5}}> OR </Text>
        
        <TouchableOpacity onPress={this._onPressLogin} style={styles.button}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>      
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 54,
    padding: 20,
    paddingTop: 80,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  address: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40, 
    width: 250, 
  },

  button: {
    alignSelf: 'stretch',
    height: 40,
    borderRadius: 5,
    backgroundColor: '#00437a',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#f4cb0d',
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
});

module.exports = Login;
