/* 
* @Author: dingxizheng
* @Date:   2016-01-27 19:50:46
* @Last Modified by:   dingxizheng
* @Last Modified time: 2016-02-25 22:56:15
*/

'use strict';

var React       = require('react-native');
var GlobalEvent = require('../GlobalEvent');
var Icon        = require('react-native-vector-icons/MaterialIcons');
// var {Avatar, List, Subheader, Icon, IconToggle} = require('react-native-material-design');
var {Avatar, List, Subheader, IconToggle} = require('react-native-material-design');
var nav = require('../NavbarMixin');
var GCM = require('../gcmdata');

var {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} = React;

var {
	Actions
} = require('react-native-router-flux');


var ActionButtons = React.createClass({

	mixins: [nav],

	getInitialState: function() {
		return {
			buttons: [],
		};
	},

	componentWillMount: async function() {
		var self = this;
		GlobalEvent.trigger('right_buttons_mounted', 
			this.setButtons, 
			function(callback, layoutCallback) { 
				self.onMounted = callback;
				self.onLayout = layoutCallback;
			}.bind(this)
		);

	},

	componentDidMount: function() {
		this.onMounted();

		// GCM.subscribe(this._contactOnMessage);
	},

	// _contactOnMessage(msg){
	// 	console.log("------------------------------",msg)
	// },

	setButtons: function(buttons) {
		this.setState({
			buttons: buttons
		});
	},

	render: function() {
		return (
			<View style={styles.barRightButton} onLayout={this.onLayout}>
			{this.state.buttons.map(function(b, i) {

				return (
					<View key={i}>
			            { function(){ 
			              if (b.icon) {
			              	if(b.notification_count > 0){
								return (
					            	<IconToggle
										color="paperGrey900"
										badge={{ value: b.notification_count }}
										onPress={b.onPress}>
					            		<Icon name={b.icon} style={styles.barButtonIcon} />
					            	</IconToggle>
				            	)
							}else{
								return ( 
									<TouchableOpacity key={i} onPress={b.onPress || console.log } style={styles.barButtonIconWrapper}>
										<Icon name={b.icon} style={styles.barButtonIcon} />
									</TouchableOpacity> )
							}
				            
				          } else{
				          	return (
				          		<TouchableOpacity key={i} onPress={b.onPress || console.log } style={styles.barButtonIconWrapper}>
				          			<Text style={styles.barButtonText}>{b.text}</Text>
				          		</TouchableOpacity> )
				          }
			            }.bind(this).call()}
			        </View>
				);

			}.bind(this))}
			</View>
		);
	}
});

var styles = StyleSheet.create({
	barRightButton: {
		paddingRight: 4,
	    paddingBottom: 6,
	    flexDirection: 'row',
	    justifyContent: 'flex-end',
	    flex: 1
	},
	barButtonIconWrapper: {
		marginTop: 8,
		justifyContent: 'center',
		alignItems: 'center',
		paddingRight: 8,
		paddingLeft: 8,
	},
	barButtonIcon: {
	    color: "#f4cb0d",
	    fontSize: 22,
	    margin: 12,
	},
	barButtonText: {
	    color: "#f4cb0d",
	    fontSize: 17
	}
});

module.exports = ActionButtons;