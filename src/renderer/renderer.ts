const { ipcRenderer, remote } = require("electron");
const { ipcChannel } = require("electron").remote.require("../common/ipcChannels");

let remoteWindow = remote.getCurrentWindow();

const closeButton = document.getElementsByClassName("fa-times")[0];
const aboutNav = document.getElementById("aboutNav");
const lastColorsNav = document.getElementById("lastcolorsNav");
const favoritesNav = document.getElementById("favoritesNav");
const settingsNav = document.getElementById("settingsNav");

// defaults
document.getElementById("about").style.display = "block";
aboutNav.style.color = "white";
document.getElementById("lastcolors").style.display = "none";
document.getElementById("favorites").style.display = "none";
document.getElementById("settings").style.display = "none";

function closeWindow() {
  remoteWindow.hide();
}

function showElement(element: String) {
  if (element === "about") {
    document.getElementById("about").style.display = "block";
    document.getElementById("aboutNav").style.color = "white";

    document.getElementById("lastcolors").style.display = "none";
    document.getElementById("lastcolorsNav").style.color = "#9e9e9e";

    document.getElementById("favorites").style.display = "none";
    document.getElementById("favoritesNav").style.color = "#9e9e9e";

    document.getElementById("settings").style.display = "none";
    document.getElementById("settingsNav").style.color = "#9e9e9e";

  } else if (element === "lastcolors") {
    document.getElementById("about").style.display = "none";
    document.getElementById("aboutNav").style.color = "#9e9e9e";

    document.getElementById("lastcolors").style.display = "block";
    document.getElementById("lastcolorsNav").style.color = "white";

    document.getElementById("favorites").style.display = "none";
    document.getElementById("favoritesNav").style.color = "#9e9e9e";

    document.getElementById("settings").style.display = "none";
    document.getElementById("settingsNav").style.color = "#9e9e9e";

  } else if (element === "favorites") {
    document.getElementById("about").style.display = "none";
    document.getElementById("aboutNav").style.color = "#9e9e9e";

    document.getElementById("lastcolors").style.display = "none";
    document.getElementById("lastcolorsNav").style.color = "#9e9e9e";

    document.getElementById("favorites").style.display = "block";
    document.getElementById("favoritesNav").style.color = "white";

    document.getElementById("settings").style.display = "none";
    document.getElementById("settingsNav").style.color = "#9e9e9e";

  } else if (element === "settings") {
    document.getElementById("about").style.display = "none";
    document.getElementById("aboutNav").style.color = "#9e9e9e";

    document.getElementById("lastcolors").style.display = "none";
    document.getElementById("lastcolorsNav").style.color = "#9e9e9e";

    document.getElementById("favorites").style.display = "none";
    document.getElementById("favoritesNav").style.color = "#9e9e9e";

    document.getElementById("settings").style.display = "block";
    document.getElementById("settingsNav").style.color = "white";
  }
}

function clearGrid(grid: string): void {
  while (document.getElementById(grid).firstChild) {
    document.getElementById(grid).removeChild(document.getElementById(grid).firstChild);
  }
}

function styleColorField(color: any, index: number, type: string) {
  let colorField = document.getElementById(`${type}_${index}`);
  colorField.style.backgroundColor = color.mainColor;
  colorField.style.borderRadius = "5px";
}

function handleColorClickOfLastColors(button: Number, color: any) {
  switch (button) {
    // left click / set color
    case 0: {
      ipcRenderer.sendSync(ipcChannel.setToSelectedColor, color);
      break;
    }
    // right click / add to favorite
    case 2: {
      ipcRenderer.sendSync(ipcChannel.addToFavorites, color);
      break;
    }
  }
}

function handleColorClickOfFavoriteColors(button: Number, color: any) {
  switch (button) {
    // left click / set color
    case 0: {
      ipcRenderer.sendSync(ipcChannel.setToSelectedColor, color);
      break;
    }
    // right click / remove from favorite
    case 2: {
      // ipcRenderer.sendSync(ipcChannel.addToFavorites, color);
      break;
    }
  }
}

