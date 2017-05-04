angular.module("controlBenchApp")
    .controller("mainController", function($scope, $http, socket, serialPort, switchService) {
        $scope.dataArfagem = [{
            type: "spline",
            showInLegend: true,
            name: 'Referencia',
            dataPoints: [{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0}]
        },{
            type: "spline",
            showInLegend: true,
            name: 'Sensor',
            dataPoints: [{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0}]
        }];

        $scope.dataGuinada = [{
            type: "spline",
            showInLegend: true,
            name: 'Referencia',
            dataPoints: [{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0}]
        },{
            type: "spline",
            showInLegend: true,
            name: 'Sensor',
            dataPoints: [{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0}]
        }];

        var arfagemChart = new CanvasJS.Chart("arfagemChart", {
            title: {
                text: "Arfagem"
            },
            legend: {
                horizontalAlign: "right", // left, center ,right
                verticalAlign: "center",  // top, center, bottom
            },
            axisY: {
                maximum: 1100,
                minimun: 0
            },
            axisX: {
                labelFormatter: function(e) {
                    return  "";
                }
            },
            data: $scope.dataArfagem
        });

        var guinadaChart = new CanvasJS.Chart("guinadaChart", {
            title: {
                text: "Guinada"
            },
            legend: {
                horizontalAlign: "right", // left, center ,right
                verticalAlign: "center",  // top, center, bottom
            },
            axisY: {
                maximum: 1100,
                minimun: -1100
            },
            axisX: {
                labelFormatter: function(e) {
                    return  "";
                }
            },
            data: $scope.dataGuinada
        });


        socket.on("SERIAL.EMIT_DATA", function(data) {
            // $scope.response = data;
            var dataList = data.split(",");
            for (var dataI in dataList) {
                var data = parseFloat(dataList[dataI]);

                if (dataI <= 1) {
                    $scope.dataArfagem[dataI].dataPoints = shifit($scope.dataArfagem[dataI].dataPoints);
                    $scope.dataArfagem[dataI].dataPoints.push({'x': 9, 'y': data});
                } else {
                    $scope.dataGuinada[dataI - 2].dataPoints = shifit($scope.dataGuinada[dataI - 2].dataPoints);
                    $scope.dataGuinada[dataI - 2].dataPoints.push({'x': 9, 'y': data});
                }
            }

            arfagemChart.render();
            guinadaChart.render();
        });

        $scope.openSerial = function() {
            switchService.setState(true);
            socket.emit("SERIAL.BEGIN");
        };

        $scope.closeSerial = function() {
            switchService.setState(false);
            socket.emit("SERIAL.END");
        }

        $scope.clearGraphs = function() {
            $scope.dataArfagem[0].dataPoints = [{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0}];
            $scope.dataArfagem[1].dataPoints = [{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0}];

            $scope.dataGuinada[0].dataPoints = [{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0}];
            $scope.dataGuinada[1].dataPoints = [{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0}];

            arfagemChart.render();
            guinadaChart.render();
        }

        $scope.serialPortConnected = function() {
            return serialPort.isConnected();
        }

        $scope.getState = function() {
            return switchService.getState();
        }

        function shifit(dataPoints) {
            var res = [];

            for (var k = 1; k < dataPoints.length; k++) {
                var data = dataPoints[k];
                data.x--;
                res.push(data);
            }

            return res;
        }


        arfagemChart.render();
        guinadaChart.render();
    });
