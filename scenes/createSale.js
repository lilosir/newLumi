var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  Image,
  ScrollView,
  ToastAndroid,
} = React;

var nav  = require('../NavbarMixin');
var {height, width} = Dimensions.get('window');
var {Avatar, List, Subheader, IconToggle, Icon, Button} = require('react-native-material-design');
var ImagePickerManager = require('NativeModules').ImagePickerManager;
var PostAPIS = require('../operations/posts');
var {Actions} = require('react-native-router-flux');

var createSale = React.createClass({

  mixins: [nav],

  getInitialState: function() {
    return {
      contentText: '',
      contentHeight: 50,
      original:0,
      current:0,
      imageSource:[],
    };
  },

  imagePicker: function(){

    var options = {
      title: 'Select Images', // specify null or empty string to remove the title
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
      customButtons: {
        'Choose Photo from Facebook': 'fb', // [Button Text] : [String returned upon selection]
      },
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      durationLimit: 10, // video recording max time in seconds
      maxWidth: 100, // photos only
      maxHeight: 100, // photos only
      aspectX: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      quality: 1, // 0 to 1, photos only
      angle: 0, // android only, photos only
      allowsEditing: false, // Built in functionality to resize/reposition the image after selection
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'images' // ios only - will save image at /Documents/images rather than the root
      }
    };


    ImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data:
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        // uri (on android)
        // const source = {uri: response.uri, isStatic: true};

        var temp = [];
        temp = this.state.imageSource;
        temp.push(source);

        this.setState({
          imageSource: temp,
        });
      }
    });
  },
  
  componentDidMount: function() {

    this.setRightButtons([{
      icon: 'send',
      onPress: this.send,
    }]);

    // this.imagePicker();

  },

  send: async function(){
    // for (var i = 0; i < this.state.imageSource.length; i++) {
    //   console.warn("sdfdf",this.state.imageSource[i].uri);
    // }

    // console.warn("original,",this.state.original);
    // console.warn("current,",this.state.current);

    var temp = this.state.imageSource.map(function(image, i){
      return image.uri;
    })

    // console.warn(temp.length)
    try{
      var post = await PostAPIS.createPost(global.SESSION.user._id, {body:{
        category: "market",
        text: this.state.contentText,
        current: this.state.current,
        original: this.state.original,
        image: temp,
        subject: "",
      }});

      // if(post.message == 'send post successfully!'){
      //   ToastAndroid.show(post.message, ToastAndroid.LONG);
      // }
      if(!post.message){
        ToastAndroid.show('send post successfully!', ToastAndroid.SHORT);

        Actions.mycircle({initialPage: 2});
      }
      
      // console.log("post return", post)
    }catch(e){
      console.warn(e);
    }
    
  },

  deleteCurrentImage: function(index){
    var temp = [];
    temp = this.state.imageSource;
    temp.splice(index,1);

    this.setState({
      imageSource: temp,
    });
  },

  render() {

    if(this.state.imageSource.length < 6){
      var add = (
          <TouchableOpacity onPress={this.imagePicker}>
            <View style={styles.addImage}>
              <Icon name='camera-alt' size={60} color="#e1e1d0"/>
            </View>
          </TouchableOpacity>
        )
    }

    var rowImages = this.state.imageSource.map(function(image, i){
      return (
        <Image 
          key = {i}
          source={image}
          style={{width: (width - 50)/3, height: (width - 50)/3, marginRight: 10, marginTop: 10}} >
          <TouchableOpacity onPress={(i)=>this.deleteCurrentImage(i)}>
            <View style={{opacity: 0.8,marginLeft: (width - 50)/3 - 20, backgroundColor: "#eeeeee"}}>
              <Icon name="clear" size={20} color="#ff3300"/>
            </View>
          </TouchableOpacity>
        </Image>
      );
    }.bind(this));
   
    return (
      <ScrollView style={styles.container}>
      	<View style={{backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#eeeeee',}}>
      	<View style={styles.images}>
            {add}
            {rowImages}
        </View>
        </View>
         
        <View style={styles.details}>
        <TextInput 
          multiline={true}
          onChange={(event) => {
            this.setState({
              contentText: event.nativeEvent.text,
              contentHeight: event.nativeEvent.contentSize.height,
            });
          }}
          placeholder="Describing will be more attractive"
          underlineColorAndroid='rgba(0,0,0,0)'
          style={[styles.content,{height: Math.min(180, this.state.contentHeight)}]}/>
		</View>

		
		<View style={styles.price1}>
			<Text style={styles.name}> CURRENT PRICE </Text>
			<TextInput 
				keyboardType='number-pad'
				returnKeyType='done'
				underlineColorAndroid='rgba(0,0,0,0)'
				onChangeText={(current)=> this.setState({
					current: current,
				})}
				style={styles.input}/>
		</View>
		<View style={styles.price2}>
			<Text style={styles.name}> ORIGINAL PRICE </Text>
			<TextInput 
				keyboardType='number-pad'
				returnKeyType='done'
				underlineColorAndroid='rgba(0,0,0,0)'
				onChangeText={(original)=> this.setState({
					original: original,
				})}
				style={styles.input}/>
		</View>

      </ScrollView>
    );
  }

});

 

 

var styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginTop: 55,
    //垂直居中
    // justifyContent: 'center',
    //水平居中
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  details: {
  	borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  	backgroundColor: "white",
  	marginTop: 20,
  	height: 200,
  },

  content: {
    fontSize: 16,
    padding: 4,
    margin:10,
    color: "#123123"
  },

  price1: {
  	borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  	backgroundColor: "white",
  	marginTop: 20,
  	height: 40,
  	alignItems: 'center',
  	flexDirection: 'row',
  },

  price2: {
  	borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    backgroundColor: "white",
  	height: 40,
  	alignItems: 'center',
  	flexDirection: 'row',
  },

  name: {
  	flex: 2,
  	fontSize: 16,
  	marginLeft: 10,
  },

  input: {
  	flex: 3,
  	fontSize: 16,
    padding: 4,
  	marginLeft: 20,
  	marginRight: 10,
  	// width: 100,
  	// height: 30,
  },

  images: {
    flex:1,
    flexWrap: 'wrap',
    flexDirection: 'row',
   
    backgroundColor: 'white',
    margin: 10,
  },

  addImage:{
    width: (width - 50)/3,
    height: (width - 50)/3,
    borderWidth: 1,
    borderColor: '#e1e1d0',
    borderStyle:'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 10,
  }
});

module.exports = createSale;
