angular.module("controlBenchApp")
    .factory("serialPort", function(socket) {
        var _pisConnected = false;

        var _isConnected = function() {
            return _pisConnected;
        }

        var _refresh = function() {
            socket.emit("SERIAL.REFRESH.SEND");
        }

        socket.on("SERIAL.REFRESH.RECEIVE", function(isConnected) {
            _pisConnected = isConnected == true;
        });

        return {
            "isConnected": _isConnected,
            "refresh": _refresh
        };
    });
