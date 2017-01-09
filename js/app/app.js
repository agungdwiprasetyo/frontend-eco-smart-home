var agungApp = angular
.module('agungApp', [
    'ngRoute', 
    'agungRoute', 
    'agungController', 
    'ngAnimate', 
    'ui.knob', 
    'webcam', 
    'ui.toggle', 
    'chart.js', 
    'ui.bootstrap']);

// konfigurasi socket.io
agungApp.factory('socket', ['$rootScope', function($rootScope) {
  var socket = io.connect();

  return {
    on: function(eventName, callback){
      socket.on(eventName, callback);
    },
    emit: function(eventName, data) {
      socket.emit(eventName, data);
    }
  };
}]);