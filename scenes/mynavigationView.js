var React = require('react-native');
var {Actions} = require('react-native-router-flux');
var TimerMixin = require('react-timer-mixin');
var nav = require('../NavbarMixin');
var {Avatar, List, Subheader, IconToggle, Icon} = require('react-native-material-design');

var {  
  StyleSheet, 
  TouchableHighlight,
  View,
  Text, 
  ScrollView,
  TouchableOpacity,
} = React;

const routers = [
  {
    name:'Contacts',
    icon: 'group',
    action: function(){      
      this.props.openDrawer(false);
      Actions.contacts({initialPage: 0});
    },
  },
  {
    name:'Around Me',
    icon: 'fiber-new',
    action: function(){
      this.props.openDrawer(false);
      ctions.contacts({initialPage: 0})
    },
  },
  {
    name:'Weather',
    icon: 'cloud',
    action: function(){
      this.props.openDrawer(false);
      Actions.contacts({initialPage: 0})
    },
  },
  {
    name:'Bus Schedule',
    icon: 'directions-bus',
    action: function(){
      this.props.openDrawer(false);
      Actions.contacts({initialPage: 0})
    },
  },
  {
    name:'Map',
    icon: 'map',
    action: function(){Actions.contacts({initialPage: 0})},
  },
  {
    name:'Me',
    icon: 'person',
    action: function(){
      this.props.openDrawer(false);
      Actions.me()
    },
  },
];

var mynavigationView = React.createClass({
  mixins: [TimerMixin,nav],

  goContacts: function(){
    // Actions.contacts();
  },

  render: function() {
    return (
      <View>
        <ScrollView style={styles.container}>
            {routers.map((item,i)=>(

            <View style={{borderBottomWidth:0.5, borderBottomColor: "#eeeeee",}}  key={i}>
              <TouchableOpacity onPress={item.action.bind(this)}>
                <List            
                  primaryText={item.name}
                  primaryColor={'#00437a'}
                  leftIcon = {
                    <Icon style={{marginTop: 10}} 
                          name={item.icon}
                          color={'#00437a'}/>
                  }/>
              </TouchableOpacity>
            </View>
            ))}
        </ScrollView>
      </View>
    )
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

module.exports = mynavigationView;