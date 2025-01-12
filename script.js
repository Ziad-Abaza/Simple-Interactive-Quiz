class QuizApp {
  constructor() {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.timeLeft = 60;
    this.timerInterval = null;
    this.init();
  }

  async init() {
    await this.loadQuestions();
    this.startQuiz();
    this.preventCheating(); 
  }

  async loadQuestions() {
    try {
      const response = await fetch("questions.json");
      this.questions = await response.json();
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  }

  startQuiz() {
    this.updateQuestion();
    this.startTimer();
    this.setupEventListeners();
  }

  updateQuestion() {
    const question = this.questions[this.currentQuestionIndex];
    document.getElementById("question").textContent = question.question;
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";
    question.options.forEach((option, index) => {
      const optionElement = document.createElement("div");
      optionElement.classList.add("option");
      optionElement.textContent = option;
      optionElement.addEventListener("click", () => this.selectAnswer(option));
      optionsContainer.appendChild(optionElement);
    });
    this.updateProgress();
  }

  selectAnswer(selectedOption) {
    const question = this.questions[this.currentQuestionIndex];
    if (selectedOption === question.answer) {
      this.score++;
    }
    this.nextQuestion();
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.questions.length) {
      this.updateQuestion();
    } else {
      this.endQuiz();
    }
  }

  updateProgress() {
    const progressFill = document.querySelector(".progress-fill");
    const progress =
      ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    document.getElementById("current-question").textContent =
      this.currentQuestionIndex + 1;
    document.getElementById("total-questions").textContent =
      this.questions.length;
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      document.getElementById("timer").textContent = this.formatTime(
        this.timeLeft
      );
      if (this.timeLeft <= 0) {
        this.endQuiz();
      }
    }, 1000);
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  endQuiz() {
    clearInterval(this.timerInterval);
    document.querySelector(".quiz-container").classList.add("hidden");
    document.querySelector(".results-container").classList.remove("hidden");
    document.getElementById("score").textContent = this.score;
    document.getElementById("total").textContent = this.questions.length;
  }

  setupEventListeners() {
    document
      .getElementById("next-btn")
      .addEventListener("click", () => this.nextQuestion());
    document
      .getElementById("restart-btn")
      .addEventListener("click", () => window.location.reload());
  }

  preventCheating() {
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
        alert("Developer tools are disabled during the quiz.");
      }
    });

    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      alert("Right-click is disabled during the quiz.");
    });

    document.addEventListener("copy", (e) => {
      e.preventDefault();
      alert("Copying text is disabled during the quiz.");
    });
  }
}

new QuizApp();
