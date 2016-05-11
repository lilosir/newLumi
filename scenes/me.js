'use strict';

var React = require('react-native');
var nav = require('../NavbarMixin');
var {Actions} = require('react-native-router-flux');
var {Avatar, List, Subheader, IconToggle, Icon} = require('react-native-material-design');

var {
	View,
	Text,
} = React;

var Me = React.createClass({

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
	}

});

module.exports = Me;