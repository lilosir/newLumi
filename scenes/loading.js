var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  View,
  TouchableOpacity,
  Text
} = React;

var Spinner = require('react-native-spinkit');

var Loading = React.createClass({

  componentDidMount: function() {
    // this.props.setTitleView;
  },

  getInitialState() {
    return {
      index: 1,
      types: ['CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 'ChasingDots', 'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress', 'FadingCircle', 'FadingCircleAlt', 'Arc', 'ArcAlt'],
      size: 100,
      color: "#f4cb0d",
    }
  },

  render() {
    var type = this.state.types[this.state.index];

    return (
      <View style={styles.container}>
        <Spinner style={styles.spinner} size={this.state.size} type={type} color={this.state.color}/>
        <Text style={styles.text}>Loading</Text>
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

  spinner: {
    marginBottom: 10
  },

  text: {
    color: "#00437a"
  },
});

module.exports = Loading;
