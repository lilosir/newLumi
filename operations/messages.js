var apis = require('../apis');

var Messages = {

  getEarlierMessages: function(params){
    return apis.asyncFetch(apis.BASE_URL + '/messages', Object.assign({
      method: 'GET'
    }, params));
  },

  sendGCMToken: function(params){
    return apis.asyncFetch(apis.BASE_URL + '/messages/register', Object.assign({
      method: 'POST'
    }, params));
  }
}

module.exports = Messages;