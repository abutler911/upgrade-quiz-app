const showAnswerBtn = document.querySelector("#show-answer");
const prevQuestionBtn = document.querySelector("#prev-question");
const nextQuestionBtn = document.querySelector("#next-question");
const answer = document.querySelector(".card-text");

let currentQuestion = 0;
let questions;

// Function to update the question displayed on the page
function updateQuestion() {
  const cardTitle = document.querySelector(".card-title");
  const cardBody = document.querySelector(".card-body");
  const question = questions[currentQuestion];

  cardTitle.textContent = `Question ${currentQuestion + 1}`;
  cardBody.querySelector("h4").textContent = question.question;
  cardBody.querySelector(".card-text").textContent = question.answer;
  answer.classList.add("hide");
  showAnswerBtn.textContent = "Show Answer";
}

// Fetch questions from the server and display the first question
fetch("/quiz")
  .then((res) => res.json())
  .then((data) => {
    questions = data;
    updateQuestion();
  })
  .catch((err) => console.log(err));

// Show answer when "Show Answer" button is clicked
showAnswerBtn.addEventListener("click", () => {
  answer.classList.toggle("hide");
  showAnswerBtn.textContent =
    showAnswerBtn.textContent === "Show Answer" ? "Hide Answer" : "Show Answer";
});

// Go to previous question when "Previous Question" button is clicked
prevQuestionBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    updateQuestion();
  }
});

// Go to next question when "Next Question" button is clicked
nextQuestionBtn.addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    updateQuestion();
  }
});
