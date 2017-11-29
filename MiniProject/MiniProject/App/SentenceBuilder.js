(function () {

    //TODO: add the timer so that a new question pops up automatically after 10 seconds


    // Tried using a "Controller as" approach
    var app = angular.module("sentenceBuilder", [])
        .controller("sentenceBuilderController", ["$http", "$interval", function ($http, $interval) {
            // Some variables
            var vm = this;
            var answer;
            var originalSentences = [];
            var sentences = [];

            // Helper functions to add and remove classes from DOM-elements
            var addToElementClassList = function (elementId, className) {
                var element = document.getElementById(elementId);
                for (var i = 0, j = className.length; i < className.length; i++) {
                    if (!element.classList.contains(className[i])) {
                        element.classList.add(className[i]);
                    }
                };
            };
            var removeFromElementClassList = function (elementId, className) {
                var element = document.getElementById(elementId);
                for(var i = 0, j = className.length; i < j; i++){
                    if (element.classList.contains(className[i])) {
                        element.classList.remove(className[i]);
                    }
                };
            };

            // Gets a new random question
            var getRandomQuestion = function () {

                //checks if we have any questions left, otherwise we simply make new ones
                if (sentences.length <= 0) {
                    sentences = shuffleArray(angular.copy(originalSentences));
                }

                answer = sentences.pop();
                vm.shuffledWords = shuffleArray(answer.split(" "));
            };

            // Shuffles an array (duh)
            var shuffleArray = function (arr) {
                var index = arr.length, tmp, rng;
                while (index != 0) {
                    rng = Math.floor(Math.random() * index);
                    index--;
                    tmp = arr[index];
                    arr[index] = arr[rng];
                    arr[rng] = tmp;
                };

                return arr;
            };

            // Some more variables, but accessible from the markup
            vm.shuffledWords = [];
            vm.pageTitle = "Build Sentences!";
            vm.pageDesc = [
                "Use the words listed to build sentences, you have 10 seconds to answer.",
                "You get 1 point for every correct sentence, but beware, you get one point deducted if you use any invalid words!"
            ];
            vm.score = 0;
            vm.count = 0;
            vm.Maxcount = 1;

            // Checks if the answer contains the current word
            vm.inAnswer = function (value) {
                if (vm.answer && vm.answer.length) {
                    return vm.answer.split(" ").indexOf(value) >= 0;
                }
                return false;
            };


            // Starts the quiz (duh)
            vm.startQuiz = function () {
                addToElementClassList("startBtn", ["hidden"]);
                removeFromElementClassList("quizDiv", ["hidden"]);
                getRandomQuestion();
                vm.Maxcount = sessionStorage.getItem("sentenceVar") - 1;
            };

            // Checks input to see if the user has inputed any invalid words.
            vm.checkInput = function () {

                if (vm.answer) {
                    var words = vm.answer.split(" ");
                    vm.extraWords = [];
                    for (var i = 0, j = words.length; i < j; i++) {
                        // If the word 
                        if (answer.indexOf(words[i]) < 0) {
                            vm.extraWords.push(words[i]);
                        }
                    }

                    // Shows or hides the div with the invalid words
                    if (vm.extraWords.length) {
                        removeFromElementClassList("extraWordsDiv", ["hidden"]);
                    }
                    else {
                        addToElementClassList("extraWordsDiv", ["hidden"]);
                    }
                }
            };

            // Check the answer
            vm.checkAnswer = function () {
                removeFromElementClassList("scoreLabel", ["label-success", "label-warning", "label-danger"])         

                // Makes sure that the div with the invalid words are hidden
                addToElementClassList("extraWordsDiv", ["hidden"]);

                // If answer is correct
                if (vm.answer === answer) {

                    addToElementClassList("scoreLabel", ["label-success"]);
                    vm.score++;
                }
                else { // if answer is incorrect 

                    // Checks if there are any invalid words
                    if (vm.extraWords && vm.extraWords.length > 0) {
                        vm.score--;
                        addToElementClassList("scoreLabel", ["label-danger"]);
                    }
                    else {
                        addToElementClassList("scoreLabel", ["label-warning"]);
                    }
                }

                // return
                if (vm.count == vm.Maxcount) {
                    document.getElementById("answer").readOnly = true;
                    var interval = setInterval(function myfunction() {
                        clearInterval(interval); // clears interval
                        interval = null;
                        document.location.href = document.location.href.slice(0, document.location.href.indexOf("/Home"));       
                    }, 1000);
                }

                // Fix things
                vm.extraWords = null;
                vm.answer = null;
                vm.count++;

                // gets a new questions
                getRandomQuestion();
            };

            // Will be called when controller div is initialised
            vm.init = function () {
               removeFromElementClassList("sentenceDiv", ["hidden"]);
                vm.getData();
            };

            // Gets the sentences from the database
            vm.getData = function () {
                $http.get("/api/sentences/get")
                    .then(function (response) {
                        originalSentences = response.data;
                        sentences = shuffleArray(angular.copy(originalSentences));
                        removeFromElementClassList("startBtn", ["disabled"]);
                    });
            };
        }]);
})();