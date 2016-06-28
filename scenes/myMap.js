import React, { Component } from 'react';
var Mapbox = require('react-native-mapbox-gl');
var mapRef = 'mapRef';
var nav = require('../NavbarMixin');
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');
var {Avatar, List, Icon} = require('react-native-material-design');
var {height, width} = Dimensions.get('window');
var TimerMixin = require('react-timer-mixin');

import {
  AppRegistry,
  StyleSheet,
  Text,
  StatusBar,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';

var contents = {
  method: 'GET',
};

var MyMap = React.createClass({

  mixins: [Mapbox.Mixin, nav, TimerMixin],

  getInitialState() {
    return {
      center: {
        latitude: 48.431852,
        longitude: -89.231613
      },
      destination: {
        coordinates: [0, 0],
      },
      text: null,
      places:[],
      animateValueY: new Animated.Value(0),
      recommendations: {
        campus: [
            {
              name:'ATAC',
              lat: 48.421736,
              lng: -89.259356, 
            },
            {
              name: 'Chancellor Paterson Library',
              lat: 48.420655,
              lng: -89.260360, 
            },
            {
              name:'North Residence',
              lat: 48.417722,
              lng: -89.263365, 
            },
            {
              name: 'South Residence',
              lat: 48.416888,
              lng: -89.262991, 
            }
        ],
        food: [
            {
              name:'Sushi Station',
              lat: 48.423354,
              lng: -89.237433, 
            },
            {
              name: 'Applebees',
              lat: 48.407722,
              lng: -89.258890, 
            },
            {
              name:'Prospector Steak House',
              lat: 48.433803,
              lng: -89.220044, 
            },
        ],
        entertain:[
            {
              name:'Marios Bowl',
              lat: 48.414731,
              lng: -89.243230, 
            },
            {
              name: 'Loch Lomond Ski Area',
              lat: 48.295069,
              lng: -89.347427, 
            },
            {
              name:'Fort William Country Club',
              lat: 48.325762,
              lng: -89.319268, 
            },
        ]
      },
    }
  },
  onUserLocationChange(location) {
    console.log(location);
  },
  onLongPress(location) {
    console.log(location);
  },
  onOpenAnnotation(annotation) {
    console.warn("????",annotation);
  },

  componentDidMount: function() {

    // this.setState({
    //   recommendations: this.getRec(),
    // });

    console.log("!@#!#@",this.state.recommendations.campus)
    let innerScrollView = this._scrollView.refs.InnerScrollView;
    let scrollView = this._scrollView.refs.ScrollView;

    requestAnimationFrame(() => {
        innerScrollView.measure((innerScrollViewX, innerScrollViewY, innerScrollViewWidth, innerScrollViewHeight) => {
            scrollView.measure((scrollViewX, scrollViewY, scrollViewWidth, scrollViewHeight) => {
                var scrollTo = innerScrollViewHeight - scrollViewHeight + innerScrollViewY;

                if (innerScrollViewHeight < scrollViewHeight) {
                    return;
                }
                // scroll to bottom
                // this._scrollView.scrollTo({y:scrollTo});

                // scroll to top
                this._scrollView.scrollTo({y:0});
            });
        });
    });

    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     var initialPosition = JSON.stringify(position);
    //     this.setState({
    //       center: {
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude,
    //       },
    //     });

    //   },
    //   (error) => alert(error.message),
    //   {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000}
    // );
  },

  getRec: function(){
    return {
      campus: [
          {
            name:'ATAC',
            lat: 48.421736,
            lng: -89.259356, 
          },
          {
            name: 'Chancellor Paterson Library',
            lat: 48.420655,
            lng: -89.260360, 
          },
          {
            name:'North Residence',
            lat: 48.417722,
            lng: -89.263365, 
          },
          {
            name: 'South Residence',
            lat: 48.416888,
            lng: -89.262991, 
          }
      ],
      food: [
          {
            name:'Sushi Station',
            lat: 48.423354,
            lng: -89.237433, 
          },
          {
            name: 'Applebees',
            lat: 48.407722,
            lng: -89.258890, 
          },
          {
            name:'Prospector Steak House',
            lat: 48.433803,
            lng: -89.220044, 
          },
      ],
      entertain:[
          {
            name:'Marios Bowl',
            lat: 48.414731,
            lng: -89.243230, 
          },
          {
            name: 'Loch Lomond Ski Area',
            lat: 48.295069,
            lng: -89.347427, 
          },
          {
            name:'Fort William Country Club',
            lat: 48.325762,
            lng: -89.319268, 
          },
      ]
    }
  },

  changeText: async function(value){

    try{
      var result = await fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+ value +'&types=geocode&key=AIzaSyADgz1b7BX9P7pR2bYRnU7z5HvJ_0o8DSo', contents);
     
      result = await result.json();

      var predictions = result.predictions.map(function(item, i){
          return {
            description: item.description,
            id: item.place_id,
          }
        });

        this.setState({
          places: predictions,
        });
    }catch(e){
      console.warn('err',e);
    }
  },

  getThisPlace: async function(id, description){
    this.clearInput();

    try{
      var place = await fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid='+ id +'&key=AIzaSyADgz1b7BX9P7pR2bYRnU7z5HvJ_0o8DSo', contents)
      place = await place.json();

      var des_lat = place.result.geometry.location.lat;
      var des_lng = place.result.geometry.location.lng;

      this.addAnnotations(mapRef, [
        {
          coordinates: [des_lat,des_lng],
          type: 'point',
          title: 'This is a new marker',
          id: 'foo'
        }
      ])

      this.setCenterCoordinateAnimated(mapRef, des_lat, des_lng);

      this.setState({
        text: description,
        places: [], 
        destination: {
          coordinates: [des_lat, des_lng],
        },
      });
    }catch(e){
      console.warn(e)
    }
  },

  clearInput: function(){
    this.refs.inputBox.clear();
    this.changeText("");
    this.removeAllAnnotations(mapRef);
    this.setState({
      text: null,
      places: [], 
      destination: {
        coordinates: [0, 0],
      },
    });
  },

  goSearching:async function(){
    this.removeAllAnnotations(mapRef);
    this.setState({
      places: [], 
      destination: {
        coordinates: [0, 0],
      },
    });

    var lat = this.state.center.latitude;
    var lng = this.state.center.longitude;

    try{
      var places = await fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lng+'&radius=5000&name=sushi+station&key=AIzaSyADgz1b7BX9P7pR2bYRnU7z5HvJ_0o8DSo',contents)
      places = await places.json();

      var des_lat = places.results[0].geometry.location.lat;
      var des_lng = places.results[0].geometry.location.lng;

      this.addAnnotations(mapRef, [{
          coordinates: [des_lat,des_lng],
          type: 'point',
          title: 'This is a new marker',
          id: 'searched place'
      }]);

      this.setCenterCoordinateAnimated(mapRef, des_lat, des_lng);

      this.setState({
        destination: {
          coordinates: [des_lat, des_lng],
        },
      });
    }catch(e){
      console.warn(e);
    }
  },

  goList: function(){
    Animated.timing(
      this.state.animateValueY,
      {
        toValue: -height ,
        duration: 1000,
      }
    ).start();
  },

  goToMyself: function(){
    this.setCenterCoordinateZoomLevelAnimated(mapRef, this.state.center.latitude, this.state.center.longitude, 14);
  },

  goFast: function(lat, lng){
    this.clearInput();
    this.setState({
      destination: {
        coordinates: [lat, lng],
      },
    });

    this.addAnnotations(mapRef, [
        {
          coordinates: [lat,lng],
          type: 'point',
          title: 'This is a new marker',
          id: 'foo'
        }
      ])

    this.setCenterCoordinateAnimated(mapRef, lat, lng);

    this.options();
    this.back();
  },

  options: async function(){

    this.goToMyself();

    try{

      var des_lat = this.state.destination.coordinates[0];
      var des_lng = this.state.destination.coordinates[1];

      var routes  = await fetch('https://api.mapbox.com/v4/directions/mapbox.walking/'+ this.state.center.longitude +','+ this.state.center.latitude +';'+ des_lng +','+ des_lat +'.json?access_token=pk.eyJ1Ijoic3J5Z2ciLCJhIjoiY2lwcThma2hvMDVoYmZubm9iNWR0Mnp2bSJ9.laJCFI9y3Fwn5bvk5T6YYA',contents)
      routes = await routes.json();

      var coordinates = routes.routes[0].geometry.coordinates;
      var new_coordinates = [];
      for (var i = 0; i < coordinates.length; i++) {
        var item_j = [coordinates[i][1],coordinates[i][0]];
        new_coordinates.push(item_j);
      }

      this.addAnnotations(mapRef, [
      {
        'coordinates': new_coordinates,
        'type': 'polyline',
        'strokeColor':'#03a9f4',
        'strokeWidth':3,
        'strokeAlpha': 0.7
      }])


    }catch(e){
      console.warn(e);
    }
  },

  back: function(){
    Animated.timing(
      this.state.animateValueY,
      {
        toValue: height ,
        duration: 1000,
      }
    ).start();
  },

  render() {
    var options;
    if(this.state.destination.coordinates[0] != 0 ||
       this.state.destination.coordinates[1] != 0 ){
      options = <TouchableOpacity onPress={()=> (this.options())} style={styles.options}>
                  <Icon size={20} name="directions" color="#ffffff"/>
                </TouchableOpacity>
    }
    return (
      <View style={styles.container}>
        <Mapbox
          // annotations={this.state.annotations}
          accessToken={'pk.eyJ1Ijoic3J5Z2ciLCJhIjoiY2lwcThma2hvMDVoYmZubm9iNWR0Mnp2bSJ9.laJCFI9y3Fwn5bvk5T6YYA'}
          centerCoordinate={this.state.center}
          debugActive={false}
          direction={0}
          ref={mapRef}
          onRegionChange={this.onRegionChange}
          rotateEnabled={true}
          scrollEnabled={true}
          style={{flex:1}}
          showsUserLocation={true}
          styleURL={this.mapStyles.emerald}
          userTrackingMode={this.userTrackingMode.none}
          zoomEnabled={true}
          zoomLevel={13}
          compassIsHidden={false}
          logoIsHidden={true}
          onUserLocationChange={this.onUserLocationChange}
          onLongPress={this.onLongPress}
          onOpenAnnotation={this.onOpenAnnotation}
        />

        <View style={styles.box}>
          <View style={styles.bg1}>
            <View style={styles.bg2}>
              <TextInput
                  ref="inputBox"
                  style={styles.textInput}
                  onChangeText={this.changeText}
                  value={this.state.text}   
                  underlineColorAndroid='rgba(0,0,0,0)'     
                  placeholder={"Search ..."}/>
              <TouchableOpacity onPress={this.clearInput}>
                <Icon name="clear"/>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=> (this.goSearching())}>
                <View style={styles.go}>
                  <Text style={styles.goText}> Go </Text>
                </View>
            </TouchableOpacity>
          </View>
          <ScrollView 
            ref={(component) => this._scrollView = component}
            style={{backgroundColor: '#ffffff',}}>

                {this.state.places.map((item,i)=>(

                <View style={{borderBottomWidth:0.5, borderBottomColor: "#eeeeee",}}  key={i}>
                    <TouchableOpacity onPress={() => this.getThisPlace(item.id,item.description)}>                                    
                    <List            
                      primaryText={item.description}/>
                   </TouchableOpacity>
                </View>
                ))}
          
          </ScrollView>
        </View>
        <TouchableOpacity onPress={this.goList} style={styles.goList}>
            <Icon size={20} name="stars" color="#ffffff"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToMyself} style={styles.goToMyself}>
            <Icon size={20} name="my-location" color="#ffffff"/>
        </TouchableOpacity>
        {options}

        <Animated.View 
          style={
            [styles.directions, 
            {transform: 
              [ 
                {translateY: this.state.animateValueY},
              ]
            }]}>
            <View style={{marginTop: 10, justifyContent:'center', flexDirection: 'row'}}>
              <Text style={{fontSize: 22, marginLeft: 10, color: 'black',flex: 6}}>
                Express direction
              </Text>
              <TouchableOpacity onPress={this.back} style={{flex:1}}>
                <Icon size={36} name="clear" color="#123123"/>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={{ 
                marginLeft: 40, 
                marginTop: 20,
                justifyContent: 'center'}}>
                <View style={{flexDirection:'row'}}>
                  <Icon name="local-library" size={30}/>
                  <Text style={{fontSize: 18, marginLeft: 10,color: 'black',}}> Campus </Text>
                </View>
                {this.state.recommendations.campus.map(function(place, i){
                    return(
                      <TouchableOpacity 
                        key={i} 
                        style={{marginTop: 10, marginLeft:40}}
                        onPress={()=> this.goFast(place.lat, place.lng)}>
                        <Text style={{fontSize: 14,color: 'black',}}> {place.name} </Text>
                      </TouchableOpacity>
                    )
                  }.bind(this))
                }
              </View>

              <View style={{ 
                marginLeft: 40, 
                marginTop: 20,
                justifyContent: 'center'}}>
                <View style={{flexDirection:'row'}}>
                  <Icon name="restaurant" size={30}/>
                  <Text style={{fontSize: 18, marginLeft: 10,color: 'black',}}> Food </Text>
                </View>
                {this.state.recommendations.food.map(function(place, i){
                    return(
                      <TouchableOpacity 
                        key={i} 
                        style={{marginTop: 10, marginLeft:40}}
                        onPress={()=> this.goFast(place.lat, place.lng)}>
                        <Text style={{fontSize: 14,color: 'black',}}> {place.name} </Text>
                      </TouchableOpacity>
                    )
                  }.bind(this))
                }
              </View>

              <View style={{ 
                marginLeft: 40, 
                marginTop: 20,
                justifyContent: 'center'}}>
                <View style={{flexDirection:'row'}}>
                  <Icon name="local-activity" size={30}/>
                  <Text style={{fontSize: 18, marginLeft: 10,color: 'black',}}> Entertain </Text>
                </View>
                {this.state.recommendations.entertain.map(function(place, i){
                    return(
                      <TouchableOpacity 
                        key={i} 
                        style={{marginTop: 10, marginLeft:40}}
                        onPress={()=> this.goFast(place.lat, place.lng)}>
                        <Text style={{fontSize: 14,color: 'black',}}> {place.name} </Text>
                      </TouchableOpacity>
                    )
                  }.bind(this))
                }
              </View>
            </ScrollView>
        </Animated.View>
      </View>
    );
  }
});



