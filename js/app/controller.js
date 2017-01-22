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
    var maximum = 300;
    $scope.dataAmpere = [[]];
    $scope.dataVolt = [[]];

    $scope.labels = [];
    $scope.options = {
      animation: {
        duration: 0
      },
      elements: {
        line: {
          borderWidth: 3
        },
        point: {
          radius: 0
        }
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: true
        }],
        gridLines: {
          display: false
        }
      },
      tooltips: {
        enabled: false
      }
    };

    $interval(function () {
      getLiveChartData();
    }, 1000);

    function getLiveChartData () {
      if ($scope.dataAmpere[0].length) {
        $scope.labels = $scope.labels.slice(1);
        $scope.dataAmpere[0] = $scope.dataAmpere[0].slice(1);
        $scope.dataVolt[0] = $scope.dataVolt[0].slice(1);
      }

      while ($scope.dataAmpere[0].length < maximum) {
        $scope.labels.push('');
        var A = getRandomValue($scope.dataAmpere[0]);
        var V = getRandomValue($scope.dataVolt[0]);
        $scope.showA = A;
        $scope.showV = V;
        $scope.dataAmpere[0].push(A);
        $scope.dataVolt[0].push(V);
      }
    }
    function getRandomValue(data) {
        var l = data.length, previous = l ? data[l - 1] : 50;
        var y = previous + Math.random() * 10 - 5;
        return y < 0 ? 0 : y > 100 ? 100 : y;
    }
});

contr.controller('LingkunganController', function ($scope, $interval, socket) {
    $scope.pageClass = 'page-class';

    $scope.statusPerangkat = false;
    var maximum = 120;
    $scope.dataSuhu = [[]];
    $scope.dataKelembaban = [[]];

    $scope.labels = [];
    $scope.colorSuhu = [
      {
        backgroundColor: 'rgba(255,127,127,0.2)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointHoverBackgroundColor: 'rgba(148,159,177,1)',
        borderColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      }
    ];
    $scope.colorKelembaban = [
      {
        backgroundColor: 'rgba(127,255,127,0.4)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointHoverBackgroundColor: 'rgba(148,159,177,1)',
        borderColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      }
    ];

    $scope.options = {
      animation: {
        duration: 0
      },
      elements: {
        line: {
          borderWidth: 2
        },
        point: {
          radius: 0
        }
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: true
        }],
        gridLines: {
          display: false
        }
      },
      tooltips: {
        enabled: false
      }
    };

    $interval(function(){
        while ($scope.dataSuhu[0].length < maximum) {
            $scope.labels.push('');
            var T = 0;
            var H = 0;
            $scope.showT = parseInt(T);
            $scope.showH = parseInt(H);
            $scope.dataSuhu[0].push(T);
            $scope.dataKelembaban[0].push(H);
          }
    },10);

    // menunggu data secara realtime melalui socket.io dari server
    socket.on('monitoringPerangkat', function (data) {
        $scope.statusPerangkat = true;
        console.log(data);
        // tampilkan data dari socket ke grafik pada halaman monitoring lingkungan
        mulai(data[0], data[1]);
    });

    function mulai(T, H) {
      if ($scope.dataSuhu[0].length) {
        $scope.labels = $scope.labels.slice(1);
        $scope.dataSuhu[0] = $scope.dataSuhu[0].slice(1);
        $scope.dataKelembaban[0] = $scope.dataKelembaban[0].slice(1);
      }

      while ($scope.dataSuhu[0].length < maximum) {
        $scope.labels.push('');
        $scope.showT = parseInt(T);
        $scope.showH = parseInt(H);
        $scope.dataSuhu[0].push(T);
        $scope.dataKelembaban[0].push(H);
      }
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
            nama: 'LED 6',
            options: {
                fgColor: '#66CC66',
                angleOffset: -125,
                angleArc: 250
            }
        },
        {
            value: 100,
            nama: 'LED 7',
            options: {
                fgColor: '#66CC66',
                angleOffset: -125,
                angleArc: 250
            }
        },
        {
            value: 100,
            nama: 'LED 8',
            options: {
                fgColor: '#66CC66',
                angleOffset: -125,
                angleArc: 250
            }
        },
        {
            value: 100,
            nama: 'LED 9',
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
    $scope.raspiStatus = false;
    $scope.setting = {
        videoHeight: 800,
        videoWidth: 600,
        video: null
    };
});