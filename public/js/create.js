document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("create-question-form");

  function displayNotification(message, isSuccess = true) {
    const notification = document.createElement("div");
    notification.className = `notification ${
      isSuccess ? "is-success" : "is-danger"
    } fade-in`;
    notification.textContent = message;

    const closeButton = document.createElement("button");
    closeButton.className = "delete";
    closeButton.addEventListener("click", () => {
      notification.classList.add("fade-out");
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
    notification.appendChild(closeButton);

    const notificationContainer = document.querySelector(
      ".notification-container"
    );
    notificationContainer.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("fade-out");
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const questionInput = document.getElementById("question");
    const categorySelect = document.getElementById("category");
    const answerInput = document.getElementById("answer");

    const question = questionInput.value;
    const category = Array.from(categorySelect.selectedOptions).map(
      (option) => option.value
    );
    const answer = answerInput.value;

    const response = await fetch("/questions/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, category, answer }),
    });

    const result = await response.json();

    if (response.ok) {
      displayNotification(result.message, true);
      const selectedCategory = categorySelect.value;
      form.reset();
      categorySelect.value = selectedCategory;
    } else {
      displayNotification(
        "Error creating the question. Please try again.",
        false
      );
    }
  });

  // Initialize Select2 on the category selector
  const categorySelectElement = document.querySelector(".category-select");
  if (categorySelectElement) {
    $(categorySelectElement).select2({
      placeholder: "Select a category",
      allowClear: true,
    });
  }
});
