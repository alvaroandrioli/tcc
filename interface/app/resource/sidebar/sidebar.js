angular.module("controlBenchApp")
    .directive("sideBar", function() {
        return {
            templateUrl: "app/resource/sidebar/sidebar.html",
            controller: "sidebarController",
            restrict: "E",
            replace: true
        };
    })
