angular.module("controlBenchApp")
    .controller("mainController", function($scope, $http, socket, serialPort, switchService, $uibModal, ControllerService) {
        
        $scope.sinalizeChart = false;
        
        $scope.widgets = [];

        $scope.gridOptions = {
            cellHeight: 50,
            verticalMargin: 0,
            height: 13
        };

        var resertUpdateChart = function() {
            $scope.sinalizeChart = !$scope.sinalizeChart;
        }

        $scope.onResizeStop = function(event,ui) {
            $scope.sinalizeChart = !$scope.sinalizeChart;

            setTimeout(resertUpdateChart, 100);
        }

        var openLoadingModal = function() {
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

        $scope.isSetController = function() {
            return ControllerService.getCurrent().length != 0;
        }

        $scope.getCurrentController = function() {
            return ControllerService.getCurrent();
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
            $scope.dataPlot.dataPoints = generateZeroData(MAX);

            realTimeChart.render();
        }

        $scope.serialPortConnected = function() {
            return serialPort.isConnected();
        }

        $scope.getState = function() {
            return switchService.getState();
        }

       
        //
        // function recursive() {
        //
        //         var dataList = [Math.round((Math.random() * 500) + 500), Math.round((Math.random() * 500) + 500)];
        //         // $scope.response = data;
        //         for (var dataI in dataList) {
        //             var data = parseFloat(dataList[dataI]);
        //
        //             $scope.dataPlot[dataI].dataPoints = shifit($scope.dataPlot[dataI].dataPoints);
        //             $scope.dataPlot[dataI].dataPoints.push({'x': MAX, 'y': data});
        //         }
        //
        //         realTimeChart.render();
        //
        //         setTimeout(recursive, 20);
        // }
        //
        // recursive();

    });