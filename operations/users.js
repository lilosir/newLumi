var apis = require('../apis');

var Users = {
  all: function(params){
    return apis.asyncFetch(apis.BASE_URL + '/users', Object.assign({
      method: 'GET'
    }, params));
  },

  myself: function(id, params){
    return apis.asyncFetch(apis.BASE_URL + '/users/myself/'+ id, Object.assign({
      method: 'GET'
    }, params));
  },

  create: function(params) {
    return apis.asyncFetch(apis.BASE_URL + '/users', Object.assign({
      method: 'POST'
    }, params));
  },

  login: function(params) {
    return apis.asyncFetch(apis.BASE_URL + '/users/login', Object.assign({
      method: 'POST'
    }, params));
  },

  getFriends: function(id, params){
    return apis.asyncFetch(apis.BASE_URL + '/users/userfriends/'+ id, Object.assign({
      method: 'GET'
    }), params);
  },

  searchFriends: function(params){
    return apis.asyncFetch(apis.BASE_URL + '/users/searchFriends', Object.assign({
      method: 'GET'
    }, params));
  },

  updateRecent: function(id, params){
    return apis.asyncFetch(apis.BASE_URL + '/users/updateRecent/' + id, Object.assign({
      method: 'POST'
    }, params));
  },

  getRecent: function(id, params){
    return apis.asyncFetch(apis.BASE_URL + '/users/getRecent/' + id, Object.assign({
      method: 'GET'
    }, params));
  },

  queryOne: function(params){
    return apis.asyncFetch(apis.BASE_URL + '/users/getOne', Object.assign({
      method: 'GET'
    }, params));
  },

  isFriend: function(params){
    return apis.asyncFetch(apis.BASE_URL + '/users/isFriend', Object.assign({
      method: 'GET'
    }, params));
  },

  addFriendRequest: function(id, params){
    return apis.asyncFetch(apis.BASE_URL + '/users/addFriendRequest/' + id, Object.assign({
      method: 'POST'
    }, params));
  },

  addFriend: function(id, params){
    return apis.asyncFetch(apis.BASE_URL + '/users/addFriend/' + id, Object.assign({
      method: 'POST'
    }, params));
  },
}

module.exports = Users;