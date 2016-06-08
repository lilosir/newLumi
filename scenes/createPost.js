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
} = React;

var nav  = require('../NavbarMixin');
var {height, width} = Dimensions.get('window');
var {Avatar, List, Subheader, IconToggle, Icon, Button} = require('react-native-material-design');
var ImagePickerManager = require('NativeModules').ImagePickerManager;

var CreatePost = React.createClass({

  mixins: [nav],

  getInitialState: function() {
    return {
      subjectText: '',
      subjectHeight: 0,
      contentText: '',
      contentHeight: 0,
      avatarSource:'',
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
      aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      quality: 0.2, // 0 to 1, photos only
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
        // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        // // uri (on iOS)
        // const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        // uri (on android)
        const source = {uri: response.uri, isStatic: true};

        this.setState({
          avatarSource: source,
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

  send: function(){
    console.warn(this.state.avatarSource.uri);
  },

  render() {
   
    return (
      <View style={styles.container}>
        <View style={styles.subject}>
          <TextInput 
            multiline={true}
            onChange={(event) => {
              this.setState({
                text: event.nativeEvent.text,
                height: event.nativeEvent.contentSize.height,
              });
            }}
            placeholder="Subject"
            underlineColorAndroid='rgba(0,0,0,0)'
            style={[styles.subject2, {height: Math.max(40, this.state.height)}]}/>
          
          <View style={{marginTop: 20, marginBottom: 20, height: 2, backgroundColor: '#e1e1d0'}}/>
          
          <TextInput 
            multiline={true}
            onChange={(event) => {
              this.setState({
                contentText: event.nativeEvent.text,
                contentHeight: event.nativeEvent.contentSize.height,
              });
            }}
            placeholder="What's on your mind?"
            underlineColorAndroid='rgba(0,0,0,0)'
            style={[styles.content, {height: Math.max(40, this.state.contentHeight)}]}/>

            <TouchableOpacity onPress={this.imagePicker}>
              <View style={styles.images}>
                <View style={styles.addImage}>
                  <Icon name='add' size={60} color="#e1e1d0"/>
                </View>
                <View style={styles.addImage}>
                  <Image source={this.state.avatarSource} style={{width: 50, height: 50}} />
                </View>
              </View>
            </TouchableOpacity>

            
        </View>
        
      </View>
    );
  }

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 55,
    //垂直居中
    // justifyContent: 'center',
    //水平居中
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  subject:{
    margin: 10,
  },

  subject2: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    padding: 4,
  },

  content: {
    flex: 1,
    fontSize: 14,
    padding: 4,
  },

  images: {
    flexDirection: 'row',
    marginTop: 10,
  },

  addImage:{
    width: (width - 40)/3,
    height: (width - 40)/3,
    borderWidth: 1,
    borderColor: '#e1e1d0',
    borderStyle :'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  }
});

module.exports = CreatePost;
