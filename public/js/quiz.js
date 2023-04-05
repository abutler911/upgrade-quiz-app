document.addEventListener("DOMContentLoaded", function () {
  fetchQuestions();
  const showAnswerButton = document.getElementById("show-answer");
  const answerElement = document.querySelector(".answer");
  const showAnswersCheckbox = document.getElementById("showAnswersCheckbox");

  const answerWrapper = document.querySelector(".answer-wrapper");

  showAnswerButton.addEventListener("click", () => {
    const answerElement = answerWrapper.querySelector(".answer");
    if (answerElement.style.display === "none") {
      answerElement.style.display = "block";
      showAnswerButton.textContent = "Hide Answer";
    } else {
      answerElement.style.display = "none";
      showAnswerButton.textContent = "Show Answer";
    }
  });

  showAnswersCheckbox.addEventListener("change", function () {
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
    questions = await response.json();

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

function displayQuestion(index) {
  const questionElement = document.getElementById("question");
  const answerElement = document.getElementById("answer");

  questionElement.innerText = questions[index].question;
  answerElement.innerText = questions[index].answer;
  answerElement.style.display = "none";
}
