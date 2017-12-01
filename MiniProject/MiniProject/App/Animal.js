(function () {

    var app = angular.module("animalApp", []);

    var animalController = function ($scope, $http) {

        /*$scope.initAttempts = function (iterations) {
            $scope.totalAttempts = iterations;
        } */ // currently unused code

        $scope.animalInit = function () {
            if (sessionStorage.loopList != null)
            {
                $scope.totalAttempts = (parseInt(sessionStorage.answeredQuestions) + 1);
                document.getElementById("score").innerHTML = "Total Score: " + sessionStorage.highScore + " of " + sessionStorage.answeredQuestions;
                if (sessionStorage.loopList.length < 1)
                    sessionStorage.removeItem("loopList");
            }
            else
            {
                $scope.totalAttempts = parseInt(sessionStorage.animalVar);
                sessionStorage.highScore = 0;
                sessionStorage.answeredQuestions = 0;
            }
            $scope.randomAnimal();
        }

        $scope.interval; // the timer used later

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
                $scope.currentAnimalIndex = Math.floor(Math.random() * $scope.animalNames.length); // random number that is not too big
                $scope.alternatives.splice(i, 1, $scope.animalNames[$scope.currentAnimalIndex]); // sets the three alternatives to be unique animals
                $scope.animalNames.splice($scope.currentAnimalIndex, 1); // removes the animals from the original list
            }
            $scope.animalNames = $scope.animalNames.concat($scope.alternatives); // concats the original list with the alternatives so that there's always the same amount of choices
            $scope.changeImage(); // updates the image
        }

        $scope.changeImage = function () {
            $scope.correctAnswer = Math.floor(Math.random() * 3); // Randomizes which of the alternatives that are the correct one
            document.getElementById("animalImage").src = "https://openclipart.org/image/200px/svg_to_png/" +
                                                         $scope.animalImages[$scope.alternatives[$scope.correctAnswer]] +
                                                         ".png&disposition=attachment"; // picks out the image for the correct answer and puts that on the screen
        }

        $scope.checkAnswer = function (answer) {
            if (!$scope.interval) {
                if($scope.correctAnswer == answer)
                {
                    document.getElementById("response").innerHTML = "Correct! You get 1 point!";
                    sessionStorage.highScore++;
                }
                else
                    document.getElementById("response").innerHTML = "Wrong! The Correct answer is: " + $scope.alternatives[$scope.correctAnswer];
                sessionStorage.answeredQuestions++;
                document.getElementById("score").innerHTML = "Total Score: " + sessionStorage.highScore + " of " + sessionStorage.answeredQuestions;
                $scope.shortTimer();
            }
        }

        $scope.shortTimer = function () {
            $scope.interval = setInterval(function myfunction() {
                clearInterval($scope.interval); // clears interval
                $scope.interval = null; // makes sure interval is null for the if statement above to work
                if ($scope.totalAttempts == sessionStorage.answeredQuestions) { // checks if the desired number of questions have been attempted
                    $scope.return();
                }
                else
                    $scope.randomAnimal();
                $scope.$apply(); // updates the bindings
            }, 1000);
        }

        $scope.return = function () { // sets the webbpage to be that of homecontroller index or whatever default
            if (sessionStorage.loopList != null)
            {
                $scope.adress = sessionStorage.loopList.slice(0, sessionStorage.loopList.indexOf("/")) // becomes the first adress without the '/'
                sessionStorage.loopList = sessionStorage.loopList.slice(sessionStorage.loopList.indexOf("/") + 1); // removes that first adress and the '/'
                document.location.href = document.location.href.slice(0, document.location.href.indexOf("/Home")) + "/Home/" + $scope.adress; // sets the webpage to Home/adress
            }
            else
                document.location.href = document.location.href.slice(0, document.location.href.indexOf("/Home")); // just goes back
        }
    }

    app.controller("animalController", ["$scope", "$http", animalController]);

}());