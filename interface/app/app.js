angular.module("controlBenchApp", ["btford.socket-io", "ui.router", "ui.bootstrap", "ui.codemirror", "gridstack-angular"])
    .run(function(serialPort, $rootScope) {
        serialPort.refresh();

        $rootScope.TRANSFORM_NAME = function(name) {
            if (name == "propotional")
                return "Proporcional";

            if (name == "custom")
                return "Personalizado";

            return name;
        }
    });
