exports.capitalizeAndPunctuate = (text) => {
  return text.trim().charAt(0).toUpperCase() + text.slice(1);
};

exports.capitalizeWords = (text) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

exports.nameToValue = (name) => {
  return name.trim().toLowerCase().split(" ").join("-");
};
