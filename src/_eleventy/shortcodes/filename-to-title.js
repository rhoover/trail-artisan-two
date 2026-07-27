function fileName (incomingFileName) {
  let newTitle = "";
  switch (incomingFileName) {
    case "brewers":
      newTitle = "Brewers";
    break;
    case "cheeses":
      newTitle = "Cheese Makers";
    break;
    case "ciders":
      newTitle = "Ciders";
    break;
    case "distillers":
      newTitle = "Distillers";
    break;
    case "wines":
      newTitle = "Wines";
    break;
  
    default:
      break;
  }
  return newTitle;
};

export { fileName };