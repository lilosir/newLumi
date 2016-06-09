'use strict';


// REACT  
var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  Component,
  Navigator,
  TouchableOpacity,
  ScrollView,
} = React;


// STYLES
var styles = StyleSheet.create({
  container: {
    flex: 1,
    //垂直居中
    // justifyContent: 'center',
    //水平居中
    marginTop: 60,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },

  list: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
 
  row: {  
      backgroundColor: 'red',
      margin: 3,
      width: 100,
      height: 100,
  },
 
  title: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 22
  },
 
});
 
var Market = React.createClass({
 
  getInitialState: function(){
    return {
      rows: ['row 1', 'row 2', 'row 3', 'row 4', 'row 5', 'row 6','row 7', 'row 8', 'row 9', 'row 10', 'row 11', 'row 12','row 13', 'row 14', 'row 15', 'row 16', 'row 17', 'row 18','row 19', 'row 20', 'row 21', 'row 22', 'row 23', 'row 24']
    };
  },
 
  render: function() {
    var rowViews = this.state.rows.map(function(r, i){
      return (
        <View key={i} style={styles.row}></View>
      );
    });
    return (
      <View style={styles.container}>
      <View>
        <Text>Hi</Text>
      </View>
        <View style={styles.list}>
          {rowViews}
        </View>
      </View>
    );
  }
 
});

module.exports = Market;