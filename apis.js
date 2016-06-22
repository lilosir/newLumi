// var BASE_URL = 'http://10.100.27.230:3100';
var BASE_URL = 'http://192.168.0.133:3100';
// var Users = require('./operations/users');
var beforeActions = [];
var afterActions = [];

var asyncFetch = async function(url, options) {

    try {
        var finalParams = {
            url: url,
            options: options,
        };

        for(let i = 0; i < beforeActions.length; i++) {
            finalParams = await beforeActions[i](finalParams);
        }

        // beforeActions.forEach(function(beforeaction) {
        //     finalParams = beforeaction(finalParams);
        // });

        let response = await fetch(finalParams.url, finalParams.options);

        response.options = finalParams;

        var finalResponse = response;

        for(let i = 0; i < afterActions.length; i++) {
            finalResponse = await afterActions[i](finalResponse);
        }

        // finalResponse = await afterActions.reduce(async function(res, afteraction) {
        //     return await afteraction(await res);
        // }, finalResponse);


        // afterActions.forEach(function (afteraction) {
        //   finalResponse = afteraction(response);
        // });

        return finalResponse;

    } catch (e) {
        return Promise.reject(e);
    }
};

module.exports = {

    addBeforeActions: function(cb) {
        beforeActions.push(cb);
    },

    addAfterActions: function(cb) {
        afterActions.push(cb);
    },

    asyncFetch: asyncFetch,

    BASE_URL: BASE_URL,
};