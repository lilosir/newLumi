'use strict';

var React = require('react-native');
var nav = require('../NavbarMixin');
var {Actions} = require('react-native-router-flux');

var {
	View,
	Text,
} = React;

var Profile = React.createClass({

	mixins: [nav],

	componentDidMount: function(){
	    this.setLeftButtons([{
	      icon: 'menu',
	      onPress: this.openDrawer,
	    }]);

	    this.setRightButtons([{
	      icon: 'inbox',
	      onPress: Actions.pop
	    }]);  
	},

	render: function() {
		return (
			<Text>hi</Text>
		);
	},

});

module.exports = Profile;