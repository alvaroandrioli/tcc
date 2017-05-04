angular.module("controlBenchApp", ["btford.socket-io", "ui.router"])
    .run(function(serialPort) {
        serialPort.refresh();
    });
