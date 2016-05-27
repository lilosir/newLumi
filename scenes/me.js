'use strict';

var React = require('react-native');
var nav = require('../NavbarMixin');
var {Actions} = require('react-native-router-flux');
var {Avatar, List, Subheader, IconToggle, Icon} = require('react-native-material-design');
var apis = require('../apis');
var UserAPIS = require('../operations/users');

var {
	View,
	Text,
	StyleSheet, 
	Image,
} = React;

var Me = React.createClass({

	mixins: [nav],
	getInitialState: function() {
		return {
			avatar: null,
			nickname: null,
			status:null,
			gender:null,
			birthday:null,
		};
	},

	getmyself: async function(){
	    try{
	      var user = await UserAPIS.myself(global.SESSION.user._id);
	      
	      if(user){        
	        let avatar = apis.BASE_URL+"/"+user.avatar;
	        let birthday = user.birthday.split("T")[0];
	        this.setState({
	        	avatar: avatar, 
	        	username: user.username,
	        	nickname:user.nickname,
	        	status: user.status,
	        	gender: user.gender,
	        	birthday: birthday,});
	      }      
	    }catch(e){
	      console.log(e);
	    }
	},

	openDrawer: function(){
    	this.props.openDrawer(true);
  	},

	componentDidMount: function(){
	    this.setLeftButtons([{
	      icon: 'menu',
	      onPress: this.openDrawer,
	    }]);

	    this.setRightButtons([{
	      text: 'Save',
	      // onPress: Actions.pop
	    }]);  
	    this.getmyself();
	},

	render: function() {
		return (
			<View style={styles.container}>
				<View style={styles.avatar}>
					<Avatar size={80} image={<Image source={ {uri:this.state.avatar}}/>} />
					<Text>{this.state.status}</Text>
				</View>

				<View style={styles.info}>
					<View style={styles.item}>
						<View style={styles.title}>
							<Text style={styles.titleText}> Nickname </Text>
						</View>
						<View style={styles.content}>
							<Text style={styles.contentText}> {this.state.nickname} </Text>
						</View>					
		            </View>
		            <View style={styles.item}>
						<View style={styles.title}>
							<Text style={styles.titleText}> Email </Text>
						</View>
						<View style={styles.content}>
							<Text style={styles.contentText}> {this.state.username} </Text>
						</View>					
		            </View>
		            <View style={styles.item}>
						<View style={styles.title}>
							<Text style={styles.titleText}> Password </Text>
						</View>
						<View style={styles.content}>
							<Text style={styles.contentText}> ********* </Text>
						</View>					
		            </View>

		            <View style={styles.item}>
						<View style={styles.title}>
							<Text style={styles.titleText}> Gender </Text>
						</View>
						<View style={styles.content}>
							<Text style={styles.contentText}> {this.state.gender} </Text>
						</View>					
		            </View>

		            <View style={styles.item}>
						<View style={styles.title}>
							<Text style={styles.titleText}> Birthday </Text>
						</View>
						<View style={styles.content}>
							<Text style={styles.contentText}> {this.state.birthday} </Text>
						</View>					
		            </View>
		        </View>
		        <View style={styles.info}>
		        	<View style={styles.item}>
						<View style={{marginLeft: 15, width: 70,}}>
							<Icon
								size={20}
								name="collections"/>
						</View>
						<View style={{marginLeft: 15,}}>
							<Text style={styles.contentText}> My Posts </Text>
						</View>					
		            </View>

		            <View style={styles.item}>
						<View style={{marginLeft: 15, width: 70,}}>
							<Icon
								size={20}
								name="group"/>
						</View>
						<View style={{marginLeft: 15,}}>
							<Text style={styles.contentText}> My friends </Text>
						</View>					
		            </View>
		        </View>

		        <View style={styles.logout}>
		        	<Text style={styles.logoutText}> Log Out </Text>
		        </View>

			</View>
		);
	}

});

var styles = StyleSheet.create({
	container:{
		flex:1,
		marginTop: 55,
		backgroundColor: '#f5f5ef'
	},

	avatar:{
		marginTop: 10,
		backgroundColor: '#ffffff',
		height: 130,
		justifyContent: 'center',
		alignItems: 'center'
	},

	info: {
		marginTop: 20,
	},

	item:{
		backgroundColor: '#ffffff',
		borderBottomWidth:0.5, 
		borderBottomColor: "#eeeeee",
		flexDirection: 'row',
		height: 30,
		alignItems : 'center'
	},

	title: {
		marginLeft: 10,
		width: 70,
	},

	titleText: {
		fontSize: 14,
	},

	content: {
		marginLeft: 20,
	},

	contentText: {
		color: "#000000",
		fontSize: 14,
	},

	logout: {
		backgroundColor: '#ffffff',
		marginTop: 30,
		alignItems : 'center',
		justifyContent: 'center',
		height: 40,
	},

	logoutText: {
		color: "red",
		fontSize: 16,
	}
});

module.exports = Me;