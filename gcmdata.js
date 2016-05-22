// observer design model
module.exports = {
	// messages
	messages: [],
	// add message
	addMessage: function(msg) {
		this.messages.push(msg);
		this.subscribers.forEach(function(fun) {
			fun(msg);
		});
	},
	getMessages: function() {
		return this.messages;
	},

	subscribe: function(s) {
		this.subscribers.push(s);
	},
	// list of functions
	subscribers: []
}