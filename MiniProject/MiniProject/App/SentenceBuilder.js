(function () {

    var app = angular.module("sentenceBuilder", [])
        .controller("sentenceBuilderController", ["$http", function ($http) {
            var vm = this;
            var answer;
            var originalSentences = [];
            var sentences = [];

            var getQuestion = function () {
                answer = sentences.pop();
                vm.shuffledWords = shuffleArray(answer.split(" "));
            };

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

            vm.shuffledWords = [];
            vm.pageTitle = "Build Sentences!";
            vm.pageDesc = ["Use the words listed to build sentences, you have 10 seconds to answer.", "You get 1 point for every correct sentence, but beware, you get one point deducted if you use any invalid words!"];
            vm.score = 0;

            vm.inAnswer = function (value) {
                if (vm.answer && vm.answer.length) {
                    return vm.answer.split(" ").indexOf(value) >= 0;
                }
                return false;
            };

            vm.startQuiz = function () {
                document.getElementById("startBtn").classList.add("hidden");
                document.getElementById("quizDiv").classList.remove("hidden");
                getQuestion();
            };

            vm.checkInput = function () {
                var words = vm.answer.split(" ");
                vm.extraWords = [];
                for (var i = 0, j = words.length; i < j; i++) {
                    if (answer.indexOf(words[i]) < 0) {
                        vm.extraWords.push(words[i]);
                    }
                }
                var extraWordsDiv = document.getElementById("extraWordsDiv").classList;
                if (vm.extraWords.length) {
                    if (extraWordsDiv.contains("hidden")) {
                        extraWordsDiv.remove("hidden");
                    }
                }
                else {
                    if (!extraWordsDiv.contains("hidden")) {
                        extraWordsDiv.add("hidden");
                    }
                }
            };

            vm.checkAnswer = function () {
                var scoreLabel = document.getElementById("scoreLabel").classList;
                if (scoreLabel.contains("label-default")) {
                    scoreLabel.remove("label-default");
                }
                if(scoreLabel.contains("label-success")){
                    scoreLabel.remove("label-success");
                }
                if (scoreLabel.contains("label-warning")) {
                    scoreLabel.remove("label-warning");
                }
                if (scoreLabel.contains("label-danger")) {
                    scoreLabel.remove("label-danger");
                }
                var extraWordsDiv = document.getElementById("extraWordsDiv").classList;
                if (!extraWordsDiv.contains("hidden")) {
                    extraWordsDiv.add("hidden");
                }

                if (vm.answer === answer) {
                    vm.extraWords = null;
                    vm.answer = null;
                    scoreLabel.add("label-success");
                    vm.score++;
                    if (sentences.length > 0) {
                        getQuestion();
                    }
                    else {
                        sentences = shuffleArray(angular.copy(originalSentences));
                        getQuestion();
                    }
                }
                else {
                    if (vm.extraWords && vm.extraWords.length > 0) {
                        vm.score--;
                        scoreLabel.add("label-danger");
                    }
                    else {
                        scoreLabel.add("label-warning");
                    }
                    vm.answer = null;

                    if (sentences.length > 0) {
                        getQuestion();
                    }
                    else {
                        sentences = shuffleArray(angular.copy(originalSentences));
                        getQuestion();
                    }
                }
            };

            vm.init = function () {
                document.getElementById("sentenceDiv").classList.remove("hidden");
                vm.getData();
            };

            vm.getData = function () {
                $http.get("/api/sentences/get")
                    .then(function (response) {
                        originalSentences = response.data;
                        sentences = shuffleArray(angular.copy(originalSentences));
                        document.getElementById("startBtn").classList.remove("disabled");
                    });
            };
        }]);
})();