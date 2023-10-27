window.onload = () => {
    // Selecting elements from the HTML document
    let countSpan = document.querySelector(".count-question #count");
    let bulletsContainer = document.querySelector(".bullets .spans-container");
    let bullet = document.querySelector(".bullets");
    let quizArea = document.querySelector(".quiz-area");
    let answerArea = document.querySelector(".answer-area");
    let btnSubmit = document.querySelector(".btn-submit");
    let resultContainer = document.querySelector(".quiz-app .results");
    let countDownElement = document.querySelector(".bullets .timer");

    // Setting initial variables
    let currentIndex = 0;
    let randomIndexes;
    let numberOfCorrectAnswer = 0; // Count of correct answers
    let countDownInterval; // Timer interval for countdown

    // Function to fetch questions from a database
    function gitQuestion() {
        let request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let questionObject = JSON.parse(this.responseText);
                let questionCount = 10; // Number of questions to fetch

                // Generating random indexes to select questions
                randomIndexes = generateRandomIndexes(questionCount);

                // Creating bullet points for questions
                createBullets(questionCount);

                // Adding the first question
                addData(questionObject[randomIndexes[currentIndex]], questionCount);

                // Handling the submit button click event
                btnSubmit.onclick = () => {
                    let rightAnswer = questionObject[randomIndexes[currentIndex]].right_answer;
                    currentIndex++;
                    clearInterval(countDownInterval); // Stop the timer
                    countDown(6, questionCount); // Start the timer for the next question
                    checkAnswer(rightAnswer, questionCount);
                    quizArea.innerHTML = ''; // Remove previous question
                    answerArea.innerHTML = ''; // Remove previous answers
                    addData(questionObject[randomIndexes[currentIndex]], questionCount); // Add the next question
                    handleBullets(); // Update the bullet points
                    showResults(questionCount); // Show results if all questions are answered
                }
            }
        }

        request.open("GET", "Question.json", true); // Fetch questions from a JSON file
        request.send();
    }

    // Function to create bullet points for questions
    function createBullets(ring) {
        countSpan.innerHTML = ring; // Display the total number of questions
        for (let i = 1; i <= ring; i++) {
            let spans = document.createElement("span");
            if (i === 1) {
                spans.classList.add('active'); // Add 'active' class to the first bullet
            }
            bulletsContainer.appendChild(spans); // Append bullet points
        }
    }

    // Function to add question and answer options
    function addData(obj, count) {
        if (currentIndex < count) {
            // Create a heading for the question
            let questionTitle = document.createElement('h2');
            let questionText = document.createTextNode(obj['question']);
            questionTitle.appendChild(questionText);
            quizArea.appendChild(questionTitle);

            // Create answer options
            for (let i = 1; i <= 4; i++) {
                let answerDiv = document.createElement('div');
                answerDiv.classList.add('answer');
                let radioElement = document.createElement('input');
                radioElement.name = 'question';
                radioElement.type = 'radio';
                radioElement.id = `answer-${i}`;
                radioElement.dataset.answer = obj[`answer-${i}`];

                let label = document.createElement('label');
                label.htmlFor = `answer-${i}`;
                let labelText = document.createTextNode(obj[`answer-${i}`]);

                label.appendChild(labelText);
                answerDiv.appendChild(radioElement);
                answerDiv.appendChild(label);
                answerArea.appendChild(answerDiv);
            }
        }
    }

    // Function to check the selected answer
    function checkAnswer(answer, limit) {
        let answers = document.getElementsByName("question");
        let chooseAnswer;
        if (currentIndex < limit) {
            for (let i = 0; i < 4; i++) {
                if (answers[i].checked) {
                    chooseAnswer = answers[i].dataset.answer;
                }
            }
            if (answer === chooseAnswer) {
                numberOfCorrectAnswer++; // Increment correct answer count
            }
        }
    }

    // Function to handle bullet points navigation
    function handleBullets() {
        let bulletsSpans = document.querySelectorAll(".bullets .spans-container span");
        let arrOfSpans = Array.from(bulletsSpans);

        arrOfSpans.forEach((span, index) => {
            if (currentIndex === index) {
                span.classList.add('active'); // Add 'active' class to the current bullet
            }
        });
    }

    // Function to show results when all questions are answered
    function showResults(End) {
        let getBackResult;
        if (currentIndex === End) {
            quizArea.remove();
            answerArea.remove();
            bullet.remove();
            btnSubmit.remove();

            getBackResult = `You have answered <span>${numberOfCorrectAnswer}</span> of the <span id="count">${End}</span> questions correctly.`;
            resultContainer.innerHTML = getBackResult; // Display the results
        }
    }

    // Function for the countdown timer
    function countDown(timer, countQuestion) {
        if (currentIndex < countQuestion) {
            let minutes, seconds;
            countDownInterval = setInterval(() => {
                minutes = parseInt(timer / 60);
                seconds = parseInt(timer % 60);
                minutes = minutes < 10 ? `0${minutes}` : minutes;
                seconds = seconds < 10 ? `0${seconds}` : seconds;
                countDownElement.innerHTML = `<span class="min">${minutes}</span> : <span class="sec">${seconds}</span>`;
                if (--timer < 0) {
                    clearInterval(countDownInterval); // Stop the timer
                    btnSubmit.click(); // Automatically click the submit button when time is up
                }
            }, 15000);
        }
    }

    // Function to generate random indexes for selecting questions
    function generateRandomIndexes(count) {
        let randomIndexes = [];
        while (randomIndexes.length < count) {
            let randomIndex = Math.floor(Math.random() * count);
            if (!randomIndexes.includes(randomIndex)) {
                randomIndexes.push(randomIndex);
            }
        }
        return randomIndexes;
    }

    // Start fetching questions
    gitQuestion();
}
