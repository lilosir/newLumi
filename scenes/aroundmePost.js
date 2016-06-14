'use strict';

var React = require('react-native');
var nav = require('../NavbarMixin');
var {Actions} = require('react-native-router-flux');
var {Avatar, List, Subheader, IconToggle, Icon} = require('react-native-material-design');
var apis = require('../apis');
var UserAPIS = require('../operations/users');
var PostAPIS = require('../operations/posts');

var {
	View,
	Text,
	StyleSheet, 
	Image,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	TextInput,
	DeviceEventEmitter,
	showInput,
	ToastAndroid
} = React;

var {height, width} = Dimensions.get('window');
var Left = width - 40;
var Top = height - 110;

var AroundMePost = React.createClass({

	mixins: [nav],

	getInitialState: function() {
		return {
			subject: null,
			contents: null,
			nickname: null,
			avatar: null,
			image: null,
			comments:[],
			visibleHeight: height,	
			showInput: false,
			myComment:'',
			mycommentHeight: 30,
		};
	},

	componentDidMount: function() {
		this.setLeftButtons([{
	      icon: 'arrow-back',
	      onPress: Actions.pop
	    }]);

	    this.setTitleView(" ");

		this.getThisPost();

	},


	getThisPost: async function(){

		try{
			var post = await PostAPIS.getPosts({query:{id: this.props.id}});

			var img;
			if(post.body.image.length != 0){
				img = post.body.image[0].uri;
			}

			var comments = [];
			if(post.comments.length > 0){
				comments = post.comments.map(function(item,i){
					return {
						avatar: apis.BASE_URL + '/' + item.by.avatar,
						nickname: item.by.nickname,
						text:item.content,
					}
				})
			}

			this.setState({
				subject: post.body.subject,
				contents: post.body.text,
				nickname: post.user.nickname,
				avatar: apis.BASE_URL + '/' + post.user.avatar,
				image: img,
				comments: comments,
				// comments: this.getIComments(),
			});


		}catch(e){
			console.warn(e)
		}
		
	},

	getIComments: function(){
		return [
			{	
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "kk",
				text:'good!',
			},
			{	
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "12312",
				text:'wow!',
			},
			{	
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "OL",
				text:'goodsdfsdfttttttttttiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiisdfsdfttttttttttiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii',
			},
			{	
				avatar: apis.BASE_URL + '/' + 'images/default_avatar.png',
				nickname: "123",
				text:'sdfsdfttttttttttiiiiiiiiiiiiiiiiiiii!',
			},
		];
	},

	goComment: function(){
		if(this.state.showInput){
			this.setState({
				showInput: false,
			});
		}else{
			this.setState({
				showInput: true,
			});
			if(this.state.showInput){
				this.refs.comments.focus();
			}
		}
	},

	submitComment:async function(id){

		try{
			var comment = await PostAPIS.submitComment(global.SESSION.user._id, {
				body:{
					postId: id,
					comment: this.state.myComment,
				}
			})

			if(comment.message == 'comment successfully'){
				ToastAndroid.show('send post successfully!', ToastAndroid.SHORT);
			}

			this.getThisPost();
			this.refs.comments.clear();
			this.setState({
				showInput: false,
			});
			this.scrollTo("bottom");
			
		}catch(e){
			console.warn(e)
		}
	},

	scrollTo: function(position){
		let innerScrollView = this._scrollView.refs.InnerScrollView;
        let scrollView = this._scrollView.refs.ScrollView;

        requestAnimationFrame(() => {
            innerScrollView.measure((innerScrollViewX, innerScrollViewY, innerScrollViewWidth, innerScrollViewHeight) => {
                scrollView.measure((scrollViewX, scrollViewY, scrollViewWidth, scrollViewHeight) => {
                    var scrollTo = innerScrollViewHeight - scrollViewHeight + innerScrollViewY;

                    if (innerScrollViewHeight < scrollViewHeight) {
                        return;
                    }
                    if(position == 'bottom')
                    // scroll to bottom
                    this._scrollView.scrollTo({y:scrollTo});

                    if(position == 'top')
                    // scroll to top
                    this._scrollView.scrollTo({y:0});
                });
            });
        });
	},

	render: function() {
		var showInput;
		if(this.state.showInput){
			showInput = (
				<View style={{
					backgroundColor: "#e6e6ff", 
					flexDirection: 'row',
					alignItems:'flex-end',}}>
					<View style={{flex:4, backgroundColor:"#ffffff",
								  margin:10,borderRadius:1}}>
						<TextInput 
							multiline={true}
							ref="comments"
							underlineColorAndroid='rgba(0,0,0,0)'
							keyboardType='numbers-and-punctuation'
							onChange={(event) => {
							            this.setState({
							              myComment: event.nativeEvent.text,
							              mycommentHeight: event.nativeEvent.contentSize.height,
							            });
							          }}
							style={{padding: 4, fontSize: 18, height: Math.min(70, this.state.mycommentHeight)}}/>
					</View>
					<TouchableOpacity onPress={()=> (this.submitComment(this.props.id))}>
	                    <View style={styles.reply}>
	                      <Text style={styles.replyText}> Reply </Text>
	                    </View>
	                </TouchableOpacity>
				</View>
				)
		}
		return (
			<View style={{flex:1}}>
			<ScrollView 
				ref={(component) => this._scrollView = component}
				style={styles.container}>
				<View style={styles.title}>
					<Text style={styles.titleText}> {this.state.subject} </Text>
				</View>
				<View style={styles.author}>
					<View>
	    				<Avatar image={<Image source={{ uri: this.state.avatar }} />} size={30}/>
	    			</View>
	    			<View style={{marginLeft: 10}}>
	    				<Text> {this.state.nickname}</Text>
	    			</View>
				</View>
				<View style={styles.contents}>
    				<Text style={styles.contentsText}> {this.state.contents} </Text>
	    		</View>
	    		<View style={styles.imageContainer}>
	    			<Image 
		    			style={styles.image}
		    			source={{uri: this.state.image}}/>
		    	</View>

		    	<View style={styles.commentbar}>
		    		<View style={{marginRight: 40}}>
		    			<Icon size={20} name="thumb-up"/>
		    		</View>
		    		<TouchableOpacity onPress={this.goComment}>
			    		<View style={{marginRight: 20}}>
			    			<Icon size={20} name="textsms"/>
			    		</View>
			    	</TouchableOpacity>
		    	</View>

		    	<View style={styles.commentsText}>
		    		<View style={{marginLeft: 10}}>
			    		<Text style={{color: 'black', fontSize: 16}}> {this.state.comments.length} comments </Text>
			    	</View>
		    	</View>

		    	{this.state.comments.map((item,i)=>(
        		<View style={{flexDirection: 'row', borderBottomWidth:0.5, borderBottomColor: "#dddddd",}} key={i}>
        			<View style={{flex: 1, alignItems: 'center', marginTop: 5}}>
		        		<Avatar image={<Image source={{ uri: item.avatar }} />} size={35}/>
		        	</View>
		        	<View style={{flex: 4, flexDirection:'column', justifyContent:'center'}}>
		        		<View style={{marginTop: 5, height: 18}}>
		        			<Text style={{fontSize: 14, color: 'black',fontWeight: 'bold',}}> {item.nickname} </Text>
		        		</View>
		        		<View style={{marginTop: 5, marginRight: 10, marginBottom: 10}}>
		        			<Text style={{fontSize: 14, color: 'black'}}> {item.text} </Text>
		        		</View>
		        	</View>
		        </View>			
		        ))}
		        
			</ScrollView>
			{showInput}
			<View style={styles.goUp}>
			<TouchableOpacity onPress={()=>this.scrollTo('top')}>
				<View style={{flex:1}}>
					<Icon name="publish" color="#f4cb0d"/>
				</View>
			</TouchableOpacity>
			</View>
			</View>
		
		);
	}

});

