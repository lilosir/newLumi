var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  View,
  TouchableOpacity,
  Text
} = React;

var nav  = require('../NavbarMixin');

var Others = React.createClass({

  mixins: [nav],
  
  componentDidMount: function() {
  },

  render() {
   
    return (
      <View style={styles.container}>
        <Text>{this.props.data}</Text>
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
});

module.exports = Others;
