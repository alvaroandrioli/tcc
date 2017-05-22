angular.module("controlBenchApp")
.controller("alertDirectiveController", function($scope, Alert) {
    $scope.alerts = Alert.getAll();

    $scope.closeAlert = function(index) {
        Alert.remove(index);
    }
});
