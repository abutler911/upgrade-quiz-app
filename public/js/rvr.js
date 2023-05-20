function generateRandomValues() {
  let tdz = Math.floor(Math.random() * 1301) + 300;
  let mid = Math.floor(Math.random() * 1301) + 300;
  let rollOut = Math.floor(Math.random() * 601) + 400;
  let farEnd = Math.floor(Math.random() * 601) + 400;

  document.getElementById("tdz-value").textContent = tdz;
  document.getElementById("mid-value").textContent = mid;
  document.getElementById("roll-out-value").textContent = rollOut;
  document.getElementById("far-end-value").textContent = farEnd;

  let visibility = Math.random() < 0.25 ? "¼ mile" : "greater than ¼ mile";
  let visualReference = Math.random() < 0.5;

  if (visibility === "¼ mile" && visualReference) {
    tdz = ""; // Clear the RVR values
    mid = "";
    rollOut = "";
    farEnd = "";
    document.getElementById("tdz-value").textContent = visibility;
    document.getElementById("mid-value").textContent = "";
    document.getElementById("roll-out-value").textContent = "";
    document.getElementById("far-end-value").textContent = "";
    document.getElementById("lighting-value").textContent =
      "Adequate Visual Reference";
    document.getElementById("result").textContent = "Takeoff is good to go.";
    return;
  }

  let lighting = ["HIRL", "RCLL", "RCLM"];
  let selectedLighting = [];
  selectedLighting.push(lighting[Math.floor(Math.random() * lighting.length)]); // add at least one light

  for (let light of lighting) {
    if (Math.random() < 0.5 && !selectedLighting.includes(light)) {
      // check if the light is not already added
      selectedLighting.push(light);
    }
  }

  document.getElementById("lighting-value").textContent =
    selectedLighting.join(", ");

  let result = "";

  if (
    visibility === "¼ mile" &&
    visualReference &&
    selectedLighting.length === 0
  ) {
    result = "Takeoff is good to go.";
  } else if (
    tdz > 1600 &&
    (selectedLighting.includes("HIRL") ||
      selectedLighting.includes("RCLL") ||
      selectedLighting.includes("RCLM"))
  ) {
    result = "Takeoff is good to go.";
  } else if (
    (tdz > mid || isNaN(tdz)) &&
    mid > 1600 &&
    (selectedLighting.includes("HIRL") ||
      selectedLighting.includes("RCLL") ||
      selectedLighting.includes("RCLM"))
  ) {
    result = "Takeoff is good to go.";
  } else if (
    tdz < 1600 &&
    tdz > 1200 &&
    mid < 1600 &&
    mid > 1200 &&
    rollOut < 1600 &&
    rollOut > 1000 &&
    (isDaytime() || (isNighttime() && selectedLighting.includes("RCLL"))) &&
    selectedLighting.length >= 2 &&
    farEnd > 0
  ) {
    result = "Takeoff is good to go.";
  } else if (
    tdz < 1600 &&
    tdz > 1200 &&
    mid < 1600 &&
    mid > 1200 &&
    rollOut < 1600 &&
    rollOut > 1000 &&
    isNighttime() &&
    (selectedLighting.includes("HIRL") || selectedLighting.includes("RCLL")) &&
    selectedLighting.length >= 2 &&
    farEnd > 0
  ) {
    result = "Takeoff is good to go.";
  } else if (
    tdz > 1000 &&
    tdz < 1200 &&
    mid > 1000 &&
    mid < 1200 &&
    rollOut > 1000 &&
    rollOut < 1200 &&
    (selectedLighting.includes("RCLL") ||
      (selectedLighting.includes("HIRL") &&
        selectedLighting.includes("RCLM"))) &&
    selectedLighting.length >= 2 &&
    farEnd > 0
  ) {
    result = "Takeoff is good to go.";
  } else if (
    tdz > 600 &&
    tdz < 1000 &&
    mid > 600 &&
    mid < 1000 &&
    rollOut > 600 &&
    rollOut < 1000 &&
    selectedLighting.includes("HIRL") &&
    selectedLighting.includes("RCLL") &&
    selectedLighting.length >= 2 &&
    farEnd > 0
  ) {
    result = "Takeoff is good to go.";
  } else {
    result = "Takeoff is a no go.";
  }

  document.getElementById("result").textContent = result;
}

function isDaytime() {
  let isDaytime = Math.random() < 0.5; // Randomly pick daytime or nighttime
  document.getElementById("day-night-value").textContent = isDaytime
    ? "Day"
    : "Night";
  return isDaytime;
}

function isNighttime() {
  return !isDaytime(); // Return the opposite of isDaytime
}

document
  .getElementById("generate-button")
  .addEventListener("click", generateRandomValues);
