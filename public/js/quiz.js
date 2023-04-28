document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  fetchQuestions();
});

function setupEventListeners() {
  setupShowAnswerButton();
  setupShowAnswersCheckbox();
  setupNavigationButtons();
  setupCategoryFilter();
  setupRandomizeCheckbox();
}

let questions = [];
let currentQuestionIndex = 0;

async function fetchQuestions() {
  try {
    const response = await fetch("/api/questions");
    questions = await response.json();
    displayQuestion(currentQuestionIndex);
  } catch (error) {
    console.error("Error fetching questions:", error);
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

function setupShowAnswerButton() {
  const showAnswerButton = document.querySelector("#show-answer");
  const answerElement = document.querySelector(".card-text.answer");

  showAnswerButton.addEventListener("click", () => {
    toggleAnswerVisibility(answerElement, showAnswerButton);
  });
}

function setupShowAnswersCheckbox() {
  const showAnswersCheckbox = document.getElementById("showAnswersCheckbox");

  showAnswersCheckbox.addEventListener("change", () => {
    toggleAnswersWithCheckbox(showAnswersCheckbox);
  });
}

function setupNavigationButtons() {
  document.getElementById("next-question").addEventListener("click", () => {
    navigateToNextQuestion();
  });

  document.getElementById("prev-question").addEventListener("click", () => {
    navigateToPreviousQuestion();
  });
}

function setupCategoryFilter() {
  $("#categoryFilter").select2({
    width: "100%",
    placeholder: "All Categories",
  });

  $("#categoryFilter").on("change", () => {
    loadQuestionsByCategory();
  });
}

function setupRandomizeCheckbox() {
  const randomizeCheckbox = document.getElementById("randomizeCheckbox");
  randomizeCheckbox.addEventListener("change", () => {
    loadQuestionsByCategory();
  });
}

function toggleAnswerVisibility(answerElement, showAnswerButton) {
  answerElement.classList.toggle("hide");
  answerElement.classList.toggle("show");
  showAnswerButton.textContent = answerElement.classList.contains("hide")
    ? "Show Answer"
    : "Hide Answer";
}

function toggleAnswersWithCheckbox(showAnswersCheckbox) {
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
}

function navigateToNextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
  }
}

function navigateToPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion(currentQuestionIndex);
  }
}

function loadQuestionsByCategory() {
  const selectedCategory = $("#categoryFilter").val() || [];
  filterAndLoadQuestions(selectedCategory);
}

async function filterAndLoadQuestions(selectedCategory) {
  try {
    const response = await fetch("/api/questions");
    const data = await response.json();
    questions = data.filter(
      (question) =>
        selectedCategory.length === 0 ||
        selectedCategory.some((cat) => question.category.includes(cat))
    );
    const randomizeCheckbox = document.getElementById("randomizeCheckbox");
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

function shuffleQuestions(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateProgressBar() {
  const totalQuestions = questions.length;
  const completedQuestions = currentQuestionIndex + 1;
  const percentage = (completedQuestions / totalQuestions) * 100;

  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = percentage + "%";
}

function updateQuestionCount() {
  const totalQuestions = questions.length;
  const completedQuestions = currentQuestionIndex + 1;
  const questionCount = document.getElementById("question-count");
  questionCount.innerHTML = `Question: ${completedQuestions} of ${totalQuestions}`;
}
