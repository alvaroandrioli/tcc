angular.module("controlBenchApp")
    .controller("propotionalController", function($scope, Alert, socket) {
        $scope.pitchRes = false;
        $scope.yamRes = false;
        $scope.isLoading = false;

        $scope.send = function() {
            if ((!$scope.yamGain || $scope.yamGain < 0) || (!$scope.pitchGain || $scope.pitchGain < 0)) {
                Alert.danger("Erro!", "Ganho deve ser maior que 0");
            } else {
                socket.emit("CONTROL.SET.PITCH", "propotional,"+String($scope.pitchGain));
                socket.emit("CONTROL.SET.YAM", "propotional,"+String($scope.yamGain));
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

        socket.on("CONTROL.SET.YAM.RES", function(res) {
            if (res == 1)
                $scope.yamRes = true;
            else
                $scope.yamRes = true;

            $scope.isLoading = false;

            Alert.success("Atenção!", "Controle de translação configurado com sucesso");
        });

    });
