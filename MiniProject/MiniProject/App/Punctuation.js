(function () {

    var app = angular.module("punctuationExercise", [])
        .controller("punctuationController", ["$http", "$interval", function ($http, $interval) {
            var vm = this;
            var correctAnswer;
            var originalSentences = [];
            var sentences = [];
            var timer = null;

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
            var obscurePunctuation = function(arr){
                arr = arr.replace(/[.,?!]/g, "*");
                return arr;
            };

            var unobscurePunctuation = function (arr, value) {
                arr = arr.replace("*", value);
                return arr;
            };

            // Gets a new random question
            var getRandomQuestion = function () {

                //checks if we have any questions left, otherwise we simply make new ones
                if (sentences.length <= 0) {
                    sentences = shuffleArray(angular.copy(originalSentences));
                }

                vm.punctuationMarks = shuffleArray(vm.punctuationMarks);

                correctAnswer = sentences.pop();
                vm.sentence = obscurePunctuation(correctAnswer);
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

            vm.sentence;
            vm.punctuationMarks = [".", ",", "?", "!"];
            vm.pageTitle = "Punctuation Exercise!";
            vm.pageDesc = [
                "Use the words listed to build sentences, you have 10 seconds to answer.",
                "You get 1 point for every correct answer!"
            ];
            vm.score = 0;
            vm.count = 0;

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
                timer = $interval(vm.checkAnswer, 10000);
            };

            // Check the answer
            vm.checkAnswer = function (answer) {
                // removes these classes from the score label
                removeFromElementClassList("scoreLabel", ["label-success", "label-warning", "label-danger"])

                // new timer
                $interval.cancel(timer);
                timer = $interval(vm.checkAnswer, 10000);

                // unobscure the punctuation mark
                answer = unobscurePunctuation(vm.sentence, answer);

                // If answer is correct
                if (answer === correctAnswer) {

                    addToElementClassList("scoreLabel", ["label-success"]);
                    vm.score++;
                }
                else { // if answer is incorrect 

                    addToElementClassList("scoreLabel", ["label-warning"]);
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