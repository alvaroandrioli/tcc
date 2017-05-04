angular.module("controlBenchApp")
    .config(function($stateProvider) {

        $stateProvider.state("visualizationGraphs", {
            url: "/",
            controller: "mainController",
            templateUrl: "app/routes/main/main.html"
        })
        .state("information", {
            url: "/information",
            controller: "informationController",
            templateUrl: "app/routes/information/information.html"
        });
    })
    .run(function($state, $rootScope) {
        $state.go("visualizationGraphs");

        $rootScope.CURRENT_STATE = "visualizationGraphs";

        $rootScope.$on('$stateChangeStart', function(event, toState){
            $rootScope.CURRENT_STATE = toState.name;
            console.log($rootScope.CURRENT_STATE);
        });
    });
