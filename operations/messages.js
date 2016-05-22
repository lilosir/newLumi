var apis = require('../apis');

var Messages = {

  // getEarlierMessages: function(params){
  //   return apis.asyncFetch(apis.BASE_URL + '/messages', Object.assign({
  //     method: 'GET'
  //   }, params));
  // }, 

  register: function(params){
    return apis.asyncFetch(apis.BASE_URL+ '/messages/register', Object.assign(
    {
      method: 'POST'
    }, params));
  }, 

  sendMessages: function(id, params){
    return apis.asyncFetch(apis.BASE_URL + '/messages/sendMessages/' + id, Object.assign({
      method: 'POST'
    }, params));
  }
}

module.exports = Messages;