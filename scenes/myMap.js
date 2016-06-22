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

var MyMap = React.createClass({

  mixins: [Mapbox.Mixin, nav],

  getInitialState() {
    return {
      center: {
        latitude: 40.7223,
        longitude: -73.9878
      },
      annotations: [
        {
          coordinates: [40.7223, -73.9878],
          type: 'point',
          title: 'Important!',
          subtitle: 'Neat, this is a custom annotation image',
          id: 'marker2',
          annotationImage: {
            url: 'https://cldup.com/7NLZklp8zS.png',
            height: 25,
            width: 25
          }
        }, 
        {
          coordinates: [40.7923, -73.9178],
          type: 'point',
          title: 'Important!',
          subtitle: 'Neat, this is a custom annotation image'
        }, 
        {
          coordinates: [[40.76572150042782,-73.99429321289062],[40.743485405490695, -74.00218963623047],[40.728266950429735,-74.00218963623047],[40.728266950429735,-73.99154663085938],[40.73633186448861,-73.98983001708984],[40.74465591168391,-73.98914337158203],[40.749337730454826,-73.9870834350586]],
          type: 'polyline',
          strokeColor: '#00FB00',
          strokeWidth: 3,
          alpha: 0.5,
          id: 'foobar'
        }, 
        {
          coordinates: [[40.749857912194386, -73.96820068359375], [40.741924698522055,-73.9735221862793], [40.735681504432264,-73.97523880004883], [40.7315190495212,-73.97438049316406], [40.729177554196376,-73.97180557250975], [40.72345355209305,-73.97438049316406], [40.719290332250544,-73.97455215454102], [40.71369559554873,-73.97729873657227], [40.71200407096382,-73.97850036621094], [40.71031250340588,-73.98691177368163], [40.71031250340588,-73.99154663085938]],
          type: 'polygon',
          alpha:1,
          fillColor: '#FFFFFF',
          strokeColor: '#FFFFFF',
          strokeWidth: 1,
          id: 'zap'
        }
      ],
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
    console.log(annotation);
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
        console.log("latitude:",position.coords.latitude)
        console.log("longitude:",position.coords.longitude)
        // this.setState({initialPosition});
        this.setState({
          center: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });

        console.log("center",this.state.center)
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000}
    );

    
  },

  changeText: async function(value){

   
    fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+ value +'&types=geocode&key=AIzaSyADgz1b7BX9P7pR2bYRnU7z5HvJ_0o8DSo', contents)
      .then(function (res){
      return res.json();
    })
    .then(function (json){
      console.log("autocomplete!!!!", json.predictions);
      
      var predictions = json.predictions.map(function(item, i){
        return {
          description: item.description,
          id: item.place_id,
        }
      });

      this.setState({
        places: predictions,
      });

    }.bind(this))
    .catch(function(err){
        console.log('err',err);
    })
  },

  getThisPlace: function(id){
    console.log(id)
    fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid='+ id +'&key=AIzaSyADgz1b7BX9P7pR2bYRnU7z5HvJ_0o8DSo', contents)
      .then(function (res){
      return res.json();
    })
    .then(function (json){
      console.log("getThisPlace!!!!", json);
      var lat = json.result.geometry.location.lat;
      var lng = json.result.geometry.location.lng;

      console.log(lat, lng)
    }.bind(this))
    .catch(function(err){
        console.log('err',err);
    })
  },

  clearInput: function(){
    this.refs.inputBox.clear();
    this.changeText("");
  },

  render() {
    return (
      <View style={styles.container}>

        <View style={{marginTop: 55}}>
        <Text onPress={() => this.setDirectionAnimated(mapRef, 10)}>
          Set direction to 0
        </Text>
        <Text onPress={() => this.setCenterCoordinateAnimated(mapRef, 40.68454331694491, -73.93592834472656)}>
          Go to New York at current zoom level
        </Text>
        <Text onPress={() => this.setCenterCoordinateZoomLevelAnimated(mapRef, 35.68829, 139.77492, 14)}>
          Go to Tokyo at fixed zoom level 14
        </Text>
        <Text onPress={() => this.addAnnotations(mapRef, [{
          coordinates: [40.73312,-73.989],
          type: 'point',
          title: 'This is a new marker',
          id: 'foo'
        }, {
          'coordinates': [[40.75974059207392, -74.02484893798828], [40.68454331694491, -73.93592834472656]],
          'type': 'polyline'
        }])}>
          Add new marker
        </Text>
        <Text onPress={() => this.setUserTrackingMode(mapRef, this.userTrackingMode.follow)}>
          Set userTrackingMode to follow
        </Text>
        <Text onPress={() => this.removeAllAnnotations(mapRef)}>
          Remove all annotations
        </Text>
        <Text onPress={() => this.setTilt(mapRef, 50)}>
          Set tilt to 50
        </Text>
        <Text onPress={() => this.setVisibleCoordinateBoundsAnimated(mapRef, 40.712, -74.227, 40.774, -74.125, 100, 100, 100, 100)}>
          Set visible bounds to 40.7, -74.2, 40.7, -74.1
        </Text>
        <Text onPress={() => {
            this.getDirection(mapRef, (direction) => {
             console.log(direction);
            });
          }}>
          Get direction
        </Text>
        <Text onPress={() => {
            this.getBounds(mapRef, (bounds) => {
             console.log(bounds);
            });
          }}>
          Get current Bounds
        </Text>
        <Text onPress={() => {
            this.getCenterCoordinateZoomLevel(mapRef, (location) => {
             console.log(location);
            });
          }}>
          Get location
        </Text>
        </View>
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
          compassIsHidden={true}
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
        </View>
        <ScrollView 
          ref={(component) => this._scrollView = component}
          style={{backgroundColor: '#ffffff',}}>

              {this.state.places.map((item,i)=>(

              <View style={{borderBottomWidth:0.5, borderBottomColor: "#eeeeee",}}  key={i}>
                  <TouchableOpacity onPress={() => this.getThisPlace(item.id)}>                                    
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
  },

  bg2: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
    flexDirection:"row",
    alignItems: "center",
  },

  textInput: {
    height: 40, 
    fontSize: 18,
    padding: 4,
    borderWidth: 0,
    width: width - 60,
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