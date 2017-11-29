(function () {

    var app = angular.module("setupApp", []);

    var setupController = function ($scope, $http) {

        $scope.animalSetup = function() {
            sessionStorage.animalVar = document.getElementById("animalSelect").value;
            document.location.href = document.location.href + "Home/AnimalQuiz";
        }

        $scope.sentenceSetup = function () {
            sessionStorage.sentenceVar = document.getElementById("sentenceSelect").value;
            document.location.href = document.location.href + "Home/SentenceBuilder";
        }

    }

    app.controller("setupController", ["$scope", "$http", setupController]);

}());