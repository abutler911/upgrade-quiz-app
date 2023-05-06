function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateFlightScenarioData() {
  const miles = randomNumber(50, 500);
  const groundSpeed = randomNumber(100, 600);
  const fuelFlow = randomNumber(500, 3000);
  const alternateFuel = randomNumber(1000, 4000);
  const reserveFuel = 2450;

  return {
    miles,
    groundSpeed,
    fuelFlow,
    alternateFuel,
    reserveFuel,
  };
}

function calculateHoldingFuelAndTime(data) {
  const timeToDestination = data.miles / data.groundSpeed; // hours
  const fuelToDestination = timeToDestination * data.fuelFlow; // lbs
  const totalFuel = data.alternateFuel + data.reserveFuel; // lbs
  const holdingFuel = totalFuel - fuelToDestination; // lbs
  const holdingTime = holdingFuel / data.fuelFlow; // hours

  return {
    holdingFuel,
    holdingTime,
  };
}

module.exports = {
  generateFlightScenarioData,
  calculateHoldingFuelAndTime,
};
