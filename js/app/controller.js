var contr = angular.module('agungController',[]);

contr.controller('HomeController', function($scope) {
    $scope.pageClass = 'page-class';
});

contr.controller('DayaController', function ($scope) {
    $scope.pageClass = 'page-class';
    $scope.series = ['PLN', 'Panel Surya']
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
    $scope.options = { legend: { display: true } };
});

contr.controller('PanelSuryaController', function ($scope, $interval) {
    $scope.pageClass = 'page-class';
    $scope.options = {
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            max: 125,
            min: -125,
            stepSize: 10
          }
        }],
        yAxes: [{
          display: false,
          ticks: {
            max: 125,
            min: -125,
            stepSize: 10
          }
        }]
      }
    };

    createChart();
    $interval(createChart, 5000);

    function createChart () {
      $scope.data = [];
      for (var i = 0; i < 50; i++) {
        $scope.data.push([{
          x: randomScalingFactor(),
          y: randomScalingFactor(),
          r: randomRadius()
        }]);
      }
    }

    function randomScalingFactor () {
      return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
    }

    function randomRadius () {
      return Math.abs(randomScalingFactor()) / 4;
    }
});

contr.controller('LingkunganController', function ($scope, $interval, socket) {
    $scope.pageClass = 'page-class';
    $scope.labels = ['06.00', '07.00', '08.00', '09.00', '10.00', '11.00', '12.00'];
    $scope.dataSuhu = [0,0,0,0,0,0,0,0];
    $scope.dataKelembaban = [0,0,0,0,0,0,0,0];

    $scope.colorSuhu = [
      {
        backgroundColor: 'rgba(150,159,177,0.2)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointHoverBackgroundColor: 'rgba(148,159,177,1)',
        borderColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      }
    ];
    $scope.colorKelembaban = [
      {
        backgroundColor: 'rgba(0,0,177,0.2)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointHoverBackgroundColor: 'rgba(148,159,177,1)',
        borderColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      }
    ];
    $scope.options = { legend: { display: false } };

    // menunggu data secara realtime melalui socket.io
    socket.on('kendaliPerangkat', function (data) {
        console.log(data);
        // tampilkan data dari socket ke grafik kelembaban
        $scope.dataKelembaban.shift();
        $scope.dataKelembaban.push(data);
        $scope.showKel = data;
    });

    // sementara masih random
    mulaiRandom();
    $interval(mulaiRandom,2000);
    function mulaiRandom(){
        var x = (Math.random() > 0.5 ? 1.0 : 0.5) * Math.round(Math.random() * 100);
        var y = (Math.random() > 0.5 ? 1.0 : 0.5) * Math.round(Math.random() * 50);
        $scope.dataSuhu.shift();
        $scope.dataSuhu.push(x);
        $scope.showSuhu = x;
        $scope.dataKelembaban.shift();
        $scope.dataKelembaban.push(y);
        $scope.showKel = y;
    }
});

contr.controller('LEDController', function($scope, $http, socket) {
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
            nama: 'LED 1',
            options: {
                fgColor: '#66CC66',
                angleOffset: -125,
                angleArc: 250
            }
        },
        {
            value: 100,
            nama: 'LED 2',
            options: {
                fgColor: '#66CC66',
                angleOffset: -125,
                angleArc: 250
            }
        },
        {
            value: 100,
            nama: 'LED 3',
            options: {
                fgColor: '#66CC66',
                angleOffset: -125,
                angleArc: 250
            }
        },
        {
            value: 100,
            nama: 'LED 4',
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

contr.controller('MotorDCController', function($scope, $http){
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

contr.controller('ServoController', function($scope){
    $scope.pageClass = 'page-class';
    $scope.knobData = [
        {
            nama: 'Servo 1',
            value: 90,
            options: {
                angleOffset: 90,
                linecap: 'round'
            }
        },
        {
            nama: 'Servo 2',
            value: 80,
            options: {
                angleOffset: 90,
                linecap: 'round'
            }
        },
        {
            nama: 'Servo 3',
            value: 100,
            options: {
                angleOffset: 90,
                linecap: 'round'
            }
        },
        {
            nama: 'Servo 4',
            value: 70,
            options: {
                angleOffset: 90,
                linecap: 'round'
            }
        }
    ];
});

contr.controller('KameraController', function($scope){
    $scope.pageClass = 'page-class';
    $scope.setting = {
        videoHeight: 800,
        videoWidth: 600,
        video: null
    };
});