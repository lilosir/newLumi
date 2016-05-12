
var APIS = require('./apis');

// convert json to json string
APIS.addBeforeActions(function (params) {

  if (params.options && params.options.body && typeof params.options.body !== 'string') {
    params.options.body = JSON.stringify(params.options.body);
  }

  return params;

});

// add headers
APIS.addBeforeActions(function (params) {

  var session_token;
  
  if(!global.SESSION){
    session_token = "";    
    params.options.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }else{
    console.log("before action global.SESSION",global.SESSION.session_token);
    session_token = global.SESSION.session_token;
    params.options.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'SESSION-TOKEN': session_token,
    }
  } 

  console.log(params);

  // if (session && session.session_token)
  //   params.options.headers.session_token = session.session_token;

  return params;

});

// url = "nimama.com"
// query= {
//   from: "ding",
//   to: "wfew + fwefjwe"
// }

// wfwet0 = encodeURIComponent(to);

// url = "nimama.com?from=ding&to=fwljefweufo"

//add query conditions to url
APIS.addBeforeActions(function (params) {

  params.url = params.url + "?";
  var query = params.options.query;

  for (var item in query) {
    if (query.hasOwnProperty(item)) {
      params.url = params.url + item +"=" + encodeURIComponent(query[item]) +"&";
    }
  }

  params.url = params.url.slice(0,-1);
  console.log('params.url',params.url);
  return params;
});