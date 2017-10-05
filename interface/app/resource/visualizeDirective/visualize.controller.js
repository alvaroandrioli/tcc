angular.module("controlBenchApp")
    .controller("visualizeDirectiveController", function ($scope, socket) {
        const MAX = 20;
        $scope.time = 0;

        var generateZeroData = function (max) {
            var dataZero = [];
            for (var i = 0; i < max; i++) {
                dataZero.push({ 'x': i, 'y': 0, 'indexLabel': 0 });
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
            type: "line",
            showInLegend: true,
            name: 'Entrada',
            dataPoints: generateZeroData(MAX)
        }, {
            type: "line",
            showInLegend: true,
            name: 'Sensor',
            dataPoints: generateZeroData(MAX)
        }];

        var realTimeChart = new CanvasJS.Chart("realTimeChart", {
            maintainAspectRatio: false,
            responsive: true,
            title: {
                text: ""
            },
            toolTip: {
                enabled	: false
            },
            legend: {
                horizontalAlign: "right", // left, center ,right
                verticalAlign: "center",  // top, center, bottom
            },
            axisY: {
                maximum: 1250,
                minimun: 0,
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
            // var dataList = data.split(",");
            // for (var dataI in dataList) {
            //     var data = parseFloat(dataList[dataI]);

            //     $scope.dataPlot[dataI].dataPoints = shifit($scope.dataPlot[dataI].dataPoints);
            //     $scope.dataPlot[dataI].dataPoints.push({ 'x': MAX, 'y': data });
            // }

            // realTimeChart.render();
            $scope.data = data;
        });

        $scope.$watch('updateChart', function(newValue, oldValue) {
            if (newValue == true)
                realTimeChart.render();
        }), true;

        $scope.$watch('clearChart', function(newValue, oldValue) {
            if (newValue == true) {
                $scope.dataPlot[0].dataPoints = generateZeroData(MAX);
                $scope.dataPlot[1].dataPoints = generateZeroData(MAX);
                
                realTimeChart.render();
            }
        }), true;

        realTimeChart.render();

        
        // function recursive() {

        //         var dataList = [Math.round((Math.random() * 500) + 500), Math.round((Math.random() * 500) + 500)];
        //         // $scope.response = data;
        //         for (var dataI in dataList) {
        //             var data = parseFloat(dataList[dataI]);

        //             $scope.dataPlot[dataI].dataPoints = shifit($scope.dataPlot[dataI].dataPoints);
        //             $scope.dataPlot[dataI].dataPoints.push({'x': MAX, 'y': data});
        //         }

        //         realTimeChart.render();

        //         setTimeout(recursive, 20);
        // }

        // recursive();

    });
