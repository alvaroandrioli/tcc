angular.module("controlBenchApp")
    .controller("propotionalController", function($scope, Alert, socket, ControllerService) {
        $scope.pitchRes = false;
        $scope.travelRes = false;
        $scope.isLoading = false;

        var params = ControllerService.getParams("propotional");

        if (params != undefined || params != null) {
            params = JSON.parse(params);

            $scope.pitchGain = params.pitch;
            $scope.travelGain = params.travel;
        }

        $scope.send = function() {
            if ((!$scope.travelGain || $scope.travelGain < 0) || (!$scope.pitchGain || $scope.pitchGain < 0)) {
                Alert.danger("Erro!", "Ganho deve ser maior que 0");
            } else {
                socket.emit("CONTROL.SET.PITCH", "propotional,"+String($scope.pitchGain));
                socket.emit("CONTROL.SET.YAM", "propotional,"+String($scope.travelGain));
                $scope.isLoading = true;
            }
        }

        socket.on("CONTROL.SET.PITCH.RES", function(res) {
            if (res == 1)
                $scope.pitchRes = true;
            else
                $scope.pitchRes = false;

            Alert.success("Atenção!", "Controle de arfagem configurado com sucesso");
        });

        socket.on("CONTROL.SET.TRAVEL.RES", function(res) {
            if (res == 1)
                $scope.travelRes = true;
            else
                $scope.travelRes = false;

            $scope.isLoading = false;

            ControllerService.setCurrent("propotional");

            ControllerService.set("propotional", JSON.stringify({
                                                                    "pitch": $scope.pitchGain,
                                                                    "travel": $scope.travelGain
                                                                }));

            Alert.success("Atenção!", "Controle de translação configurado com sucesso");
        });

    });
