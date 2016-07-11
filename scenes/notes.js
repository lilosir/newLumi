'use strict';

var React = require('react-native');
var CreateButton = require('./createButton');
var apis = require('../apis');
var {Actions} = require('react-native-router-flux');
var {Avatar, List, Subheader, IconToggle, Icon, Button} = require('react-native-material-design');
var nav  = require('../NavbarMixin');
var TimerMixin = require('react-timer-mixin');

var {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Image,
	TouchableOpacity,
	Dimensions,
	RefreshControl,
	Animated,
} = React;

var Notes = React.createClass({
	mixins: [nav, TimerMixin],
	
	getInitialState: function() {
		return {
			notes: [],
		};
	},

	componentDidMount: function() {
		this.props.setLockMode("locked-closed");
		
		this.setState({
			notes: this.getNotes(), 
		});

		this.setLeftButtons([{
	      icon: 'arrow-back',
	      onPress: this.back,
	    }]);
	},

	back: function(){
	    Actions.mycampus();
	},

	getNotes: function(){
		return [
			{
				subject: "Artificial Intelligence",
				notes: [
					{	
						createTime: new Date(),
						images:[
							apis.BASE_URL+"/"+'images/default_avatar.png',
						],
						text: "Artificial Intelligence note1"
					},
					{	
						createTime: new Date(),
						images:[],
						text: "Artificial Intelligence note2, XXXXXXXXXXXXXXXXXXXXXXXXXXX@#$@"
					}
				]
			},
			{
				subject: "Computer Graphics",
				notes: [
					{	
						createTime: new Date(),
						images:[
							apis.BASE_URL+"/"+'images/default_avatar.png',
						],
						text: "Computer Graphics note"
					}
				]
			},
			{
				subject: "Graduate Seminar",
				notes: [
					{	
						createTime: new Date(),
						images:[],
						text: "Graduate Seminar note"
					}
				]
			},
		]
	},

	createTable: function(){
		console.warn("will create a new note")
	},

	render: function() {
		return (
			<View style={styles.container}>
			<ScrollView>
				<View style={styles.subject}>
					<Text style={styles.subjectText}> Default </Text>
				</View>
				{
					this.state.notes.map((subject, i)=>{
						return(
							<View style={styles.subject} key={i}>
								<View style={styles.subject}>
									<Text style={styles.subjectText}> {subject.subject}</Text>
								</View>
								{
									subject.notes.map((note, j)=>{
										var time = note.createTime.getFullYear() + "-" + note.createTime.getMonth() +"-"+ note.createTime.getDay();
										if(note.images.length > 0){
											return(
												<View style={{flexDirection: 'column',}} key={j}>
													<View style={styles.itemsWithPhotos}>
														<View style={[styles.time, {flex: 1}]}>
															<Text> {time}</Text>
														</View>
														<View style={[styles.text, {flex:3}]}>
															<Text numberOfLines={1}> {note.text}</Text>
														</View>
														<View style={[styles.image, {flex:1}]}>
															<Image style={{width: 50, height: 50}} source={{uri:note.images[0]}}/>
														</View>
													</View>
												</View>
											)
										}else{
											return(
												<View style={{flexDirection: 'column',}} key={j}>
													<View style={styles.items}>
														<View style={[styles.time, {flex: 1}]}>
															<Text> {time}</Text>
														</View>
														<View style={[styles.text, {flex:4}]}>
															<Text numberOfLines={1}> {note.text}</Text>
														</View>
													</View>
												</View>
											)
										}
									})
								}
														
							</View>
						)
					})
				}
			</ScrollView>
				<CreateButton OnClick={this.createTable}/>
			</View>
		);
	}

});

var styles = StyleSheet.create({
	container:{
		flex: 1,
		marginTop: 55,
		backgroundColor: "#f5f5f0",
	},

	weekday: {
		color: 'black',
		fontSize: 18,
	},

	subject: {
		marginTop: 10,
		borderBottomWidth:1,
	    borderBottomColor: "#dddddd",
	    backgroundColor: 'white',
	},

	subjectText:{
		color: 'black',
		fontSize: 16,
		marginLeft: 10,
		alignItems: 'center',
	},

	items: { 
		marginLeft: 30,
		flexDirection:"row",  
	  	alignItems: 'center',
	  	borderBottomWidth:0.5,
	    borderBottomColor: "#dddddd",
	    height: 30,
	},

	itemsWithPhotos: { 
		marginLeft: 30,
		flexDirection:"row",  
	  	alignItems: 'center',
	  	borderBottomWidth:0.5,
	    borderBottomColor: "#dddddd",
	},

	text:{
		marginLeft: 10,
	},

	image:{
		height: 55,
		width: 55,
		alignItems: 'center',
	  	justifyContent: 'center',
	}

});

module.exports = Notes;