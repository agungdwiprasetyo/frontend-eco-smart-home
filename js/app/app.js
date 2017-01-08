var agungApp = angular.module('agungApp', ['ngRoute', 'ngAnimate', 'ui.knob', 'webcam', 'ui.toggle', 'chart.js', 'ui.bootstrap']);

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

// konfigurasi router
agungApp.config(function($routeProvider, $locationProvider){
    $routeProvider.when('/', {
        controller: 'HomeController',
        templateUrl: 'template/home.html'
    })
    .when('/LED', {
        controller: 'LEDController',
        templateUrl: 'template/led.html'
    })
    .when('/MotorDC', {
        controller: 'MotorDCController',
        templateUrl: 'template/motordc.html'
    })
    .when('/Servo', {
        controller: 'ServoController',
        templateUrl: 'template/servo.html'
    })
    .when('/Kamera', {
        controller: 'KameraController',
        templateUrl: 'template/kamera.html'
    })
    .when('/PenggunaanDaya', {
        controller: 'DayaController',
        templateUrl: 'template/pemakaiandaya.html'
    })
    .otherwise({
        redirectTo: '/'
    });

});

// konfigurasi controller
agungApp.controller('HomeController', function($scope) {
    $scope.pageClass = 'page-class';
});

agungApp.controller('LEDController', function($scope, $http, socket) {
    $scope.pageClass = 'page-class';
    $scope.dataPerangkat = {};
    $scope.status = {};
    $http.get('http://agungdp.agri.web.id:2016/perangkat').success(function(data){
        console.log(data);
        $scope.dataPerangkat = data;
    });

    $scope.changed = function(id, status){
        if(status){
            status=1;
        }else{
            status=0;
        }
        socket.emit('kendaliPerangkat', [parseInt(id), parseInt(status)]);
        var sendData = {'id_perangkat':id,'status':status};
        console.log($.param(sendData));
        $http({
            method  : 'PUT',
            url     : 'http://agungdp.agri.web.id:2016/perangkat',
            data    : $.param(sendData),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
            console.log(data);
        }).error(function(e){
            alert(':(');
        });
    };

    $scope.knobData = [
        {
            value: 100,
            options: {
                fgColor: '#66CC66',
                angleOffset: -125,
                angleArc: 250
            }
        },
        {
            value: 100,
            options: {
                fgColor: '#66CC66',
                angleOffset: -125,
                angleArc: 250
            }
        }
    ];

    $scope.data = 20;
    $scope.options = {
        width: 75,
        fgColor: "#ffec03",
        skin: "tron",
        thickness: .2,
        displayPrevious: true
    }

    $scope.getVal = function(val){
        alert(val);
    };

    $scope.formatOptions = function(data) {
        data.formattedOptions = JSON.stringify(data.options).replace(/,/g,"\n");
        return data;
    };
});

agungApp.controller('MotorDCController', function($scope, $http){
    $scope.pageClass = 'page-class';
    $scope.knobData = [
        {
            value: 100,
            options: {
                fgColor: '#222222',
                angleOffset: -125,
                angleArc: 250
            }
        }
    ];

    $scope.status = 1;
    $scope.changed = function(){
        // alert('click');
    };
});

agungApp.controller('ServoController', function($scope){
    $scope.pageClass = 'page-class';
});

agungApp.controller('KameraController', function($scope){
    $scope.pageClass = 'page-class';
    $scope.setting = {
        videoHeight: 800,
        videoWidth: 600,
        video: null
    };
});

agungApp.controller('DayaController', function ($scope) {
    $scope.pageClass = 'page-class';
    $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    $scope.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.colors = [
      {
        backgroundColor: 'rgba(148,159,177,0.2)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointHoverBackgroundColor: 'rgba(148,159,177,1)',
        borderColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      },
      {
        backgroundColor: 'rgba(77,83,96,0.2)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointHoverBackgroundColor: 'rgba(77,83,96,1)',
        borderColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,0.8)'
      }
    ];
    $scope.options = { legend: { display: false } };
});