function addColorToGrid(grid: string, color: any, index: number, type: string, page: string): void {
  let colorField = document.createElement("div");
  colorField.setAttribute("class", "field");
  colorField.setAttribute("id", `${type}_${index}`);

  let textOfField = document.createElement("span");
  textOfField.appendChild(document.createTextNode("#"));
  textOfField.setAttribute("style", "color: " + color.fontColor);
  colorField.appendChild(textOfField);

  document.getElementById(grid).appendChild(colorField);

  styleColorField(color, index, type);

  if (page == "last") {
    colorField.addEventListener("mousedown", (event: any) => {
      handleColorClickOfLastColors(event.button, color);
    });
  } else {
    colorField.addEventListener("mousedown", (event: any) => {
      handleColorClickOfFavoriteColors(event.button, color);
    });
  }
}

function requestLastColors() {
  ipcRenderer.invoke(ipcChannel.requestLastColors, "requesting all last colors").then((colors: any) => {
    clearGrid("grid_last");
    for (let i = 0; i < colors.length; i++) {
      addColorToGrid("grid_last", colors[i], i, "fieldLast", "last");
    }
  });
}

function requestFavoriteColors() {
  ipcRenderer.invoke(ipcChannel.requestFavoriteColors, "requesting all favorite colors").then((colors: any) => {
    clearGrid("grid_fav");
    for (let i = 0; i < colors.length; i++) {
      addColorToGrid("grid_fav", colors[i], i, "fieldFav", "fav");
    }
  });
}

function openLink(link: String) {
  ipcRenderer.sendSync(ipcChannel.linkPressed, link);
}

function requestConfig() {
  let checkboxes = document.getElementsByTagName("input");
  let autoLaunch = checkboxes[0];
  let dithering = checkboxes[1];
  ipcRenderer.invoke(ipcChannel.requestConfig, "requesting settings from config").then((config: any) => {
    autoLaunch.checked = config.autoLaunch;
    dithering.checked = config.dithering;
  });
}

// function changedCheckboxSetting(nameOfSetting: string, status: boolean) {
//   if (nameOfSetting === "autolaunch") {
//     ipcRenderer.sendSync(ipcChannel.changedAutoLaunch, status);
//   } else if (nameOfSetting === "dithering") {
//     ipcRenderer.sendSync(ipcChannel.changedDithering, status);
//   }
// }

// function changedValue(nameOfSetting: string, value: any) {
//   if (nameOfSetting === "fontSize") {
//     if (value == null || value == undefined || value == "") {
//       ipcRenderer.sendSync(ipcChannel.changedWallpaperFontSize, 128);
//     } else {
//       ipcRenderer.sendSync(ipcChannel.changedWallpaperFontSize, value);
//     }
//   }
// }

// events
ipcRenderer.on(ipcChannel.refreshedLastColors, (event: any, arg: any) => {
  clearGrid("grid_last");
  for (let i = 0; i < arg.length; i++) {
    addColorToGrid("grid_last", arg[i], i, "fieldLast", "last");
  }
});

// nav eventlisteners
lastColorsNav.addEventListener("click", requestLastColors);
favoritesNav.addEventListener("click", requestFavoriteColors);
settingsNav.addEventListener("click", requestConfig);

// settings form
function validateSettings() {
  const options = {
    autoLaunch: (<HTMLInputElement>document.getElementById("autoLaunchCheckBox")).checked,
    dithering: (<HTMLInputElement>document.getElementById("ditheringCheckBox")).checked,
    fontSize: parseInt((<HTMLInputElement>document.getElementById("fontSizeInput")).value)
  };

  if (options.fontSize.toString().trim().length == null) {
    options.fontSize = parseInt("0");
  } else {
    console.log("font size not acctepted")
  }
  console.log(options)

}

(<HTMLFormElement>document.getElementById("settingsForm")).addEventListener("submit", (event: Event) => {
  event.preventDefault();
  validateSettings();
});