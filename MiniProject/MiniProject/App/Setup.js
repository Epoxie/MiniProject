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

        $scope.startRandom = function () {
            $scope.randomList();
            sessionStorage.animalVar = 1;
            sessionStorage.sentenceVar = 1;
            $scope.adress = sessionStorage.loopList.slice(0, sessionStorage.loopList.indexOf("/")) // becomes the first adress without the '/'
            sessionStorage.loopList = sessionStorage.loopList.slice(sessionStorage.loopList.indexOf("/") + 1); // removes that first adress and the '/'
            document.location.href = document.location.href + "/Home/" + $scope.adress; // sets the webpage to Home/adress
        }

        $scope.randomList = function () { // spawns a list of random adresses seperated by '/'
            $scope.questions = ["AnimalQuiz", "SentenceBuilder"];
            sessionStorage.loopList = "";
            for (var i = 0; i < 15; i++) {
                sessionStorage.loopList += $scope.questions[Math.floor(Math.random() * $scope.questions.length)] + "/";
            }
        }

    }

    app.controller("setupController", ["$scope", "$http", setupController]);

}());