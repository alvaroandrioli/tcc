angular.module("controlBenchApp")
.directive("visualize", function() {
    return {
        templateUrl: "app/resource/visualizeDirective/visualize.html",
        controller: "visualizeDirectiveController",
        restrict: "E",
        scope: {
            updateChart: '='
        }
    };
})
