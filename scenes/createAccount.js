/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var UserAPIS = require('../operations/users');
var {Actions} = require('react-native-router-flux');
var t = require('tcomb-form-native');
var nav = require('../NavbarMixin');

var React = require('react-native');
var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} = React;

var Form = t.form.Form;

Form.stylesheet = require('../styles/form');

//process username/address
var Address = t.refinement(t.String, function(n){
  return n.endsWith('@lakeheadu.ca');
});

Address.getValidationErrorMessage = function(value, path, context){
  if(value){
    return 'please enter a valid Lakehead Address';
  }
  return 'please enter username';
};

var typedPass = "";

//process password
var Password = t.refinement(t.String, function(n){
  
  if(n.length >= 6){
    typedPass = n;
    return true;
  }
  return false;
});

Password.getValidationErrorMessage = function(value, path, context){
  if(value){
    return 'your password need to be at least length of 6';
  }
  return 'please enter password';
};

//process re_password
var Re_password = t.refinement(t.String, function(n){
  if(n === typedPass){
    return true;
  }
  return false;
});

Re_password.getValidationErrorMessage = function(value, path, context){
  if(value){
    return 'passwords do not match';
  }
  return 'please enter password again';
};

var Domain = t.struct({
  username: Address,
  password: Password,
  re_password: Re_password,
});

var options = {
  fields: {   
    password:{
      secureTextEntry:true,
    },
    re_password: {
      label: 'please enter password agian', // <= label for the name field
      secureTextEntry: true
    }
  }
};

var CreateAccount = React.createClass({

  mixins: [nav],
  
  getInitialState: function() {
    return {};
  },

  _onPressCreate: function(){

    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      // console.log(value); // value here is an instance of Person

      var username = value.username.trim();
      var password = value.password.trim();
      var re_password = value.re_password.trim();
      console.log(username+" "+password+" "+re_password);


      //address need to end with @lakeheadu.ca
      UserAPIS.create({
            body:{
              username: username,
              password: password,
            }
          }).then(function (responseData){
            return responseData.json();            
          })
          .then(function (response){
            ToastAndroid.show(response.message, ToastAndroid.LONG);
            Actions.login();
          })
          .catch(function(e) {   
            console.log("error",e);   
          }).done();
    }
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Form
          ref="form"
          type={Domain}
          options={options}
          context={{locale: 'it-IT'}}/>

        <TouchableOpacity onPress={this._onPressCreate} style={styles.button}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>    
      </View>  
    );
  }  
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

  Items :{
    justifyContent: 'center',
    alignItems: 'center',
    
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
})

module.exports = CreateAccount;