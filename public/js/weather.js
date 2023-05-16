const weatherData = [
  {
    taf: "KLAX 091720Z 091818 00000KT 1/4SM FG VV002",
    legalToDepart: "no",
    secondAlternateRequired: "no",
  },
  {
    taf: "KLAX 091720Z 091818 00000KT 1/4SM FG VV002",
    legalToDepart: "no",
    secondAlternateRequired: "no",
  },
  {
    taf: "KLAX 091720Z 091818 00000KT 1/4SM FG VV002",
    legalToDepart: "no",
    secondAlternateRequired: "no",
  },
  {
    taf: "KLAX 091720Z 091818 00000KT 1/4SM FG VV002",
    legalToDepart: "no",
    secondAlternateRequired: "no",
  },
];

const table = document.querySelector("table");
const tafCell = document.getElementById("taf");

// Clear the table body
table.tBodies[0].innerHTML = "";

function createTableRow(item, value, answer) {
  const row = document.createElement("tr");

  const itemCell = document.createElement("td");
  itemCell.textContent = item;
  row.appendChild(itemCell);

  const valueCell = document.createElement("td");
  valueCell.textContent = value;
  row.appendChild(valueCell);

  const answerCell = document.createElement("td");

  if (item !== "TAF") {
    const answerButtons = document.createElement("div");
    answerButtons.className = "answer-buttons";
    const answerYesButton = document.createElement("button");
    answerYesButton.className = "answer-button answer-yes";
    answerYesButton.textContent = "Yes";
    const answerNoButton = document.createElement("button");
    answerNoButton.className = "answer-button answer-no";
    answerNoButton.textContent = "No";
    answerButtons.appendChild(answerYesButton);
    answerButtons.appendChild(answerNoButton);
    answerCell.appendChild(answerButtons);
  }

  row.appendChild(answerCell);

  table.tBodies[0].appendChild(row);

  return row;
}

weatherData.forEach((data) => {
  const tafRow = createTableRow("TAF", data.taf, "");
  const legalToDepartRow = createTableRow("Legal to depart?", "", "");
  const secondAlternateRow = createTableRow(
    "Is a 2nd alternate required?",
    "",
    ""
  );

  if (legalToDepartRow.cells.length > 1) {
    const legalToDepartButtons =
      legalToDepartRow.querySelector(".answer-buttons");
    const legalToDepartYesButton =
      legalToDepartButtons.querySelector(".answer-yes");
    const legalToDepartNoButton =
      legalToDepartButtons.querySelector(".answer-no");
    legalToDepartYesButton.addEventListener("click", checkAnswer);
    legalToDepartNoButton.addEventListener("click", checkAnswer);
  }

  if (secondAlternateRow.cells.length > 1) {
    const secondAlternateButtons =
      secondAlternateRow.querySelector(".answer-buttons");
    const secondAlternateYesButton =
      secondAlternateButtons.querySelector(".answer-yes");
    const secondAlternateNoButton =
      secondAlternateButtons.querySelector(".answer-no");
    secondAlternateYesButton.addEventListener("click", checkAnswer);
    secondAlternateNoButton.addEventListener("click", checkAnswer);
  }
});

function checkAnswer(event) {
  const answer = event.target.textContent.trim().toLowerCase();
  const row = event.target.closest("tr");

  const item = row.cells[0].textContent;
  const data = weatherData.find((item) => item.taf === tafCell.textContent);

  if (item === "Legal to depart?") {
    if (answer === data.legalToDepart) {
      row.classList.remove("incorrect");
      row.classList.add("correct");
      row.cells[1].textContent = "Correct";
    } else {
      row.classList.remove("correct");
      row.classList.add("incorrect");
      row.cells[1].textContent = "Incorrect";
    }
  } else if (item === "Is a 2nd alternate required?") {
    if (answer === data.secondAlternateRequired) {
      row.classList.remove("incorrect");
      row.classList.add("correct");
      row.cells[1].textContent = "Correct";
    } else {
      row.classList.remove("correct");
      row.classList.add("incorrect");
      row.cells[1].textContent = "Incorrect";
    }
  }
}

// Set the initial TAF value
if (weatherData.length > 0) {
  tafCell.textContent = weatherData[0].taf;
}
