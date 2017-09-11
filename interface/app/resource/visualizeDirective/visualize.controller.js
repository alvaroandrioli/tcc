angular.module("controlBenchApp")
    .controller("visualizeDirectiveController", function ($scope, socket) {
        const MAX = 200;

        var generateZeroData = function (max) {
            var dataZero = [];
            for (var i = 0; i < max; i++) {
                dataZero.push({ 'x': i, 'y': 0 });
            }

            return dataZero;
        }

        var shifit = function(dataPoints) {
            var res = [];

            for (var k = 1; k < dataPoints.length; k++) {
                var data = dataPoints[k];
                data.x--;
                res.push(data);
            }

            return res;
        }

        $scope.dataPlot = [{
            type: "spline",
            showInLegend: true,
            name: 'Referencia',
            dataPoints: generateZeroData(MAX)
        }, {
            type: "spline",
            showInLegend: true,
            name: 'Sensor',
            dataPoints: generateZeroData(MAX)
        }];

        var realTimeChart = new CanvasJS.Chart("realTimeChart", {
            title: {
                text: ""
            },
            legend: {
                horizontalAlign: "right", // left, center ,right
                verticalAlign: "center",  // top, center, bottom
            },
            axisY: {
                maximum: 1500,
                minimun: 0,
                labelFormatter: function (e) {
                    return Math.round(e.value * 0.12) + 2;
                },
                title: "Ângulo"
            },
            axisX: {
                labelFormatter: function (e) {
                    return "";
                }
            },
            data: $scope.dataPlot
        });

        socket.on("SERIAL.EMIT_DATA", function (data) {
            // $scope.response = data;
            var dataList = data.split(",");
            for (var dataI in dataList) {
                var data = parseFloat(dataList[dataI]);

                $scope.dataPlot[dataI].dataPoints = shifit($scope.dataPlot[dataI].dataPoints);
                $scope.dataPlot[dataI].dataPoints.push({ 'x': MAX, 'y': data });
            }

            realTimeChart.render();
        });

        $scope.$watch('updateChart', function(newValue, oldValue) {
            if (newValue == true)
                realTimeChart.render();
        }), true;

        realTimeChart.render();
    });
