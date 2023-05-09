console.log("connected to fuel.js");
document.addEventListener("DOMContentLoaded", () => {
  let holdingData;
  let flightData;
  do {
    flightData = generateFlightScenarioData();
    holdingData = calculateHoldingFuelAndTime(flightData);
  } while (
    holdingData.holdingFuel <= 0 ||
    holdingData.holdingTime < 5 / 60 ||
    holdingData.holdingTime > 45 / 60
  );

  document.getElementById("miles").innerText = flightData.miles;
  document.getElementById("groundSpeed").innerText = flightData.groundSpeed;
  document.getElementById("fuelFlow").innerText = flightData.fuelFlow;
  document.getElementById("alternateFuel").innerText = flightData.alternateFuel;
  document.getElementById("reserveFuel").innerText = flightData.reserveFuel;
  document.getElementById("fuelOnBoard").innerText = flightData.fuelOnBoard;

  document.getElementById("timeToDestination").innerText =
    holdingData.timeToDestination.toFixed(2) +
    "  (" +
    formatHoursAndMinutes(holdingData.timeToDestination) +
    ")";
  document.getElementById("fuelToDestination").innerText =
    holdingData.fuelToDestination.toFixed(2);
  document.getElementById("totalFuel").innerText =
    holdingData.totalFuel.toFixed(2);
  document.getElementById("holdingFuel").innerText =
    holdingData.holdingFuel.toFixed(2);
  document.getElementById("holdingTime").innerText =
    holdingData.holdingTime.toFixed(2) +
    "  (" +
    formatHoursAndMinutes(holdingData.holdingTime) +
    ")";
  document.getElementById("revealBtn").addEventListener("click", () => {
    document.querySelector(".scenario-data").classList.toggle("is-hidden");
  });
});

function formatHoursAndMinutes(hours) {
  const totalMinutes = Math.round(hours * 60);
  const minutes = totalMinutes % 60;
  const wholeHours = (totalMinutes - minutes) / 60;
  return (
    wholeHours +
    " hour" +
    (wholeHours === 1 ? "" : "s") +
    " " +
    minutes +
    " minute" +
    (minutes === 1 ? "" : "s")
  );
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateFlightScenarioData() {
  const miles = randomNumber(100, 500);
  const groundSpeed = randomNumber(350, 550);
  const fuelFlow = randomNumber(1800, 3200);
  let alternateFuel = randomNumber(1200, 2500);
  let reserveFuel = randomNumber(2450, 3000);

  let totalFuel = alternateFuel + reserveFuel;
  const fuelBufferPercentage = 1.3; // 30% buffer

  const minHoldingTime = 5 / 60; // 5 minutes in hours
  const maxHoldingTime = 45 / 60; // 45 minutes in hours
  const minHoldingFuel = minHoldingTime * fuelFlow;
  const maxHoldingFuel = maxHoldingTime * fuelFlow;

  const minFuelOnBoard = Math.ceil(
    (totalFuel + minHoldingFuel) * fuelBufferPercentage
  );
  const fuelOnBoard = randomNumber(
    minFuelOnBoard,
    minFuelOnBoard + maxHoldingFuel
  );

  return {
    miles,
    groundSpeed,
    fuelFlow,
    alternateFuel,
    reserveFuel,
    fuelOnBoard,
  };
}

function calculateHoldingFuelAndTime(data) {
  const timeToDestination = data.miles / data.groundSpeed; // hours
  const fuelToDestination = timeToDestination * data.fuelFlow; // lbs
  const totalFuel = fuelToDestination + data.alternateFuel + data.reserveFuel; // lbs
  const holdingFuel = data.fuelOnBoard - totalFuel; // lbs
  const holdingTime = holdingFuel / data.fuelFlow; // hours

  return {
    timeToDestination,
    fuelToDestination,
    totalFuel,
    holdingFuel,
    holdingTime,
  };
}
