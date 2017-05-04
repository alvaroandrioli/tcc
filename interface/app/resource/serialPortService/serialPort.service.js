angular.module("controlBenchApp")
    .factory("serialPort", function(socket) {
        var _isConnected = false;

        var _isConnected = function() {
            return _isConnected;
        }

        var _refresh = function() {
            socket.emit("SERIAL.REFRESH.SEND");
        }

        socket.on("SERIAL.REFRESH.RECEIVE", function(isConnected) {
            _isConnected = isConnected == true;
        });

        return {
            isConnected: _isConnected,
            refresh: _refresh
        };
    });
