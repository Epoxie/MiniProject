(function () {
    // TODO: fix checkInput()

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
                for (var i = 0, j = className.length; i < j; i++) {
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
                "For every word in the wrong order, that word's button will turn orange.",
                "If a particular word occurs more than once in the sentence, that word's button turns blue.",
                "You get 1 point for every correct sentence, but beware; you lose one point if you use any invalid words!"
            ];
            vm.score = 0;
            vm.count = 0;
            vm.Maxcount = 1;

            // Checks if a word is unique in the sentence
            vm.uniqueWord = function (word) {
                var words = answer.split(" ");
                var num = 0;
                for (var i = 0, j = words.length; i < j; i++) {
                    if (words[i] == word) {
                        num++;
                    }
                };
                words = vm.answer.replace("&nbsp;", " ").split(" ");
                for (var i = 0, j = words.length; i < j; i++) {
                    if (words[i] == word) {
                        num--;
                    }
                };
                console.log("Num: " + num);
                return num == 0;
            };

            // TODO: fix
            // Update the answer when clicking the word buttons
            vm.updateAnswer = function (word) {
                if (!vm.answer) {
                    vm.answer = "";
                }
                word = word.trim();
                var words = vm.answer.replace("&nbsp;", " ").split(" ");
                var index = words.lastIndexOf(word);

                if (index >= 0 && (!vm.wordInRightPlace(word) || vm.uniqueWord(word))) {
                    words.splice(index, 1);
                }
                else {
                    words.push(word);
                }

                vm.answer = words.join(" ").trim();
                vm.checkInput();
            };

            // Checks if a word is in the right place
            vm.wordInRightPlace = function (word) {
                var index = vm.answer.replace("&nbsp;", " ").split(" ").lastIndexOf(word);
                var words = answer.split(" ");

                return words[index] == word;
            };

            // Checks if the answer contains the current word
            vm.answerContains = function (word) {
                if (vm.answer && vm.answer.length) {
                    var words = vm.answer.replace("&nbsp;", " ").split(" ");
                    return words.lastIndexOf(word) > -1;
                }
                return false;
            };

            // Starts the quiz (duh)
            vm.startQuiz = function () {
                addToElementClassList("startBtn", ["hidden"]);
                removeFromElementClassList("quizDiv", ["hidden"]);
                getRandomQuestion();
                vm.Maxcount = sessionStorage.getItem("sentenceVar") - 1;

                // 30 seconds until it automatically goes to a new question
                timer = $interval(vm.checkAnswer, time);
            };

            // TODO: fix 
            // Checks input to see if the user has inputed any invalid words.
            vm.checkInput = function () {
                if (vm.answer) {
                    var words = vm.answer.replace("&nbsp;", " ").split(" ");
                    vm.invalidWords = [];
                    for (var i = 0, j = words.length; i < j; i++) {
                        // 
                        var index = answer.indexOf(words[i]);
                        if (words[i].length <= 1 && index != 0) {
                            words[i] += " ";
                        }
                        if (index < 0) {
                            vm.invalidWords.push(words[i]);
                        }
                    }

                    // Shows or hides the div with the invalid words
                    if (vm.invalidWords.length) {
                        removeFromElementClassList("invalidWordsDiv", ["hidden"]);
                    }
                    else {
                        addToElementClassList("invalidWordsDiv", ["hidden"]);
                    }
                }
                else {
                    vm.invalidWords = [];
                    addToElementClassList("invalidWordsDiv", ["hidden"]);
                }
            };

            // Check the answer
            vm.checkAnswer = function () {
                removeFromElementClassList("scoreLabel", ["label-success", "label-warning", "label-danger"])  

                // cancel the timer
                $interval.cancel(timer);

                // Makes sure that the div with the invalid words are hidden
                addToElementClassList("invalidWordsDiv", ["hidden"]);

                // If answer is correct
                if (vm.answer == answer) {

                    addToElementClassList("scoreLabel", ["label-success"]);
                    vm.score++;
                }
                else { // if answer is incorrect 

                    // Checks if there are any invalid words
                    if (vm.invalidWords && vm.invalidWords.length) {
                        vm.score--;
                        addToElementClassList("scoreLabel", ["label-danger"]);
                    }
                    else {
                        addToElementClassList("scoreLabel", ["label-warning"]);
                    }
                }

                // return
                if (vm.count == vm.Maxcount) {
                    sessionStorage.sentenceVar = null;
                    document.getElementById("answer").readOnly = true;
                    var interval = setInterval(function myfunction() {
                        clearInterval(interval); // clears interval
                        interval = null;
                        document.location.href = document.location.href.slice(0, document.location.href.indexOf("/Home"));       
                    }, 1000);
                }

                // Fix things
                vm.invalidWords = null;
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

    // To make ng-model and ng-change work with contenteditable elements
    app.directive("contenteditable", function () {
        return {
            require: "ngModel",
            restrict: "A",
            link: function (scope, element, attrs, ngModel) {

                function update() {
                    // To force the click event to fire when hitting enter, isntead of adding <div><br></div>, and other weird stuff
                    // Doesn't check if
                    var html = element.html();
                    var index = index = html.indexOf("<div>");
                    if (index >= 0) {
                        element.html(html.substring(0, index));
                        angular.element(document.getElementById("sentenceDiv")).scope().$ctrl.checkAnswer();
                    }

                    ngModel.$setViewValue(element.html());
                }

                element.on("keyup", update);

                scope.$on("$destroy", function () {
                    element.off("keyup", update);
                });

                ngModel.$render = function () {
                    element.html(ngModel.$viewValue || "");
                };
            }
        };
    });
})();