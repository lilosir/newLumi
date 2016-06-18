'use strict';

var React = require('react-native');
var CreateButton = require('./createButton');

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

var CourseTable = React.createClass({

	getInitialState: function() {
		return {
			courses: [],
		};
	},

	componentDidMount: function() {
		this.setState({
			courses: this.getCourses(), 
		});
	},

	getCourses: function(){
		return [
			[
				{
					subject: "Artificial Intelligence",
					instructor: "Dr. Sabah M. Mohammed",
					room: 'AT2005',
					starttime: new Date(),
					endtime: new Date(),
				},
			],[
				{
					subject: "Computer Graphics",
					instructor: "Dr. Maurice W. Benson",
					room: 'AT2019',
					starttime: new Date(),
					endtime: new Date(),
				}
			],[
				{
					subject: "Artificial Intelligence",
					instructor: "Dr. Sabah M. Mohammed",
					room: 'AT2005',
					starttime: new Date(),
					endtime: new Date(),
				},
			],[
				{
					subject: "Computer Graphics",
					instructor: "Dr. Maurice W. Benson",
					room: 'AT2019',
					starttime: new Date(),
					endtime: new Date(),
				}
			],[
				{
					subject: "Graduate Seminar",
					instructor: "Dr. Jinan A. Fiaidhi",
					room: 'AT1005',
					starttime: new Date(),
					endtime: new Date(),
				},
				{
					subject: "Graduate Seminar",
					instructor: "Dr. Jinan A. Fiaidhi",
					room: 'AT1005',
					starttime: new Date(),
					endtime: new Date(),
				},
				{
					subject: "Graduate Seminar",
					instructor: "Dr. Jinan A. Fiaidhi",
					room: 'AT1005',
					starttime: new Date(),
					endtime: new Date(),
				},
				{
					subject: "Graduate Seminar",
					instructor: "Dr. Jinan A. Fiaidhi",
					room: 'AT1005',
					starttime: new Date(),
					endtime: new Date(),
				},
			]
		]
	},

	createTable: function(){
		console.warn("SDFSDF")
	},

	render: function() {
		return (
			<View style={styles.container}>
			<ScrollView>
				{
					this.state.courses.map((day, i)=>{
						return(
							<View key={i}>
							<View style={styles.days}>
							{
								function(){
									if(i == 0){
										return(
											<Text style={styles.weekday}> Monday </Text>
										)
									}
									if(i == 1){
										return(
											<Text style={styles.weekday}> Tuesday </Text>
										)
									}
									if(i == 2){
										return(
											<Text style={styles.weekday}> Wednesday </Text>
										)
									}
									if(i == 3){
										return(
											<Text style={styles.weekday}> Thursday </Text>
										)
									}
									if(i == 4){
										return(
											<Text style={styles.weekday}> Friday </Text>
										)
									}
								}.bind(this).call()
							}
							</View>
							{
								day.map((course, j)=>{
									var time1 = course.starttime.getHours() + ":" + (course.starttime.getMinutes()<10?'0':'') + course.starttime.getMinutes();
									var time2 = course.endtime.getHours() + ":" + (course.endtime.getMinutes()<10?'0':'') + course.endtime.getMinutes();
									return(
										<View style={{backgroundColor: "white"}} key={j}>
											<View style={styles.items}>
												<View style={{flex: 2}}>
													<Text> {time1 + "-" + time2}</Text>
												</View>
												<View style={{flex: 3, flexDirection: "column"}}>
													<Text style={{fontWeight: 'bold'}}> {course.subject}</Text>
													<Text> {course.instructor}</Text>
													<Text> {course.room}</Text>
												</View>
											</View>
										</View>
									)
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

	days: {
		marginTop: 10,
		borderBottomWidth:1,
	    borderBottomColor: "#dddddd",
	},

	items: {
		marginLeft: 30, 
		flexDirection:"row", 
		justifyContent: 'center', 
	  	alignItems: 'center',
	  	borderBottomWidth:0.5,
	    borderBottomColor: "#dddddd",
	}

});

module.exports = CourseTable;