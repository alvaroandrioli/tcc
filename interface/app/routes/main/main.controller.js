angular.module("controlBenchApp")
    .controller("mainController", function($scope, $http, socket, serialPort, switchService, $uibModal, ControllerService) {
        
        $scope.sinalizeChart = false;
        $scope.sinalizeClear = false;

        $scope.widgets = [];

        $scope.gridOptions = {
            cellHeight: 50,
            verticalMargin: 0,
            height: 13
        };

        var resetUpdateChart = function() {
            $scope.sinalizeChart = !$scope.sinalizeChart;
        }

        var resetClearChart = function() {
            $scope.sinalizeClear = !$scope.sinalizeClear;
        }

        $scope.onResizeStop = function(event,ui) {
            $scope.sinalizeChart = !$scope.sinalizeChart;

            setTimeout(resetUpdateChart, 100);
        }

        $scope.clickClearButton = function() {
            $scope.sinalizeClear = !$scope.sinalizeClear;
            
            setTimeout(resetUpdateChart, 100);
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

        $scope.serialPortConnected = function() {
            return serialPort.isConnected();
        }

        $scope.getState = function() {
            return switchService.getState();
        }
    });