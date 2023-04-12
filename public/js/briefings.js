import { cardContents } from "../data/briefings.js";

const createCard = ({ id, title, content }) => {
  const column = document.createElement("div");
  column.className = "column";

  const card = document.createElement("div");
  card.className = "card";

  const cardContent = document.createElement("div");
  cardContent.className = "card-content";

  const contentDiv = document.createElement("div");
  contentDiv.className = "content";
  contentDiv.innerHTML = `<h4>${title}</h4>${content}`;

  cardContent.appendChild(contentDiv);
  card.appendChild(cardContent);
  column.appendChild(card);

  return column;
};

document.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.getElementById("card-container");
  cardContents.forEach((cardContent) => {
    const cardElement = createCard(cardContent);
    cardContainer.appendChild(cardElement);
  });
});
