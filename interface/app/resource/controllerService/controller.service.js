angular.module("controlBenchApp")
.factory("ControllerService", function() {
    var _paramsDict = {};
    var _current = "";

    var _set = function(cIdent, params) {
        _paramsDict[cIdent] = params;

        localStorage.setItem('Controllers', JSON.stringify(_paramsDict));
    }

    var _setCurrent = function(cIdent) {
        _current = cIdent;
    }

    var _getParams = function(cIdent) {
        return _paramsDict[cIdent];
    }

    var _getCurrentParams = function() {
        return _getParams(_current);
    }

    var _load = function() {
        var localS = localStorage.getItem('Controllers');

        if (localS && localS.length != 0)
            _paramsDict = JSON.parse(localS);

    }

    var _getCurrent = function() {
        return _current;
    }

    return {
        "set": _set,
        "setCurrent": _setCurrent,
        "getParams": _getParams,
        "getCurrentParams": _getCurrentParams,
        "getCurrent": _getCurrent,
        "load": _load
    };
});
