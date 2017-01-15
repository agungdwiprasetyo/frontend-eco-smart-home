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

// cek koneksi internet
agungApp.run(function($window, $rootScope) {
      $rootScope.online = navigator.onLine;
      $window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
          $rootScope.online = false;
        });
      }, false);

      $window.addEventListener("online", function() {
        $rootScope.$apply(function() {
          $rootScope.online = true;
        });
      }, false);
});