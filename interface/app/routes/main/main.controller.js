angular.module("controlBenchApp")
    .controller("mainController", function($scope, $http, socket, serialPort, switchService, $uibModal) {
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

        $scope.dataTranslacao = [{
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

        var translacaoChart = new CanvasJS.Chart("translacaoChart", {
            title: {
                text: "Translação"
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
            data: $scope.dataTranslacao
        });

        var openLoadingModal = function() {
            console.log("aqui");
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Loading',
                templateUrl: 'app/routes/main/modal/loading.modal.html',
                backdrop: 'static',
                keyboard: false,
                controller: function($uibModalInstance, socket) {
                    socket.on("SERIAL.BEGIN.RES", function() {
                        $uibModalInstance.close();
                    });
                },
                size: 'sm'
            });
        }

        $scope.openCamModal = function() {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'Cam',
                templateUrl: 'app/routes/main/modal/cam.modal.html',
                backdrop: false,
                keyboard: true,
                windowTopClass: "dragModal",
                controller: function($uibModalInstance, $scope) {
                    setTimeout(function () {
                        $(".modal-dialog").draggable();
                    }, 100);
                    $scope.close = function() {
                        $uibModalInstance.close();
                    }
                },
                size: 'sm'
            });
        }

        socket.on("SERIAL.EMIT_DATA", function(data) {
            // $scope.response = data;
            var dataList = data.split(",");
            for (var dataI in dataList) {
                var data = parseFloat(dataList[dataI]);

                if (dataI <= 1) {
                    $scope.dataArfagem[dataI].dataPoints = shifit($scope.dataArfagem[dataI].dataPoints);
                    $scope.dataArfagem[dataI].dataPoints.push({'x': 9, 'y': data});
                } else {
                    $scope.dataTranslacao[dataI - 2].dataPoints = shifit($scope.dataTranslacao[dataI - 2].dataPoints);
                    $scope.dataTranslacao[dataI - 2].dataPoints.push({'x': 9, 'y': data});
                }
            }

            arfagemChart.render();
            translacaoChart.render();
        });

        $scope.openSerial = function() {
            switchService.setState(true);
            socket.emit("SERIAL.BEGIN");
            openLoadingModal();
        };

        $scope.closeSerial = function() {
            switchService.setState(false);
            socket.emit("SERIAL.END");
        }

        $scope.clearGraphs = function() {
            $scope.dataArfagem[0].dataPoints = [{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0}];
            $scope.dataArfagem[1].dataPoints = [{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0}];

            $scope.dataTranslacao[0].dataPoints = [{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0}];
            $scope.dataTranslacao[1].dataPoints = [{x:0, y:0},{x:1, y:0},{x:2, y:0},{x:3, y:0},{x:4, y:0},{x:5, y:0},{x:6, y:0},{x:7, y:0},{x:8, y:0},{x:9, y:0}];

            arfagemChart.render();
            translacaoChart.render();
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
        translacaoChart.render();
    });