var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 55,
  },

  box: {
    position: 'absolute',
    width: width,
    left: 0,
    top:  0,    
  },

  bg1: {
    backgroundColor: '#f5f5f0',
    flexDirection:"row",
  },

  bg2: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
    flexDirection:"row",
    alignItems: "center",
    width: width- 65,
  },

  textInput: {
    height: 40, 
    fontSize: 18,
    padding: 4,
    borderWidth: 0,
    width: width - 95,
  },

  go: {
      borderRadius: 5,
      backgroundColor: '#03a9f4',
      alignItems : 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
      marginTop: 10,
      marginBottom:10,
  },

  goText: {
      color: "white",
      fontSize: 16,
  },

  goList: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#03a9f4',
    justifyContent: 'center', 
    alignItems: 'center',
    alignSelf: 'center',
    left:  width - 50,
    top:   height - 230,    
  },

  goToMyself: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#03a9f4',
    justifyContent: 'center', 
    alignItems: 'center',
    alignSelf: 'center',
    left:  width - 50,
    top:   height - 180,    
  },

  options: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#03a9f4',
    justifyContent: 'center', 
    alignItems: 'center',
    alignSelf: 'center',
    left: width - 50,
    top:  height - 130,    
  },

  directions: {
    position: 'absolute',
    width: width,
    height: height - 60,
    backgroundColor: 'white',
    left: 0,
    top:  height,    
  },
});

