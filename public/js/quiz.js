document.addEventListener("DOMContentLoaded", function () {
  fetchQuestions();
  const showAnswerButton = document.querySelector("#show-answer");
  const answerElement = document.querySelector(".card-text.answer");
  // const answerText = document.querySelector("#answer");
  // const categoryElement = document.querySelector("#category");

  answerElement.classList.add("hide");

  showAnswerButton.addEventListener("click", function () {
    if (answerElement.classList.contains("hide")) {
      answerElement.classList.remove("hide");
      answerElement.classList.add("show");
      showAnswerButton.textContent = "Hide Answer";
    } else {
      answerElement.classList.remove("show");
      answerElement.classList.add("hide");
      showAnswerButton.textContent = "Show Answer";
    }
  });

  let showAnswersCheckbox = document.getElementById("showAnswersCheckbox");
  showAnswersCheckbox.addEventListener("change", function () {
    const answerElement = document.querySelector(".card-text.answer");
    const showAnswerButton = document.querySelector("#show-answer");

    if (showAnswersCheckbox.checked) {
      answerElement.style.opacity = "1";
      answerElement.style.maxHeight = "1000px";
      showAnswerButton.style.display = "none";
    } else {
      answerElement.style.opacity = "0";
      answerElement.style.maxHeight = "0";
      showAnswerButton.style.display = "inline-block";
      showAnswerButton.textContent = "Show Answer";
    }
  });
});

let questions = [];
let currentQuestionIndex = 0;

function shuffleQuestions(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

document.getElementById("next-question").addEventListener("click", () => {
  if (currentQuestionIndex < questions.length - 1) {
    resetAnswerVisibility();

    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
  }
});

document.getElementById("prev-question").addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    resetAnswerVisibility();

    currentQuestionIndex--;
    displayQuestion(currentQuestionIndex);
  }
});

async function fetchQuestions() {
  try {
    const response = await fetch("/api/questions");
    fetchedQuestions = await response.json();

    questions = fetchedQuestions.map((question, index) => {
      question.order = index;
      return question;
    });

    if (questions.length > 0) {
      displayQuestion(currentQuestionIndex);
    } else {
      document.getElementById("question").innerText = "No questions to display";
      document.getElementById("answer").innerText = "No answers to display";
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

function resetAnswerVisibility() {
  const showAnswerButton = document.querySelector("#show-answer");
  const answerElement = document.querySelector(".card-text.answer");

  if (answerElement.classList.contains("show")) {
    answerElement.classList.remove("show");
    answerElement.classList.add("hide");
    showAnswerButton.textContent = "Show Answer";
  }
}

function displayQuestion() {
  const questionElement = document.getElementById("question");
  const answerElement = document.getElementById("answer");
  const categoryElement = document.getElementById("category");

  if (questions.length > 0 && currentQuestionIndex < questions.length) {
    questionElement.innerText = questions[currentQuestionIndex].question;
    answerElement.innerText = questions[currentQuestionIndex].answer;
    categoryElement.innerText = `Categories(s): ${questions[currentQuestionIndex].category}`;
  } else {
    questionElement.innerText = "No questions to display";
    answerElement.innerText = "No answers to display";
    categoryElement.innerText = "No categories to display";
  }

  updateProgressBar();
  updateQuestionCount();
}

questions = questions.map((question, index) => {
  question.order = index;
  return question;
});

let selectedCategory = "";

$("#categoryFilter").on("change", function () {
  selectedCategory = $(this).val() || [];
  loadQuestions();
});

async function loadQuestions() {
  try {
    const response = await fetch("/api/questions");
    const data = await response.json();
    questions = data.filter(
      (question) =>
        selectedCategory.length === 0 ||
        selectedCategory.some((selectedCategory) =>
          question.category.includes(selectedCategory)
        )
    );
    let randomizeCheckbox = document.getElementById("randomizeCheckbox");

    if (randomizeCheckbox.checked) {
      shuffleQuestions(questions);
    }
    currentQuestionIndex = 0;
    displayQuestion();
    updateProgressBar();
  } catch (err) {
    console.error("Error fetching questions:", err);
  }
}

document
  .getElementById("categoryFilter")
  .addEventListener("change", function (event) {
    selectedCategory = event.target.value;
    loadQuestions();
  });

$(document).ready(function () {
  $("#categoryFilter").select2({
    width: "100%",
    placeholder: "All Categories",
  });
});

document
  .getElementById("randomizeCheckbox")
  .addEventListener("change", function () {
    loadQuestions();
  });

function updateProgressBar() {
  const totalQuestions = questions.length;
  const completedQuestions = currentQuestionIndex + 1;
  const percentage = (completedQuestions / totalQuestions) * 100;

  const progressBar = document.getElementById("progress-bar");
  const questionCount = document.getElementById("question-count");
  progressBar.style.width = percentage + "%";
  questionCount.innerHTML = `Question: ${completedQuestions} of ${totalQuestions}`;
}

function loadNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= questions.length) {
    currentQuestionIndex = 0;
  }
  loadQuestion(currentQuestionIndex);
}

function loadPreviousQuestion() {
  currentQuestionIndex--;
  if (currentQuestionIndex < 0) {
    currentQuestionIndex = questions.length - 1;
  }
  loadQuestion(currentQuestionIndex);
}
loadQuestions();
