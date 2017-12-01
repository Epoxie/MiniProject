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

            // Checks if a word is unique in the sentence
            var isUnique = function (word) {
                var correctWords = answer.split(" ");
                var words = vm.answer.replace("&nbsp;", " ").split(" ");
                var num = 0;
                for (var i = 0, j = correctWords.length; i < j; i++) {
                    if (correctWords[i] == word) {
                        num++;
                    }
                    if (i < words.length && words[i] == word) {
                        num--;
                    }
                };
                return num == 0;
            };
            // Checks if a word is in the right place
            var inRightPlace = function (word) {
                var index = vm.answer.replace("&nbsp;", " ").split(" ").lastIndexOf(word);
                var words = answer.split(" ");

                return words[index] == word;
            };
            // Checks if the answer contains the current word
            var answerContains = function (word) {
                if (vm.answer && vm.answer.length) {
                    var words = vm.answer.replace("&nbsp;", " ").split(" ");
                    return words.lastIndexOf(word) > -1;
                }
                return false;
            };

            // will be called 1 second after vm.checkAnswer()
            var getNewRandomQuestion = function () {
                // Fix things
                $interval.cancel(timer);
                removeFromElementClassList("correctAnswerLabel", ["label-success", "label-warning", "label-danger"])
                vm.correctAnswer = null;
                vm.invalidWords = null;
                vm.answer = null;
                answer = null;
            vm.shuffledWords = [];

                // Moved this down here, and changed it a little so there wouldn't be an extra 1 second until redirecting
                // return
            sessionStorage.answeredQuestions++;
                if (vm.count == vm.Maxcount) {
                    if (sessionStorage.loopList != null && sessionStorage.loopList.length > 1) {
                        var adress = sessionStorage.loopList.slice(0, sessionStorage.loopList.indexOf("/")) // becomes the first adress without the '/'
                        sessionStorage.loopList = sessionStorage.loopList.slice(sessionStorage.loopList.indexOf("/") + 1); // removes that first adress and the '/'
                        document.location.href = document.location.href.slice(0, document.location.href.indexOf("/Home")) + "/Home/" + adress; // sets the webpage to Home/adress
                    }
                    else {
                        document.location.href = document.location.href.slice(0, document.location.href.indexOf("/Home")); // just goes back 
                    }
                }
                else {
                    // re-enable all the buttons
                    var btns = document.getElementsByClassName("btn");
                    for (var i = 0, j = btns.length; i < j; i++) {
                        if (btns[i].getAttribute("id") == null) {
                            btns[i].setAttribute("id", "tmpBtnId" + i);
                        }
                        removeFromElementClassList(btns[i].getAttribute("id"), ["disabled"]);
                    };


                    // Re-enable the contenteditable span
                    var inputSpan = document.getElementById("inputSpan");
                    inputSpan.innerHTML = "";
                    inputSpan.setAttribute("contenteditable", "true");

                    // new question
                    getRandomQuestion();

                    // new timer
                    timer = $interval(vm.checkAnswer, time);
                }
                vm.count++;
            };
            // Gets the sentences from the database
            var getData = function () {
                $http.get("/api/sentences/get")
                    .then(function (response) {
                        originalSentences = response.data;
                        sentences = shuffleArray(angular.copy(originalSentences));

                        if (sessionStorage.loopList != null) {
                            vm.score = parseInt(sessionStorage.highScore);
                            vm.Maxcount = parseInt(sessionStorage.answeredQuestions);
                            vm.count = parseInt(sessionStorage.answeredQuestions);
                            removeFromElementClassList("quizDiv", ["hidden"]);
                            addToElementClassList("startBtn", ["hidden"]);
                            getRandomQuestion();
                        }
                        else {
                            if (sessionStorage.sentenceVar != null) {
                                vm.Maxcount = (parseInt(sessionStorage.sentenceVar) - 1);
                            }
                            removeFromElementClassList("startBtn", ["disabled"]);
                        }
                    });
            };

            //############ Accessible from the markup ############//

            // Some more variables
            vm.shuffledWords = [];
            vm.correctAnswer;
            vm.score = 0;
            vm.count = 0;
            vm.pageTitle = "Build Sentences!";
            vm.pageDesc = [
                "Use the words listed to build sentences, you have 30 seconds to answer.",
                "You can use both the word buttons and the textbox directly to build the sentences.",
                "You get 1 point for every correct sentence, but beware; you lose one point if you use any invalid words!"
            ];

            // functions to set the colour of the buttons
            vm.isGreen = function (word) {
                return answerContains(word) && inRightPlace(word) && isUnique(word);
                };
            vm.isBlue = function (word) {
                return answerContains(word) && inRightPlace(word) && !isUnique(word);
                };
            vm.isOrange = function (word) {
                return answerContains(word) && !inRightPlace(word);
            };
            vm.isWhite = function (word) {
                return !answerContains(word);
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

                if (index >= 0 && vm.isOrange(word)) {
                    words.splice(index, 1)
                }
                else if(!vm.isGreen(word)) {
                    words.push(word);
                }

                vm.answer = words.join(" ").trim();
                if (vm.answer == answer) {
                    vm.checkAnswer();
                }
                else {
                vm.checkInput();
                }
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
                    };
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
                // cancel the timer
                $interval.cancel(timer);

                // disable all the buttons
                var btns = document.getElementsByClassName("btn");
                for (var i = 0, j = btns.length; i < j; i++) {
                    if (btns[i].getAttribute("id") == null) {
                        btns[i].setAttribute("id", "tmpBtnId" + i);
                    }
                    addToElementClassList(btns[i].getAttribute("id"), ["disabled"]);
                };

                // reset the scoreLabel
                removeFromElementClassList("scoreLabel", ["label-success", "label-warning", "label-danger"])  

                // disable the contenteditable span
                var inputSpan = document.getElementById("inputSpan");
                inputSpan.setAttribute("contenteditable", "false");
                inputSpan.innerHTML = vm.answer;

                // Makes sure that the div with the invalid words are hidden
                addToElementClassList("invalidWordsDiv", ["hidden"]);

                if (!vm.answer) {
                    vm.answer = "";
                }
                vm.answer = vm.answer.trim();
                vm.correctAnswer = answer;

                // If answer is correct
                if (vm.answer == answer) {
                    addToElementClassList("scoreLabel", ["label-success"]);
                    addToElementClassList("correctAnswerLabel", ["label-success"]);
                    vm.score++;
                    sessionStorage.highScore++;
                }
                else { // if answer is incorrect 
                    // Checks if there are any invalid words
                    if (vm.invalidWords && vm.invalidWords.length) {
                        vm.score--;
                        sessionStorage.highScore--;
                        addToElementClassList("scoreLabel", ["label-danger"]);
                        addToElementClassList("correctAnswerLabel", ["label-danger"]);
                    }
                    else {
                        addToElementClassList("scoreLabel", ["label-warning"]);
                        addToElementClassList("correctAnswerLabel", ["label-warning"]);
                    }
                }

                timer = $interval(getNewRandomQuestion, 1000);
            };

            // Will be called when controller div is initialised
            vm.init = function () {
                removeFromElementClassList("sentenceDiv", ["hidden"]);
                getData();

            };

            vm.startQuiz = function () {
                getRandomQuestion();
                addToElementClassList("startBtn", ["hidden"]);
                removeFromElementClassList("quizDiv", ["hidden"]);
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