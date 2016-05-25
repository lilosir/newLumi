var React = require('react-native');
var {Actions} = require('react-native-router-flux');
var TimerMixin = require('react-timer-mixin');
var nav = require('../NavbarMixin');
var apis = require('../apis');
var {Avatar, List, Subheader, Card, Icon, TYPO, COLOR} = require('react-native-material-design');
var UserAPIS = require('../operations/users');

var {  
  StyleSheet, 
  TouchableHighlight,
  View,
  Text, 
  ScrollView,
  TouchableOpacity,
  Image,
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
      Actions.contacts({initialPage: 0})
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
      Actions.bus()
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

  getInitialState: function() {
    return {
      avatar:null, 
      name:null,
    };
  },

  componentWillReceiveProps: function(){
    
    if(this.props.Info){
      var avatar = this.props.Info.avatar;
      var name = this.props.Info.name;
      this.setState({
        avatar: avatar,
        name: name,
      })      
    }
  },

  componentWillMount: async function() {
    
  },

  render: function() {
    return (
      <View style={styles.container}>
        <View style={{backgroundColor: "#eeeeee", height: 100, alignItems : 'center', flexDirection: 'row'}}>
          <View style={{marginLeft: 15}}>
            <Avatar size={60} image={<Image source={ {uri:this.state.avatar}}/>} />
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={{color:'black'}}>{this.state.name}</Text>
          </View>
        </View>
        <ScrollView>
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