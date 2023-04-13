document.addEventListener("DOMContentLoaded", function () {
  fetchQuestions();
  const showAnswerButton = document.querySelector("#show-answer");
  const answerElement = document.querySelector(".card-text.answer");
  const showAnswersCheckbox = document.getElementById("showAnswersCheckbox");

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
});

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

let questions = [];
let currentQuestionIndex = 0;

document.getElementById("next-question").addEventListener("click", () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
  }
});

document.getElementById("prev-question").addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
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

function displayQuestion() {
  const questionElement = document.getElementById("question");
  const answerElement = document.getElementById("answer");

  if (questions.length > 0 && currentQuestionIndex < questions.length) {
    questionElement.innerText = questions[currentQuestionIndex].question;
    answerElement.innerText = questions[currentQuestionIndex].answer;
    answerElement.classList.add("hide");
  } else {
    questionElement.innerText = "No questions to display";
    answerElement.innerText = "No answers to display";
  }
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

questions = questions.map((question, index) => {
  question.order = index;
  return question;
});

// Add a variable to store the selected category
let selectedCategory = "";
document
  .getElementById("categoryFilter")
  .addEventListener("change", function (event) {
    selectedCategories = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    loadQuestions();
  });
// Update the loadQuestions function to filter based on the selected category
async function loadQuestions() {
  try {
    const response = await fetch("/api/questions");
    const data = await response.json();
    if (selectedCategory === "") {
      questions = data;
    } else {
      // Filter questions based on the selected category
      questions = data.filter((question) =>
        question.category.includes(selectedCategory)
      );
    }
    // if (selectedCategories.length > 0) {
    //   questions = data.filter((question) =>
    //     selectedCategories.some((category) =>
    //       question.category.includes(category)
    //     )
    //   );
    // } else {
    //   questions = data;
    // }

    currentQuestionIndex = 0;
    displayQuestion();
  } catch (err) {
    console.error("Error fetching questions:", err);
  }
}

// Add an event listener for the categoryFilter element
document
  .getElementById("categoryFilter")
  .addEventListener("change", function (event) {
    selectedCategory = event.target.value;
    loadQuestions();
  });

// Call loadQuestions when the page is loaded
loadQuestions();
