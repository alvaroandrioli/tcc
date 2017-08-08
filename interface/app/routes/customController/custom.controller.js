angular.module("controlBenchApp")
    .controller("customController", function($scope, Alert, socket) {
        $scope.editorOptions = {
    		lineWrapping : true,
    		lineNumbers: true,
    		mode: 'python',
            indentWithTabs: true
    	};

        $scope.isLoading = false;

        var initialCodeString = "def fControl(errorList):" +
        "\n\t'''" +
        "\n\t\t@errorList -> list of float" +
        "\n\t\tlista cotendo os erros desde o atual(última posição) até 4 erros" +
        "\n\t\tanteriores(primeira posição)" +
        "\n\t'''" +
        "\n\terror = errorList.pop()" +
        "\n\t#código aqui" +
        "\n\treturn error";

        $scope.travelCode = initialCodeString;
        $scope.pitchCode = initialCodeString;

        $scope.send = function() {
            if ((!$scope.travelCode || !$scope.pitchCode)) {
                Alert.danger("Erro!", "É necessário a definição de um código para cada um dos controles!");
            } else {
                socket.emit("CONTROL.SET.PITCH", "propotional,"+String($scope.pitchGain));
                socket.emit("CONTROL.SET.YAM", "propotional,"+String($scope.travelGain));
                $scope.isLoading = true;
            }
        }

        var finalize = function() {
            if ($scope.pitchRes && $scope.travelRes) {
                $scope.isLoading = false;

                ControllerService.setCurrent("custom");

                ControllerService.set("custom", JSON.stringify({
                                                                        "pitch": $scope.pitchCode,
                                                                        "travel": $scope.travelCode
                                                                    }));
            }

        }

        socket.on("CONTROL.SET.PITCH.RES", function(res) {
            if (res == 1)
                $scope.pitchRes = true;
                Alert.success("Atenção!", "Controle de arfagem configurado com sucesso");
            else
                $scope.pitchRes = false;
                Alert.error("Erro!", "Controle de arfagem não pode ser configurado");

            finalize();
        });

        socket.on("CONTROL.SET.TRAVEL.RES", function(res) {
            if (res == 1)
                $scope.travelRes = true;
                Alert.success("Atenção!", "Controle de translação configurado com sucesso");
            else
                $scope.travelRes = false;
                Alert.error("Erro!", "Controle de translação não pode ser configurado");

            finalize();
        });

    });
