'use strict';

var React = require('react-native');
var nav = require('../NavbarMixin');
var {Actions} = require('react-native-router-flux');
var {Avatar, List, Subheader, IconToggle, Icon} = require('react-native-material-design');
var apis = require('../apis');
var UserAPIS = require('../operations/users');
var Spinner = require('react-native-spinkit');
var TimerMixin = require('react-timer-mixin');

var {
	View,
	Text,
	StyleSheet, 
	Image,
	Picker,
	TextInput,
} = React;

var payload = {fromStopAreaName: "1222", toStopAreaName: "", lineId: 0, directionId: 0};

var headers = {
    'Accept':'application/json, text/javascript, */*; q=0.01',
	'Accept-Encoding':'gzip, deflate',
	'Accept-Language':'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4',
	'Connection':'keep-alive',
	'Content-Length':74,
	'Content-Type':'application/json; charset=UTF-8',
	'Cookie':'lang=en',
	'Host':'www.nextlift.ca',
	'Origin':'http://www.nextlift.ca',
	'Referer':'http://www.nextlift.ca/',
	'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
	'X-Requested-With':'XMLHttpRequest',
};

var body = JSON.stringify(payload);

var contents = {
  method: 'POST', 
  headers: headers,
  body:body,
};

var Bus = React.createClass({

	mixins: [nav, TimerMixin],
	getInitialState: function() {
		return {
			isLoading: false,
			busInfo: [],
			index: 0,
		    types: ['CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 'ChasingDots', 'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress', 'FadingCircle', 'FadingCircleAlt', 'Arc', 'ArcAlt'],
		    size: 30,
		    color: "#00437a",
		};
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
	      icon: 'cached',
	      onPress: this.fetchBus,
	    }]);

        this.fetchBus();
        this.setInterval(()=>{
        	this.fetchBus();
        }, 15000);
	},

	fetchBus:async function(){
		this.setState({isLoading: true});
		this.setTime
		fetch('http://www.nextlift.ca/AutoComplete.asmx/GetCalls', contents)
		  	.then(function (res){
				return res.json();
			})
			.then(function (json){
				this.setState({busInfo: json.d.Calls});
				this.setTimeout(()=>{
					this.setState({isLoading: false});
				},1000);
				
			}.bind(this))
			.catch(function(err){
		    	console.log('err',err);
		  	})
	},

	render: function() {
		var type = this.state.types[this.state.index];

		if(this.state.isLoading){
			var spin = <Spinner size={this.state.size} type={type} color={this.state.color}/>
		}
		return (
			<View style={styles.container}>
				<View style={styles.location}>
					<Text style={styles.textFetures}>Lakehead University(1222)</Text>
					<View style={styles.spinner}>
						{spin}
					</View>
				</View>
				<View style={styles.items}>
					<View style={styles.route}>
						<Text style={styles.textFetures}>Route</Text>
					</View>
					<View style={styles.direction}>
						<Text style={styles.textFetures}>Direction</Text>
					</View>
					<View style={styles.next}>
						<Text style={styles.nextFetures}>Next</Text>
					</View>
				</View>

				{this.state.busInfo.map((item,i)=>(
		        <View style={styles.items2} key={i}>
		        	<View style={styles.route2}>
		          		<Text style={styles.textFetures2}>{item.Line}</Text>
		          	</View>
		          	<View style={styles.direction}>
		          		<Text style={styles.textFetures2}>{item.Dest}</Text>
		          	</View>
		          	<View style={styles.next}>
		          		<Text style={styles.nextFetures2}>{item.NextHhMm}</Text>
		          	</View>
		        </View>
		        ))}
				

			</View>
		);
	}

});

var styles = StyleSheet.create({
	container:{
		flex:1,
		marginTop: 55,
		backgroundColor: '#ffffff',
	},

	location:{
		justifyContent: "center",
		flexDirection: "row",
		backgroundColor: '#ffffff',
		height: 30,
		marginTop: 20,
		borderBottomWidth: 2, 
		borderBottomColor: '#00437a',
	},

	items: {
		flexDirection:"row",
		height: 40,
		alignItems : 'center', 
		borderBottomWidth: 1, 
		borderBottomColor: '#00437a',
	},

	items2: {
		flexDirection:"row",
		height: 40,
		alignItems : 'center', 
		backgroundColor: "#00437a",
		borderBottomWidth: 1, 
		borderBottomColor: '#ffffff',
	},

	textFetures:{
		color: "#00437a",
		fontSize: 16,
		textAlign: 'center'
	},

	textFetures2:{
		color: "#ffffff",
		fontSize: 16,
		textAlign: 'center'
	},

	nextFetures:{
		color: "#00437a",
		fontSize: 16,
		textAlign:'right',
	},

	nextFetures2:{
		color: "#ffffff",
		fontSize: 16,
		textAlign:'right',
	},

	route: {
		flex:1,
	},

	route2: {
		flex:1,
		backgroundColor:"#00437a",
	},

	direction: {
		flex:2,
	},

	next: {
		flex:3,
		marginRight: 10,
	},
});

module.exports = Bus;
