document
  .getElementById("darkModeSwitch")
  .addEventListener("change", function () {
    console.log("adding a class");
    document.body.classList.toggle("dark-mode", this.checked);
  });
