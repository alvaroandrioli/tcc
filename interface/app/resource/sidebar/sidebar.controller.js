angular.module("controlBenchApp")
    .controller("sidebarController", function($scope, ControllerService) {
        $scope.collapsed = false;

        $scope.toggleMenu = function() {
            $("#wrapper").toggleClass("toggled");
            $scope.collapsed = !$scope.collapsed;
        }

        $scope.getCurrentController = function() {
            return ControllerService.getCurrent();
        }

    });
