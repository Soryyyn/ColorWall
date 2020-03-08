class ElementLibrary {

  // window
  closeWindowButton = document.getElementsByClassName("fa-times")[0];

  // navigation
  aboutNavigationLink = document.getElementById("aboutNav");
  lastColorsNavigationLink = document.getElementById("lastcolorsNav");
  favoritesNavigationLink = document.getElementById("favoritesNav");
  settingsNavigationLink = document.getElementById("settingsNav");

  // main content divs
  aboutContentDiv = document.getElementById("about");
  lastcolorsContentDiv = document.getElementById("lastcolors");
  favoritesContentDiv = document.getElementById("favorites");
  settingsContentDiv = document.getElementById("settings");

  // forms
  settingsForm = (<HTMLFormElement>document.getElementById("settingsForm"));

};
