var apis = require('../apis');

var Notifications = {

  getnotifications: function(id, params){
    return apis.asyncFetch(apis.BASE_URL + '/notifications/getnotifications/'+ id, Object.assign({
      method: 'GET'
    }, params));
  }, 

  changeToRead: function(id, params){
    return apis.asyncFetch(apis.BASE_URL + '/notifications/changeToRead/'+ id, Object.assign({
      method: 'POST'
    }, params));
  }, 
}

module.exports = Notifications;