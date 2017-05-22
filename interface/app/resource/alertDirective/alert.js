angular.module("controlBenchApp")
    .directive("alertComponent", function() {
        return {
            templateUrl: "app/resource/alertDirective/alert.html",
            controller: "alertDirectiveController",
            restrict: "E",
        };
    })
