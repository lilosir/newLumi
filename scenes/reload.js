var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  View,
  TouchableOpacity,
  Text
} = React;

var nav  = require('../NavbarMixin');

var Reload = React.createClass({

  mixins: [nav],
  
  componentDidMount: function() {
  },

  render() {
   
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Network Error</Text>
        <TouchableOpacity onPress={this.props.onPress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Reload!</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  button: {
    borderRadius: 5,
    backgroundColor: '#f4cb0d',
    marginTop: 10,
  },

  buttonText: {
    color: '#F5FCFF',
    textAlign: 'center',
  },

  text: {
    color: "#00437a"
  }
});

module.exports = Reload;