module.exports = MyMap;


// 'use strict';


// var React = require('react');
// var ReactNative = require('react-native');
// var {
//   StyleSheet,
//   Text,
//   View,
// } = ReactNative;

// var MyMap = React.createClass({
//   mixins: [ nav],
//   watchID: (null: ?number),

//   getInitialState: function() {
//     return {
//       initialPosition: 'unknown',
//       lastPosition: 'unknown',
//     };
//   },

//   componentDidMount: function() {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         var initialPosition = JSON.stringify(position);
//         this.setState({initialPosition});
//       },
//       (error) => alert(error.message),
//       {enableHighAccuracy: true, timeout: 2000, maximumAge: 1000}
//     );
//     this.watchID = navigator.geolocation.watchPosition((position) => {
//       var lastPosition = JSON.stringify(position);
//       this.setState({lastPosition});
//     });
//   },

//   componentWillUnmount: function() {
//     navigator.geolocation.clearWatch(this.watchID);
//   },

//   render: function() {
//     return (
//       <View style={{marginTop: 55}}>
//         <Text>
//           <Text style={styles.title}>Initial position: </Text>
//           {this.state.initialPosition}
//         </Text>
//         <Text>
//           <Text style={styles.title}>Current position: </Text>
//           {this.state.lastPosition}
//         </Text>
//       </View>
//     );
//   }
// });

// var styles = StyleSheet.create({
//   title: {
//     fontWeight: '500',
//   },
// });

// module.exports = MyMap;