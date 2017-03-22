angular.module('controlBenchApp', ['btford.socket-io'])
    .controller('mainController', function($scope, $http, socket) {
        $scope.response = 'ok';

        $scope.sendEvent = function() {
            socket.emit('TEST_EVENT', 'oie eu sou o goku');
        }
    });
