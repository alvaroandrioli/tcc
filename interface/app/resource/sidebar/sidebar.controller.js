angular.module("controlBenchApp")
    .controller("sidebarController", function($scope) {
        $scope.collapsed = false;

        $scope.toggleMenu = function() {
            $("#wrapper").toggleClass("toggled");
            $scope.collapsed = !$scope.collapsed;
        }

    });
