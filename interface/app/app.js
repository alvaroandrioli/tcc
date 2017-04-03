angular.module('controlBenchApp', ['btford.socket-io', 'plotly'])
    .controller('mainController', function($scope, $http, socket) {
        $scope.data = [{
            'x': [0],
            'y': [0],
            mode: 'lines+markers',
            name: 'Data 1',
            line: {shape: 'spline'},
            type: 'scatter'
          }, {
            'x': [0],
            'y': [0],
            mode: 'lines+markers',
            name: 'Data 2',
            line: {shape: 'spline'},
            type: 'scatter'
          }, {
            'x': [0],
            'y': [0],
            mode: 'lines+markers',
            name: 'Erro',
            line: {shape: 'spline'},
            type: 'scatter'
          }
        ];

        $scope.layout = {
            height: 400,
            width: 711,
            title: 'RealTimePlot'
        };

        $scope.plotConfig = {
            showLink: false,
            displayLogo: false
        };

        socket.on('SERIAL.EMIT_DATA', function(data) {
            // $scope.response = data;
            var dataList = data.split(',');
            for (var dataI in dataList) {
                var data = parseFloat(dataList[dataI]);
                if ($scope.data[dataI].x.length < 20) {
                    $scope.data[dataI].x.push($scope.data[dataI].x.length);
                    $scope.data[dataI].y.push(data);
                } else {
                    $scope.data[dataI].y.shift();
                    $scope.data[dataI].y.push(data);
                }
            }
        });

        $scope.openSerial = function() {
            socket.emit('SERIAL.BEGIN');
        };

    });
