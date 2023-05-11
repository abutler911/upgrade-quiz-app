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
  setupSubmitRatingButton();
}
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

let questions = [];
let currentQuestionIndex = 0;

function sortQuestionsByRating(questions) {
  console.log("Before sorting:", questions);
  const sortedQuestions = questions.sort((a, b) => b.rating - a.rating);
  console.log("After sorting:", sortedQuestions);
  return sortedQuestions;
}

async function fetchQuestions() {
  try {
    const response = await fetch("/api/questions");
    questions = await response.json();

    questions = sortQuestionsByRating(questions); // NEW CODE
    displayQuestion(currentQuestionIndex);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}
// async function fetchQuestions() {
//   try {
//     const response = await fetch("/api/questions");
//     questions = await response.json();

//     console.log("Questions:", questions);
//     const questionIds = questions.map((question) => question._id);
//     const ratings = await fetchRatings(questionIds);

//     questions = questions.map((question) => {
//       const rating = ratings.find((r) => r.questionId === question._id);
//       return {
//         ...question,
//         rating: rating ? rating.rating : 0,
//         interval: rating ? rating.interval : 1,
//       };
//     });

//     questions = sortQuestionsByRating(questions);
//     displayQuestion(currentQuestionIndex);
//   } catch (error) {
//     console.error("Error fetching questions:", error);
//   }
// }
// async function fetchQuestions() {
//   try {
//     const response = await fetch("/api/questions");
//     questions = await response.json();

//     const currentTime = Date.now();
//     questions.forEach((question) => {
//       const lastSeen = new Date(question.lastSeen).getTime();
//       const hoursSinceLastSeen = Math.floor(
//         (currentTime - lastSeen) / 1000 / 60 / 60
//       );

//       const adjustedRating = 6 - question.rating;
//       const spacedRepScore = adjustedRating * hoursSinceLastSeen;

//       question.spacedRepScore = spacedRepScore;
//     });

//     questions.sort((a, b) => b.spacedRepScore - a.spacedRepScore);

//     console.log("Questions:", questions);
//     const questionIds = questions.map((question) => question._id);
//     const ratings = await fetchRatings(questionIds);

//     questions = questions.map((question) => {
//       const rating = ratings.find((r) => r.questionId === question._id);
//       return {
//         ...question,
//         rating: rating ? rating.rating : 0,
//         interval: rating ? rating.interval : 1,
//       };
//     });

//     displayQuestion(currentQuestionIndex);
//   } catch (error) {
//     console.error("Error fetching questions:", error);
//   }
// }

function updateInterval(interval, rating) {
  if (rating < 3) {
    return 1;
  } else {
    if (interval === 1) {
      return 3;
    } else {
      return Math.ceil(interval * rating);
    }
  }
}

async function fetchRatings(questionIds) {
  try {
    const response = await fetch("api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionIds }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching ratings.", error);
  }
}

function displayQuestion() {
  const questionElement = document.getElementById("question");
  const answerElement = document.getElementById("answer");
  const categoryElement = document.getElementById("category");
  const lastSeenElement = document.getElementById("last-seen");

  if (questions.length > 0 && currentQuestionIndex < questions.length) {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;
    answerElement.innerText = currentQuestion.answer;
    // categoryElement.innerText = `Categories(s): ${currentQuestion.category}`;
    // setRating(currentQuestion.rating || 0);
    // document.getElementById("difficulty").value = currentQuestion.difficulty;
    categoryElement.innerText = `Categories(s): ${currentQuestion.category}`;
    lastSeenElement.innerText = `Last seen: ${formatDate(
      currentQuestion.lastSeen
    )}`;
    setDifficultyStars(currentQuestion.difficulty);
    updateLastSeen(currentQuestion._id);
  } else {
    questionElement.innerText = "No questions to display";
    answerElement.innerText = "No answers to display";
    categoryElement.innerText = "No categories to display";
  }

  updateQuestionCount();
}

function setDifficultyStars(difficulty) {
  const starElements = document.querySelectorAll(".rating span");

  starElements.forEach((starElement, index) => {
    if (index < difficulty) {
      starElement.classList.add("selected");
    } else {
      starElement.classList.remove("selected");
    }
  });
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
    hideSuccessMessage();
  });

  document.getElementById("prev-question").addEventListener("click", () => {
    navigateToPreviousQuestion();
    hideSuccessMessage();
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
    hideAnswer();
  }
}

function navigateToPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion(currentQuestionIndex);
    hideAnswer();
  }
}

function setupSubmitRatingButton() {
  const submitRatingButton = document.getElementById("submit-rating");
  submitRatingButton.addEventListener("click", () => {
    submitDifficulty();
  });
}
async function submitDifficulty() {
  const question = questions[currentQuestionIndex];
  const questionId = question._id;
  const difficulty = document.querySelectorAll(".rating span.selected").length;
  const currentInterval = question.interval;
  const updatedInterval = updateInterval(currentInterval, difficulty);

  try {
    const response = await fetch(`/api/question/${questionId}/difficulty`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ difficulty, interval: updatedInterval }),
    });

    if (response.ok) {
      console.log("Question difficulty updated successfully");
      updateQuestionRating(questionId, difficulty);
      alert("Rating updated successfully!");
    } else {
      console.error("Error updating question difficulty:", response.statusText);
    }
  } catch (error) {
    console.error("Error updating question difficulty:", error);
  }
}

function showSuccessMessage() {
  const successMessage = document.getElementById("rating-success");
  successMessage.classList.remove("is-hidden");
}

function updateQuestionRating(questionId, rating) {
  const question = questions.find((q) => q._id === questionId);
  if (!question.userRating) {
    question.userRating = {};
  }
  question.userRating.rating = rating;
}

function hideAnswer() {
  const answerElement = document.querySelector(".card-text.answer");
  const showAnswerButton = document.querySelector("#show-answer");

  answerElement.classList.remove("show");
  answerElement.classList.add("hide");
  showAnswerButton.textContent = "Show Answer";
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
    // updateProgressBar();
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

// function updateProgressBar() {
//   const totalQuestions = questions.length;
//   const completedQuestions = currentQuestionIndex + 1;
//   const percentage = (completedQuestions / totalQuestions) * 100;

//   const progressBar = document.getElementById("progress-bar");
//   progressBar.style.width = percentage + "%";
// }

function updateQuestionCount() {
  const totalQuestions = questions.length;
  const completedQuestions = currentQuestionIndex + 1;
  const questionCount = document.getElementById("question-count");
  questionCount.innerHTML = `Question: ${completedQuestions} of ${totalQuestions}`;
}

const ratings = document.querySelectorAll(".rating span");

ratings.forEach((rating) => {
  rating.addEventListener("click", (e) => {
    ratings.forEach((r) => r.classList.remove("selected"));
    e.target.classList.add("selected");
    setDifficultyStars(e.target.dataset.value);
  });
});

const ratingElements = document.querySelectorAll(".rating span");

ratingElements.forEach((ratingElement) => {
  ratingElement.addEventListener("click", (event) => {
    const ratingValue = event.target.dataset.value;
    setRating(ratingValue);
  });
});

let currentRating = 0;

function setRating(ratingValue) {
  currentRating = parseInt(ratingValue, 10);
  ratingElements.forEach((ratingElement, index) => {
    ratingElement.classList.toggle("selected", index < currentRating);
  });
}
async function submitRating() {
  const questionId = questions[currentQuestionIndex]._id;
  await updateQuestionRating(questionId, currentRating);
  // navigateToNextQuestion();
}

async function updateQuestionRating(questionId, rating) {
  try {
    const response = await fetch(`/question/${questionId}/rating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questionId, rating }),
    });
    if (response.ok) {
      console.log("Question rating updated successfully");
    } else {
      console.error("Error updating question rating:", response.statusText);
    }
  } catch (error) {
    console.error("Error updating question rating:", error);
  }
}

async function updateLastSeen(questionId) {
  try {
    const response = await fetch(`/api/question/${questionId}/seen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("Question lastSeen updated successfully");
    } else {
      console.error("Error updating question lastSeen:", response.statusText);
    }
  } catch (error) {
    console.error("Error updating question lastSeen:", error);
  }
}

function hideSuccessMessage() {
  const successMessage = document.getElementById("rating-success");
  successMessage.classList.add("is-hidden");
}

document
  .getElementById("flag-for-review")
  .addEventListener("click", flagForReview);

async function flagForReview() {
  const questionId = questions[currentQuestionIndex]._id;

  try {
    const response = await fetch(`/api/question/${questionId}/flagForReview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questionId }),
    });

    if (response.ok) {
      alert("Question flagged for review successfully!");
    } else {
      alert("Failed to flag question for review. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to flag question for review. Please try again.");
  }
}
