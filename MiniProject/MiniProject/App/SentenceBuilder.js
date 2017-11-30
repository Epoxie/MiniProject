(function () {
    // TODO: checkInput() doesn't work as it should.

    // Tried using a "Controller as" approach
    // https://toddmotto.com/digging-into-angulars-controller-as-syntax/
    var app = angular.module("sentenceBuilder", [])
        .controller("sentenceBuilderController", ["$http", "$interval", function ($http, $interval) {
            // Some variables
            var vm = this;
            var answer;
            var originalSentences = [];
            var sentences = [];
            var timer = null;
            var time = 30000;

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
                "Use the words listed to build sentences, you have 30 seconds to answer.",
                "You can use both the word buttons and the textbox directly to build the sentences.",
                "For every correct word, that word's button will turn green.",
                "For every word in the wrong order, that word's button will turn orange",
                "You get 1 point for every correct sentence, but beware; you get one point deducted if you use any invalid words!"
            ];
            vm.score = 0;
            vm.count = 0;
            vm.Maxcount = 1;

            // Update the answer when clicking the word buttons
            vm.updateAnswer = function (word) {
                if (!vm.answer) {
                    vm.answer = "";
                }
                var words = vm.answer.split(" ");
                var index = words.indexOf(word);

                if (index >= 0) {
                    // To see if there are more than one index for that specific word
                    var lastIndex = words.lastIndexOf(word);
                    if (index == lastIndex) {
                        words.splice(index, 1);
                    }
                    else {
                        words.splice(lastIndex, 1);
                    }
                }
                else {
                    words.push(word);
                }

                vm.answer = words.join(" ").trim();
            };

            vm.wordInRightPlace = function (word) {
                var index = vm.answer.indexOf(word);
                var correctIndex = answer.indexOf(word);
                return index == correctIndex;
            };

            // Checks if the answer contains the current word
            vm.answerContains = function (word) {
                if (vm.answer && vm.answer.length) {
                    var words = vm.answer.split(" ");
                    var index = words.indexOf(word);
                    var lastIndex = words.lastIndexOf(word);

                    // If there's only one such word in the sentence
                    if (index == lastIndex) {
                        return index > -1;
                    }

                    // Will add this functioanlity later
                    console.log("More than 1!1!");
                    return index > -1;
                }
                return false;
            };

            // Starts the quiz (duh)
            vm.startQuiz = function () {
                addToElementClassList("startBtn", ["hidden"]);
                removeFromElementClassList("quizDiv", ["hidden"]);
                getRandomQuestion();
                vm.Maxcount = sessionStorage.sentenceVar - 1;

                // 15 seconds until it automatically goes to a new question
                timer = $interval(vm.checkAnswer, time);
            };

            // Checks input to see if the user has inputed any invalid words.
            // TODO: fix this
            vm.checkInput = function () {
                if (vm.answer) {
                    var words = vm.answer.split(" ");
                    vm.extraWords = [];
                    var correctWords = answer.split(" ");
                    for (var i = 0, j = words.length; i < j; i++) {
                        // 
                        if (correctWords.indexOf(words[i]) < 0) {
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

                $interval.cancel(timer);

                // Makes sure that the div with the invalid words are hidden
                addToElementClassList("extraWordsDiv", ["hidden"]);

                // If answer is correct
                if (vm.answer == answer) {

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
                        if (sessionStorage.loopList.length > 1) {
                            var adress = sessionStorage.loopList.slice(0, sessionStorage.loopList.indexOf("/")) // becomes the first adress without the '/'
                            sessionStorage.loopList = sessionStorage.loopList.slice(sessionStorage.loopList.indexOf("/") + 1); // removes that first adress and the '/'
                            document.location.href = document.location.href.slice(0, document.location.href.indexOf("/Home")) + "/Home/" + adress; // sets the webpage to Home/adress
                        }
                        else
                            document.location.href = document.location.href.slice(0, document.location.href.indexOf("/Home")); // just goes back     
                    }, 1000);
                }

                // Fix things
                vm.extraWords = null;
                vm.answer = null;
                vm.count++;

                // gets a new questions
                getRandomQuestion();

                // new timer
                timer = $interval(vm.checkAnswer, time);
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