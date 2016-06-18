var React = require("react-native");
var {Avatar, List, Subheader, IconToggle, Icon, Button} = require('react-native-material-design');

var{
	Animated,
	View,
	TouchableOpacity,
	StyleSheet,
	Dimensions,
} = React;

var {height, width} = Dimensions.get('window');

var createLeft = width - 80;
var createTop = height - 200;

var createButton = React.createClass({

	getInitialState: function() {
		return {
			create_animation: new Animated.Value(0),
			animateValueY: new Animated.Value(0),
		};
	},

	componentDidMount: async function() {

	  	Animated.timing(
			this.state.create_animation,
			{
				toValue: 100,
				duration: 1000,
			}
		).start();

		Animated.timing(
			this.state.animateValueY,
			{
				toValue: createTop - height ,
				duration: 1000,
			}
		).start();

	},

	render: function() {
		var rotateAnimation = this.state.create_animation.interpolate({
	        inputRange: [0, 100],
	      	outputRange: ['0deg', '720deg']
	    });
		return (
			<Animated.View 
		      	style={
		      		[styles.create, 
		      		{transform: 
		      			[	
		      				{translateY: this.state.animateValueY},
		      				{rotate: rotateAnimation},
		      			]
		      		}]}>
		      	<TouchableOpacity onPress={this.props.OnClick}>
		      		<View style={styles.create2}>
		      			<Icon size={40} name="add" color="#ffffff"/>
		      		</View>
		      	</TouchableOpacity>
	      	</Animated.View>
		);
	}

});

var styles = StyleSheet.create({
	container:{
		marginTop: 55,
	},

	create: {
	  	position: 'absolute',
	  	width: 50,
	    height: 50,
	    borderRadius: 25,
	    backgroundColor: '#99e6ff',
	    justifyContent: 'center', 
	  	alignItems: 'center',
	  	alignSelf: 'center',
	    opacity: 0.8,
	    left: createLeft,
	    top:  height,    
	},

	create2: {
	  	flex:1, 
	  	justifyContent: 'center', 
	  	alignItems: 'center',
	  	width:40,
	    height: 40,
	    borderRadius: 20,
	    opacity: 0.95,
	    backgroundColor: '#0099cc',
	},
});

module.exports = createButton;