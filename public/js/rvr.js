document
  .getElementById("generate-button")
  .addEventListener("click", generateRandomValues);

let tdz = 0;
let mid = 0;
let rollOut = 0;
let farEnd = 0;

let lighting = ["Adequate Visual Reference", "HIRL", "RCLL", "RCLM"];

function generateRandomValues() {
  tdz = Math.floor(Math.random() * 800) + 800;
  mid = Math.floor(Math.random() * 800) + 800;
  rollOut = Math.floor(Math.random() * 400) + 400;
  farEnd = Math.floor(Math.random() * 400) + 400;

  document.getElementById("tdz-value").innerHTML = tdz;
  document.getElementById("mid-value").innerHTML = mid;
  document.getElementById("roll-out-value").innerHTML = rollOut;
  document.getElementById("far-end-value").innerHTML = farEnd;

  let selectedLighting = [];
  selectedLighting.push(lighting[Math.floor(Math.random() * lighting.length)]); // add at least one light

  for (let light of lighting) {
    if (Math.random() < 0.5 && !selectedLighting.includes(light)) {
      // check if the light is not already added
      selectedLighting.push(light);
    }
  }

  document.getElementById("lighting-value").innerHTML =
    selectedLighting.join(", ");

  let result = "Takeoff is good to go.";
  if (
    tdz <= 1200 ||
    tdz >= 1600 ||
    mid <= 1200 ||
    mid >= 1600 ||
    rollOut <= 1200 ||
    rollOut >= 1600
  ) {
    result = "Takeoff is a no go due to RVR values.";
  } else {
    let requiredLighting = ["HIRL", "RCLL", "RCLM"];
    let lightingCheck = requiredLighting.some((r) =>
      selectedLighting.includes(r)
    );

    if (!lightingCheck) {
      result = "Takeoff is a no go due to insufficient lighting.";
    }
  }

  document.getElementById("result").innerHTML = result;
}
