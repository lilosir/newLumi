
//Must specifiy 'jsonp: false' since react native doesn't provide the dom
//and thus wouldn't support creating an iframe/script tag
this.socket = io(apis.BASE_URL,{jsonp: false});

try{

    var username = await AsyncStorage.getItem("username");
    this.username = username;
    // console.warn(username);
    // let username = await AsyncStorage.getItem("username");
    if(username !== null){
      this.from = this.username.split("@lakeheadu.ca")[0]; 
      this.socket.emit('init', this.from);       
      // console.warn("local username:",from);
    }else{
      console.warn("no username");
      Actions.login();
    }  
  }
  catch(e){
    console.warn("Get local username error:",e);
    Actions.login();
  }