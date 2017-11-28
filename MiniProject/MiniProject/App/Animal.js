(function () {

    var app = angular.module("animalApp", []);

    var animalController = function ($scope, $http) {

        $scope.score = 0;

        $scope.animalNames = ["Horse", "Dog", "Cat", "Elephant", "Giraffe", "Eagle", "Ostrich"]

        $scope.animalImages = {
            Horse: "201983/horse-brown800px",
            Dog: "284666/publicdomainq-dog_Beagle",
            Cat: "179212/yellow-tiger-cat",
            Elephant: "171806/Elephant",
            Giraffe: "6958/SteveLambert-Giraffe",
            Eagle: "24302/Architetto-Acquila-03",
            Ostrich: "247925/ostrichvector"
        };

        $scope.alternatives = [];

        $scope.randomAnimal = function () { // Generates a random number, then saves the element and removes it from the array
            for (i = 0; i < 3; i++)
            {
                $scope.currentAnimalIndex = Math.floor(Math.random() * $scope.animalNames.length);
                $scope.alternatives.splice(i, 1, $scope.animalNames[$scope.currentAnimalIndex]);
                $scope.animalNames.splice($scope.currentAnimalIndex, 1);
            }
            $scope.animalNames = $scope.animalNames.concat($scope.alternatives);
            $scope.changeImage();
        }

        $scope.changeImage = function () {
            $scope.correctAnswer = Math.floor(Math.random() * 3);
            document.getElementById("animalImage").src = "https://openclipart.org/image/200px/svg_to_png/" +
                                                         $scope.animalImages[$scope.alternatives[$scope.correctAnswer]] +
                                                         ".png&disposition=attachment";
        }

        $scope.checkAnswer = function (answer) {
            if (!$scope.interval) {
                if($scope.correctAnswer == answer)
                {
                    document.getElementById("response").innerHTML = "Correct! You get 1 point!";
                    $scope.score += 1;
                    document.getElementById("score").innerHTML = "Total Score: " + $scope.score;
                }
                else
                    document.getElementById("response").innerHTML = "Wrong! The Correct answer is: " + $scope.alternatives[$scope.correctAnswer];
                $scope.shortTimer();
            }
        }

        $scope.interval;

        $scope.shortTimer = function () {
            $scope.interval = setInterval(function myfunction() {
                clearInterval($scope.interval);
                $scope.interval = null;
                $scope.randomAnimal();
                $scope.$apply()
            }, 1000);
        }
    }

    app.controller("animalController", ["$scope", "$http", animalController]);

}());