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
        })
        .state("customController", {
            url: "/customController",
            controller: "customController",
            templateUrl: "app/routes/customController/custom.html"
        })
        .state("propotionalController", {
            url: "/propotional",
            controller: "propotionalController",
            templateUrl: "app/routes/propotionalController/propotional.html"
        });
    })
    .run(function($state, $rootScope, Alert) {
        $state.go("visualizationGraphs");

        $rootScope.CURRENT_STATE = "visualizationGraphs";

        $rootScope.$on('$stateChangeStart', function(event, toState){
            $rootScope.CURRENT_STATE = toState.name;
            Alert.clearAll();
        });
    });
