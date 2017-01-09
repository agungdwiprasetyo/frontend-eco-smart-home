angular.module('agungRoute',[]).config(function($routeProvider){
    $routeProvider.when('/', {
        controller: 'HomeController',
        templateUrl: 'template/home.html'
    })
    .when('/PenggunaanDaya', {
        controller: 'DayaController',
        templateUrl: 'template/pemakaiandaya.html'
    })
    .when('/PanelSurya', {
        controller: 'PanelSuryaController',
        templateUrl: 'template/panelsurya.html'
    })
    .when('/MonitoringLingkungan', {
        controller: 'LingkunganController',
        templateUrl: 'template/lingkungan.html'
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
    .otherwise({
        redirectTo: '/'
    });
});