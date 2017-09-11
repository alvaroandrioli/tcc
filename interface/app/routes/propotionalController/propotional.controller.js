angular.module("controlBenchApp")
    .controller("propotionalController", function($scope, Alert, socket, ControllerService) {
        $scope.rollRes = false;
        $scope.isLoading = false;

        var params = ControllerService.getParams("propotional");

        if (params != undefined || params != null) {
            params = JSON.parse(params);

            $scope.rollGain = params.roll;
        }

        $scope.send = function() {
            if (!$scope.rollGain || $scope.rollGain < 0) {
                Alert.danger("Erro!", "Ganho deve ser maior que 0");
            } else {
                socket.emit("CONTROL.SET.ROLL", "propotional,"+String($scope.rollGain));
                $scope.isLoading = true;
            }
        }

        socket.on("CONTROL.SET.ROLL.RES", function(res) {
            if (res == 1)
                $scope.rollRes = true;
            else
                $scope.rollRes = false;

            $scope.isLoading = false;

            ControllerService.setCurrent("propotional");

            ControllerService.set("propotional", JSON.stringify({
                                                                    "roll": $scope.rollGain,
                                                                }));

            Alert.success("Atenção!", "Controle de giro configurado com sucesso");
        });

    });
