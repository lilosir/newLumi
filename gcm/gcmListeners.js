var GcmAndroid = require('react-native-gcm-android');
import Notification from 'react-native-system-notification';
var React = require('react-native');
var {
  DeviceEventEmitter,
} = React;

var GCM = {

  register: function() {
      GcmAndroid.addEventListener('register', function(token){
          console.log('send gcm token to server', token);
      });

      GcmAndroid.requestPermissions();
  },

  registerError: function() {
      GcmAndroid.addEventListener('registerError', function(error){
          console.log('registerError', error.message);
      });
  },

  notification: function()  {
      GcmAndroid.addEventListener('notification', function(notification){
          console.log('receive gcm notification', notification);
          var info = JSON.parse(notification.data.info);
          if (!GcmAndroid.isInForeground) {
              Notification.create({
                  subject: info.subject,
                  message: info.message,
              });
          }
      });
  },

  sysNotificationClick: function () {
      React.DeviceEventEmitter.addListener('sysNotificationClick', function(e) {
          console.log('sysNotificationClick', e);
      });
  },

  requestPermissions: function() {
      GcmAndroid.requestPermissions();
  },

};

module.exports = GCM;


