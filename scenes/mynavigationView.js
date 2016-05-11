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
    action: function(){Actions.contacts()},
  },
  {
    name:'Around Me',
    icon: 'fiber-new',
    action: function(){Actions.contacts()},
  },
  {
    name:'Weather',
    icon: 'cloud',
    action: function(){Actions.contacts()},
  },
  {
    name:'Bus Schedule',
    icon: 'directions-bus',
    action: function(){Actions.contacts()},
  },
  {
    name:'Map',
    icon: 'map',
    action: function(){Actions.contacts()},
  },
  {
    name:'Me',
    icon: 'person',
    action: function(){Actions.me()},
  },
];

var mynavigationView = React.createClass({
  mixins: [TimerMixin,nav],

  goContacts: function(){
    // Actions.contacts();
  },

  render: function() {
    return (
      <ScrollView style={styles.container}>
          {routers.map((item,i)=>(

          <View style={{borderBottomWidth:0.5, borderBottomColor: "#eeeeee",}}  key={i}>
            <TouchableOpacity onPress={item.action}>
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
    )
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-start',
    marginTop: 57,
    backgroundColor: '#F5FCFF',
  },
});

module.exports = mynavigationView;
      
    // {routers.map((item,i)=>(

    //     <View style={{borderBottomWidth:0.5, borderBottomColor: "#eeeeee",}}  key={i}>
    //       <TouchableOpacity onPress={item.action}>
    //         <List            
    //           primaryText={item.name}
    //           primaryColor={'#00437a'}
    //           leftIcon = {
    //             <Icon style={{marginTop: 10}} 
    //                   name={item.icon}
    //                   color={'#00437a'}/>
    //           }/>
    //       </TouchableOpacity>
    //     </View>
    //     ))}