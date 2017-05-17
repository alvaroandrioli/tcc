angular.module("controlBenchApp", ["btford.socket-io", "ui.router", "ui.bootstrap"])
    .run(function(serialPort) {
        serialPort.refresh();
    });
