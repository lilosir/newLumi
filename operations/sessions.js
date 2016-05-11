var apis = require('../apis');

var Sessions = {

  getExpireTime: function(params){
    return apis.asyncFetch(apis.BASE_URL + '/sessions', Object.assign({
      method: 'POST'
    }, params));
  },
}

module.exports = Sessions;