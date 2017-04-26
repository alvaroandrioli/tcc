angular.module("controlBenchApp", ["btford.socket-io"])
    .controller("mainController", function($scope, $http, socket) {
        $scope.dataArfagem = [{
            type: "spline",
            showInLegend: true,
            name: 'Referencia',
            dataPoints: [{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0},{x:10, y:0},{x:11, y:0},{x:12, y:0},{x:13, y:0},{x:14, y:0},{x:15, y:0},{x:16, y:0},{x:17, y:0},{x:18, y:0},{x:19, y:0}]
        },{
            type: "spline",
            showInLegend: true,
            name: 'Sensor',
            dataPoints: [{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0},{x:10, y:0},{x:11, y:0},{x:12, y:0},{x:13, y:0},{x:14, y:0},{x:15, y:0},{x:16, y:0},{x:17, y:0},{x:18, y:0},{x:19, y:0}]
        }];

        $scope.dataGuinada = [{
            type: "spline",
            showInLegend: true,
            name: 'Referencia',
            dataPoints: [{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0},{x:10, y:0},{x:11, y:0},{x:12, y:0},{x:13, y:0},{x:14, y:0},{x:15, y:0},{x:16, y:0},{x:17, y:0},{x:18, y:0},{x:19, y:0}]
        },{
            type: "spline",
            showInLegend: true,
            name: 'Sensor',
            dataPoints: [{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0},{x:10, y:0},{x:11, y:0},{x:12, y:0},{x:13, y:0},{x:14, y:0},{x:15, y:0},{x:16, y:0},{x:17, y:0},{x:18, y:0},{x:19, y:0}]
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
                maximum: 1023,
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
                maximum: 1023,
                minimun: 0
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
                    $scope.dataArfagem[dataI].dataPoints.push({'x': 19, 'y': data});
                } else {
                    $scope.dataGuinada[dataI - 2].dataPoints = shifit($scope.dataGuinada[dataI - 2].dataPoints);
                    $scope.dataGuinada[dataI - 2].dataPoints.push({'x': 19, 'y': data});
                }
            }

            arfagemChart.render();
            guinadaChart.render();
        });

        $scope.openSerial = function() {
            socket.emit("SERIAL.BEGIN");
        };

        $scope.closeSerial = function() {
            socket.emit("SERIAL.END");
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
