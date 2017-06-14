angular.module("controlBenchApp")
    .controller("customController", function($scope, Alert, socket) {
        $scope.editorOptions = {
    		lineWrapping : true,
    		lineNumbers: true,
    		mode: 'python',
            indentWithTabs: true
    	};

        $scope.travelCode = "def travelControl(error): \n\treturn error";
        $scope.pitchCode = "def pitchControl(error): \n\treturn error";
    });
