var apis = require('../apis');

var Notifications = {

  getnotifications: function(id, params){
    return apis.asyncFetch(apis.BASE_URL + '/notifications/getnotifications/'+ id, Object.assign({
      method: 'GET'
    }, params));
  }, 
}

module.exports = Notifications;