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
	Picker,
	TextInput,
} = React;

var Bus = React.createClass({

	mixins: [nav],

	componentDidMount: function(){
	    this.setLeftButtons([{
	      icon: 'navigate-before',
	      onPress: Actions.pop,
	    }]);

	    this.setRightButtons([{
	      icon: 'cached',
	      // onPress: Actions.pop
	    }]);
	},

	render: function() {
		return (
			<View style={styles.container}>
				<View style={styles.select}>
					<Text style={styles.selectText}>Select your stop</Text>
					<View style={styles.textInputOut}>
						<TextInput
						    style={styles.textInput}		    
						    placeholder={"stop number or name"}
						    underlineColorAndroid={"#ffffff"}/>
					</View>
				</View>

			</View>
		);
	}

});

var styles = StyleSheet.create({
	container:{
		flex:1,
		marginTop: 55,
	},

	select:{
		backgroundColor: '#ffffff',
		height: 130,
		alignItems: 'center',
		marginTop: 20,
	},

	selectText: {
		color: "#333333",
		fontSize: 18,
	},

	textInputOut:{
		height: 40,
		width: 300,
		borderLeftWidth: 1, 
		borderRightWidth: 1, 
		borderTopWidth: 1, 
		borderBottomWidth: 1, 
		borderBottomColor: '#00437a',
	},

	textInput: {
		height: 45, 
		fontSize: 18,
		// borderColor: '#ffffff', 
		borderWidth: 1,
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

module.exports = Bus;