angular.module("controlBenchApp")
.factory("switchService", function() {
    var _on = false;

    var _setState = function(state) {
        _on = state;
    }

    var _getState = function() {
        return _on;
    }

    return {
        setState: _setState,
        getState: _getState
    };
});