var styles = StyleSheet.create({
	container:{
		marginTop: 55,
		backgroundColor: '#f5f5ef'
	},

	goUp: {
	  	position: 'absolute',
	  	width: 30,
	    height: 30,
	    backgroundColor: '#00437a',
	    justifyContent: 'center', 
	  	alignItems: 'center',
	  	alignSelf: 'center',
	    opacity: 0.8,
	    left: Left,
	    top: Top,
	},

	title: {
		margin:10,
	},

	titleText: {
		fontWeight: '100',
	  	fontSize: 26,
	  	color: 'black',
	},

	author: {
		alignItems: "center",
		margin: 10,
		flexDirection: 'row'
	},

	contents: {
		margin: 10,
		alignItems: 'stretch',
	},

	contentsText: {
		color: 'black',
		lineHeight: 20,
	},

	imageContainer: {
		margin: 10,
	},

	image: {
		// width: 300,
		height: 200,
	    backgroundColor: 'transparent',
  	},

  	commentbar: {
  		flexDirection: 'row',
  		height: 30,
		justifyContent: 'center',
		alignSelf : 'flex-end',
  	},

  	commentsText: {
  		height: 40,
  		justifyContent: 'center',
  		borderTopWidth:2, 
		borderTopColor: "#eeeeee",
		borderBottomWidth:2,
	    borderBottomColor: "#eeeeee",
  	},

  	reply: {
	    flex: 1,
	    borderRadius: 5,
	    backgroundColor: '#008ae6',
	    alignItems : 'center',
	    justifyContent: 'center',
	    width: 40,
	    height: 30,
	    marginRight: 10,
	    marginBottom:10,
	},

    replyText: {
	    color: "white",
	    fontSize: 14,
	},

});

module.exports = AroundMePost;