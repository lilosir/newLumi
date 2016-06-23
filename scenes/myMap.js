import React, { Component } from 'react';
var Mapbox = require('react-native-mapbox-gl');
var mapRef = 'mapRef';
var nav = require('../NavbarMixin');
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');
var {Avatar, List, Icon} = require('react-native-material-design');
var {height, width} = Dimensions.get('window');

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
} from 'react-native';

var contents = {
  method: 'GET',
};

var crt = [ [ 48.42224, -89.26188 ],
  [ 48.42245, -89.26147 ],
  [ 48.4225, -89.26136 ],
  [ 48.42271, -89.26111 ],
  [ 48.42267, -89.26089 ],
  [ 48.42264, -89.26074 ],
  [ 48.4225, -89.26037 ],
  [ 48.42288, -89.26007 ],
  [ 48.42299, -89.25966 ],
  [ 48.42291, -89.25947 ],
  [ 48.42287, -89.2592 ],
  [ 48.42299, -89.2592 ],
  [ 48.42313, -89.25873 ],
  [ 48.42339, -89.25787 ],
  [ 48.42352, -89.25745 ],
  [ 48.42364, -89.25702 ],
  [ 48.4237, -89.25675 ],
  [ 48.42372, -89.25656 ],
  [ 48.42372, -89.25632 ],
  [ 48.42371, -89.25606 ],
  [ 48.42381, -89.25602 ],
  [ 48.42423, -89.25576 ],
  [ 48.42432, -89.25568 ],
  [ 48.42469, -89.25552 ],
  [ 48.42476, -89.25547 ],
  [ 48.42546, -89.2549 ],
  [ 48.4256, -89.25479 ],
  [ 48.42596, -89.25359 ],
  [ 48.42623, -89.2528 ],
  [ 48.42626, -89.25272 ],
  [ 48.42671, -89.25135 ],
  [ 48.427, -89.25051 ],
  [ 48.42719, -89.24998 ],
  [ 48.42724, -89.24983 ],
  [ 48.42738, -89.24941 ],
  [ 48.42762, -89.2487 ],
  [ 48.42774, -89.24834 ],
  [ 48.42854, -89.24597 ],
  [ 48.42885, -89.24457 ],
  [ 48.42893, -89.24409 ],
  [ 48.42902, -89.24337 ],
  [ 48.42911, -89.24201 ],
  [ 48.42919, -89.24076 ],
  [ 48.42923, -89.23832 ],
  [ 48.42921, -89.23706 ],
  [ 48.42916, -89.23644 ],
  [ 48.429, -89.23578 ],
  [ 48.42867, -89.23451 ],
  [ 48.43085, -89.23221 ],
  [ 48.43159, -89.23146 ] ];

var MyMap = React.createClass({

  mixins: [Mapbox.Mixin, nav],

  getInitialState() {
    return {
      center: {
        latitude: 48.431780,
        longitude: -89.2316
      },
      annotations: [],
      text: null,
      places:[],
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

    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({
          center: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });

      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000}
    );
  },

  changeText: async function(value){

    // this.addAnnotations(mapRef, [
    // {
    //   'coordinates': crt,
    //   'type': 'polyline',
    //   'strokeColor':'#03a9f4',
    //   'strokeWidth':5,
    //   'strokeAlpha': 0.7
    // }])

    try{
      var result = await fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+ value +'&types=geocode&key=AIzaSyADgz1b7BX9P7pR2bYRnU7z5HvJ_0o8DSo', contents);
      // console.log("!!!!!!!!!!!result",await result.json());
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
      console.warn('err',err);
    }
   
    
    // fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+ value +'&types=geocode&key=AIzaSyADgz1b7BX9P7pR2bYRnU7z5HvJ_0o8DSo', contents)
    //   .then(function (res){
    //   return res.json();
    // })
    // .then(function (json){
    //   console.log("autocomplete!!!!", json);
      
    //   var predictions = json.predictions.map(function(item, i){
    //     return {
    //       description: item.description,
    //       id: item.place_id,
    //     }
    //   });

    //   this.setState({
    //     places: predictions,
    //   });

    // }.bind(this))
    // .catch(function(err){
    //     console.log('err',err);
    // })
  },

  getThisPlace: async function(id, description){

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
      });

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
    });
  },

  goSearching:async function(){
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
      console.warn(err);
    }
     // fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lng+'&radius=5000&name=sushi+station&key=AIzaSyADgz1b7BX9P7pR2bYRnU7z5HvJ_0o8DSo',contents)
     //  .then(function(result){
     //    return result.json();
     //  })
     //  .then(function(places){

     //    var des_lat = places.results[0].geometry.location.lat;
     //    var des_lng = places.results[0].geometry.location.lng;

     //    this.addAnnotations(mapRef, [{
     //      coordinates: [des_lat,des_lng],
     //      type: 'point',
     //      title: 'This is a new marker',
     //      id: 'searched place'
     //    }])        

     //  }.bind(this))
     //  .catch(function(err){
     //      console.log(err);
     //  })
  },

  render() {
    return (
      <View style={styles.container}>
        <Mapbox
          annotations={this.state.annotations}
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
          zoomLevel={14}
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
  // #03a9f4

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