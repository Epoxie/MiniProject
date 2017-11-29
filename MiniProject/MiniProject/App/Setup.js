(function () {

    var app = angular.module("setupApp", []);

    var setupController = function ($scope, $http) {

        $scope.animalSetup = function() {
            sessionStorage.animalVar = document.getElementById("animalSelect").value;
            document.location.href = document.location.href + "/Animal";
        }

    }

    app.controller("setupController", ["$scope", "$http", setupController]);

}());