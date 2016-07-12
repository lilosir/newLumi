var apis = require('../apis');

var Courses = {

  updateclasses: function(id, params){
  	console.log("id ---------------------", id)
  	console.log("params ---------------------", params)
    return apis.asyncFetch(apis.BASE_URL+ '/classes/updateclasses/'+ id, Object.assign(
    {
      method: 'POST'
    }, params));
  }, 
}

module.exports = Courses;