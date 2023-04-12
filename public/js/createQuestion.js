// const form = document.getElementById("create-question-form");

// form.addEventListener("submit", async (event) => {
//   event.preventDefault();

//   const question = document.getElementById("question").value;
//   const checkboxes = document.querySelectorAll(
//     'input[name="category"]:checked'
//   );
//   const category = [];
//   checkboxes.forEach((checkbox) => {
//     category.push(checkbox.value);
//   });
//   const answer = document.getElementById("answer").value;

//   const response = await fetch("/questions/create", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ question, category, answer }),
//   });
//   console.log(response);

//   const result = await response.json();

//   if (response.ok) {
//     alert(result.message);
//     form.reset();
//   } else {
//     alert("Error creating the question. Please try again.");
//   }
// });

const form = document.getElementById("create-question-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = document.getElementById("question").value;
  const categorySelect = document.getElementById("category");
  const category = Array.from(categorySelect.selectedOptions).map(
    (option) => option.value
  );
  const answer = document.getElementById("answer").value;

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
    alert(result.message);
    form.reset();
  } else {
    alert("Error creating the question. Please try again.");
  }
});
