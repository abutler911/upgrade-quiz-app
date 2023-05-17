document.addEventListener("DOMContentLoaded", function () {
  const answerButtons = document.querySelectorAll(".answer-button");
  answerButtons.forEach((button) => {
    button.addEventListener("click", showAnswer);
  });

  function showAnswer(event) {
    const button = event.target;
    const question = button.nextElementSibling;
    const weatherInfo = button.closest(".weather-info");
    const dataIndex = Array.from(weatherInfo.parentElement.children).indexOf(
      weatherInfo
    );
    const data = weatherData[dataIndex];

    if (question.textContent.includes("Legal to depart?")) {
      question.textContent = `Legal to depart? ${data.legalToDepart}`;
    } else if (question.textContent.includes("Is a 2nd alternate required?")) {
      question.textContent = `Is a 2nd alternate required? ${data.secondAlternateRequired}`;
    }

    button.style.display = "none";
    question.style.display = "inline";
  }
});
