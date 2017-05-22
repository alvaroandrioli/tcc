angular.module("controlBenchApp")
.factory("Alert", function() {
    var _alerts = [];

    var _add = function(type, alert) {
        if (!alert.title)
            alert.title = type;

        alert.type = type;

        _alerts.push(alert);
    }

    var _remove = function(index) {
        _alerts.splice(index, 1);
    }

    var _clearAll = function() {
        _alerts = [];
    }

    var _getAll = function() {
        return _alerts;
    }

    var _info = function(title, msg) {
        var _alert = {
            "title": title,
            "msg": msg
        }

        _add("info", _alert);
    }

    var _danger = function(title, msg) {
        var _alert = {
            "title": title,
            "msg": msg
        }

        _add("danger", _alert);
    }

    var _warning = function(title, msg) {
        var _alert = {
            "title": title,
            "msg": msg
        }

        _add("warning", _alert);
    }

    var _success = function(title, msg) {
        var _alert = {
            "title": title,
            "msg": msg
        }

        _add("success", _alert);
    }

    return {
        "info": _info,
        "danger": _danger,
        "warning": _warning,
        "success": _success,
        "remove": _remove,
        "getAll": _getAll,
        "clearAll": _clearAll
    };
});
