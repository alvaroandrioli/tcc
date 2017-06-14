angular.module("controlBenchApp", ["btford.socket-io", "ui.router", "ui.bootstrap", "ui.codemirror"])
    .run(function(serialPort) {
        serialPort.refresh();
    });
