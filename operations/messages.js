var apis = require('../apis');

var Messages = {

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
  },

  getEarlierMessages: function(params){
    return apis.asyncFetch(apis.BASE_URL + '/messages/getEarlierMessages', Object.assign({
      method: 'GET'
    }, params));
  },

  storeMessages: function(id, params){
    return apis.asyncFetch(apis.BASE_URL + '/messages/storeMessages/' + id, Object.assign({
      method: 'POST'
    }, params));
  },
}

module.exports = Messages;