(function () {

    var app = angular.module("punctuationExercise", [])
        .controller("punctuationController", ["$http", "$interval", function ($http, $interval) {
            var vm = this;
            var answer;
            var originalSentences = [];
            var sentences = [];
            var previous;
            var timer = null;
            var time = 10000;
            var punctuationMarks = ["'", ".", ",", "?", "!"];

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
                for (var i = 0, j = className.length; i < j; i++) {
                    if (element.classList.contains(className[i])) {
                        element.classList.remove(className[i]);
                    }
                };
            };

            // Changes .,?! to *
            var obscurePunctuation = function (arr) {
                return arr.replace(/[’'´`.,?!]/g, "*");
            };

            // Gets a new random question
            var getRandomQuestion = function () {

                // 
                if (answer && answer.length) {
                    previous = answer;
                }

                //checks if we have any questions left, otherwise we simply make new ones
                if (sentences.length <= 0) {
                    sentences = shuffleArray(angular.copy(originalSentences));
                }

                answer = sentences.pop();
                vm.answer = obscurePunctuation(answer);

                vm.punctuationMarks = shuffleArray(punctuationMarks);

                // Checks if the sentence contains certain punctuation marks that can make it rather ambiguous, and then edits the list of marks to make it more clear
                filterPunctuationMarks(vm.punctuationMarks);
            };

            // Shuffles an array (duh)
            var shuffleArray = function (arr) {
                arr = angular.copy(arr);
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

            // 
            var filterPunctuationMarks = function (arr) {
                if (vm.correctContains(".") && !vm.correctContains("!")) {
                    arr.splice(arr.indexOf("!"), 1, ";");
                }
                else if (!vm.correctContains(".") && vm.correctContains("!")) {
                    arr.splice(arr.indexOf("."), 1, ";");
                }
            };

            // more variables
            vm.answer;
            vm.punctuationMarks = [];
            vm.pageTitle = "Punctuation Exercise!";
            vm.pageDesc = [
                "Use the buttons listed to add punctuation marks to the sentences, you have 10 seconds to answer.",
                "You get 1 point for every correct sentence!"
            ];
            vm.score = 0;
            vm.count = 0;

            // checks if the correct answer contains the mark
            vm.correctContains = function (mark) {
                if (answer && answer.length) {
                    return answer.indexOf(mark) >= 0;
                }
                return false;
            };


            // Checks if a word is unique in the sentence
            vm.isUnique = function (mark) {

                var num = 0;
                for (var i = 0, j = answer.length; i < j; i++) {
                    if (answer[i] == mark) {
                        num++;
                    }
                };
                for (var i = 0, j = vm.answer.length; i < j; i++) {
                    if (vm.answer[i] == mark) {
                        num--;
                    }
                };
                return num == 0;
            };

            // TODO: fix
            // Update the answer when clicking the word buttons
            vm.updateAnswer = function (mark) {

                if (vm.answerContains(mark) && (vm.isUnique(mark) || !vm.inRightPlace(mark)))
                {
                    vm.answer = vm.answer.replace(mark, "*");
                }
                else {

                    vm.answer = vm.answer.replace("*", mark);
                }

                if (vm.answer == answer) {
                    vm.checkAnswer();
                }
            };

            // Checks if a word is in the right place
            vm.inRightPlace = function (mark) {
                if (!vm.answer) {
                    vm.answer = "";
                }
                if (!answer) {
                    answer = "";
                }
                var index = vm.answer.lastIndexOf(mark);

                return answer[index] == mark;
            };

            // Checks if the answer contains the current word
            vm.answerContains = function (mark) {
                if (vm.answer && vm.answer.length) {
                    return vm.answer.indexOf(mark) >= 0;
                }
                return false;
            };

            // Starts the quiz (duh)
            vm.startQuiz = function () {
                addToElementClassList("startBtn", ["hidden"]);
                removeFromElementClassList("quizDiv", ["hidden"]);
                getRandomQuestion();
                timer = $interval(vm.checkAnswer, time);
            };

            // Check the answer
            vm.checkAnswer = function () {
                removeFromElementClassList("labelCorrect", ["label-success", "label-warning", "label-danger"]);
                // removes these classes from the score label
                removeFromElementClassList("scoreLabel", ["label-success", "label-warning", "label-danger"])

                // cancel old timer
                $interval.cancel(timer);

                vm.correct = answer;

                // If answer is correct
                if (vm.answer === answer) {
                    //removeFromElementClassList("labelCorrect", ["hidden"]);
                    addToElementClassList("scoreLabel", ["label-success"]);
                    addToElementClassList("labelCorrect", ["label-success"]);
                    vm.score++;
                }
                else { // if answer is incorrect 
                    addToElementClassList("scoreLabel", ["label-warning"]);
                    addToElementClassList("labelCorrect", ["label-warning"]);
                }

                // Fix things
                vm.count++;

                // start new timer
                timer = $interval(vm.getNewRandomQuestion, 1000);
            };

            vm.getNewRandomQuestion = function () {
                $interval.cancel(timer);
                removeFromElementClassList("labelCorrect", ["label-success", "label-warning", "label-danger"]);
                vm.correct = null;
                answer = "";
                vm.answer = "";
                // gets a new questions
                getRandomQuestion();
                // new timer
                timer = $interval(vm.checkAnswer, time);
                
            }

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