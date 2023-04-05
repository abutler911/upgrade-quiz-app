document.addEventListener("DOMContentLoaded", function () {
  const showAnswerButton = document.getElementById("show-answer");
  const answerElement = document.querySelector(".answer");
  const showAnswersCheckbox = document.getElementById("showAnswersCheckbox");

  showAnswerButton.addEventListener("click", function () {
    if (answerElement.style.opacity == "0") {
      answerElement.style.opacity = "1";
      answerElement.style.maxHeight = "1000px";
      showAnswerButton.textContent = "Hide Answer";
    } else {
      answerElement.style.opacity = "0";
      answerElement.style.maxHeight = "0";
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
