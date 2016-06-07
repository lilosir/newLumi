'user strict'

var React = require('react-native');
var Dimensions = require('Dimensions');
var {Avatar, List} = require('react-native-material-design');
var UserAPIS = require('../operations/users');
var apis = require('../apis');
var {Actions} = require('react-native-router-flux');

var {
      width,
      height,
    } = Dimensions.get('window');

var {
	StyleSheet,
	View,
	TextInput,
	ScrollView,
	TouchableOpacity,
	Image,
} = React;

var searchFriends = React.createClass({

	componentDidUpdate() {
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
    },
	
	getInitialState: function() {
		return {
			text: null, 
			finding: [],
		};
	},

	changeText: async function(value){
		try{
			if(!value || value.length === 0){
				this.setState({finding:[]});
			}
			else{
				var friends = await UserAPIS.searchFriends({
					query:{
						name: value,
					}
				});
				
				var fri = friends.map(function(item) {
	        		return {"nickname":item.nickname, "status":item.status, "avatar":apis.BASE_URL+"/"+item.avatar, "id": item._id}});

				this.setState({finding: fri});
			}
		}catch(e){
			console.warn(e);
		}

	},

	click: function(value){
		// console.warn(value);
		Actions.profile({id:value})
	},

	render: function() {

		return (
			<View style={styles.container}>
				<View style={styles.bg1}>
					<View style={styles.bg2}>
						<TextInput
						    style={styles.textInput}
						    onChangeText={this.changeText}
						    value={this.state.text}			    
						    placeholder={"Search for users..."}
						    underlineColorAndroid={"#ffffff"}/>
					</View>
				</View>
					<ScrollView 
						ref={(component) => this._scrollView = component}
						style={{backgroundColor: '#ffffff',}}>

				        {this.state.finding.map((item,i)=>(

				        <View style={{borderBottomWidth:0.5, borderBottomColor: "#eeeeee",}}  key={i}>
				            <TouchableOpacity onPress={() => this.click(item.id)}>					                      	  
						        <List            
						          primaryText={item.nickname}
						          secondaryText={item.status}
						          leftAvatar={<Avatar image={<Image source={{ uri: item.avatar }} />} />}/>
					         </TouchableOpacity>
				        </View>
				        ))}
				  
				    </ScrollView>
			</View>
		);
	}

});

var styles = StyleSheet.create({

	container: {
		flex: 1,
		flexDirection: 'column',
	    backgroundColor: 'white',
	},

	bg1: {
		backgroundColor: '#f5f5f0',
	},

	bg2: {
		backgroundColor: 'white',
		margin: 10,
		borderRadius: 5,
	},

	textInput: {
		height: 40, 
		// fontSize: 30,
		// borderColor: '#ffffff', 
		borderWidth: 1,
	},
});

module.exports = searchFriends;