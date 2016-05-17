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
	      icon: 'navigate-before',
	      onPress: Actions.pop,
	    }]);

	    this.setRightButtons([{
	      icon: 'inbox',
	      onPress: Actions.pop
	    }]);  
	},

	render: function() {
		return (
			<View style={{marginTop: 60}}>
				<Text >hi</Text>
			</View>
		);
	}

});

module.exports = Me;