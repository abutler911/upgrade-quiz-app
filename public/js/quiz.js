document.addEventListener("DOMContentLoaded", () => {
  const showAnswerButton = document.getElementById("show-answer");
  const answerElement = document.querySelector(".answer");
  const showAnswersCheckbox = document.getElementById("showAnswersCheckbox");

  const updateAnswerVisibility = () => {
    const isChecked = showAnswersCheckbox.checked;
    answerElement.style.visibility = isChecked ? "visible" : "hidden";
    showAnswerButton.style.display = isChecked ? "none" : "inline-block";
  };

  showAnswersCheckbox.addEventListener("change", updateAnswerVisibility);

  showAnswerButton.addEventListener("click", () => {
    if (answerElement.style.visibility === "visible") {
      answerElement.style.visibility = "hidden";
      showAnswerButton.textContent = "Show Answer";
    } else {
      answerElement.style.visibility = "visible";
      showAnswerButton.textContent = "Hide Answer";
    }
  });

  updateAnswerVisibility();
});
