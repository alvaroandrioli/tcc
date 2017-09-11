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

        $scope.rollCode = initialCodeString;

        $scope.send = function() {
            if (!$scope.rollCode) {
                Alert.danger("Erro!", "É necessário a definição de um código para cada um dos controles!");
            } else {
                socket.emit("CONTROL.SET.ROLL", "propotional,"+String($scope.travelGain));
                $scope.isLoading = true;
            }
        }

        var finalize = function() {
            if ($scope.rollCode) {
                $scope.isLoading = false;

                ControllerService.setCurrent("custom");

                ControllerService.set("custom", JSON.stringify({
                                                                "roll": $scope.rollCode,
                                                            }));
            }

        }

        socket.on("CONTROL.SET.ROLL.RES", function(res) {
            if (res == 1)
                Alert.success("Atenção!", "Controle de giro configurado com sucesso");
            else
                Alert.error("Erro!", "Controle de giro não pode ser configurado");

            finalize();
        });

    });
