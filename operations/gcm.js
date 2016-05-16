var apis = require('../apis');

var Gcm = {

	register: function(params){
		return apis.asyncFetch(apis.BASE_URL+ '/gcm/register', Object.assign(
		{
			method: 'POST'
		}, params));
	},
}

module.exports = Gcm;  