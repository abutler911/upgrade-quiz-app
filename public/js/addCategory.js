document
  .getElementById("create-category-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    fetch(event.target.action, {
      method: "POST",
      body: formData,
    }).then((response) => {
      if (response.ok) {
        const notification = document.getElementById("notification");
        notification.classList.remove("is-hidden");
        notification.classList.add("is-success");
        setTimeout(() => {
          notification.classList.add("is-hidden");
        }, 3000);
      }
    });
  });

document
  .querySelector("#notification .delete")
  .addEventListener("click", function () {
    this.parentElement.classList.add("is-hidden");
  });
