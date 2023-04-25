document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("create-question-form");

  function displayNotification(message, isSuccess = true) {
    const notification = document.createElement("div");
    notification.className = `notification ${
      isSuccess ? "is-success" : "is-danger"
    }`;
    notification.textContent = message;

    const closeButton = document.createElement("button");
    closeButton.className = "delete";
    closeButton.addEventListener("click", () => {
      notification.remove();
    });
    notification.appendChild(closeButton);

    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 5000);
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
    console.log(response);

    const result = await response.json();

    if (response.ok) {
      displayNotification(result.message, true);

      // Store the selected category
      const selectedCategory = categorySelect.value;

      // Reset the form
      form.reset();

      // Set the category field back to the stored value
      categorySelect.value = selectedCategory;
    } else {
      displayNotification(
        "Error creating the question. Please try again.",
        false
      );
    }
  });

  // Initialize Select2 on the category selector
  const categorySelect = document.querySelector(".category-select");
  if (categorySelect) {
    $(categorySelect).select2({
      placeholder: "Select a category", // Set a placeholder for the dropdown
      allowClear: true, // Allow clearing the selection
    });
  }
});
