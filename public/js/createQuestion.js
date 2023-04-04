const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch("/questions/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch((error) => console.log(error));

  console.log(response);

  if (response.ok) {
    const jsonResponse = await response.json();
    alert(jsonResponse.message);
    form.reset();
  } else {
    alert("Error creating the question. Please try again.");
  }
});
