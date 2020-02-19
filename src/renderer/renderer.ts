const { ipcRenderer, remote } = require("electron");
const { ipcChannel } = require("electron").remote.require("../common/IpcChannels");

let remoteWindow = remote.getCurrentWindow();
let pinSet: Boolean = false;

const pin = document.getElementsByClassName("fa-thumbtack")[0];
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

function pinWindow() {
  if (pinSet === false) {
    pinSet = true;
    remoteWindow.removeAllListeners("blur");
    pin.setAttribute("style", "color: white");
  } else {
    pinSet = false;
    remoteWindow.on("blur", () => {

      remoteWindow.hide();
    });
    pin.setAttribute("style", "color: #9e9e9e");
  }
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

function styleColorField(color: any, index: number) {
  let colorField = document.getElementById(`field_${index}`);
  colorField.style.backgroundColor = color.mainColor;
  colorField.style.borderRadius = "5px";
}


function handleColorClick(button: Number, color: any) {
  switch (button) {
    case 0: {
      ipcRenderer.sendSync(ipcChannel.setToSelectedColor, color);
      break;
    }

    case 2: {
      break;
    }
  }
}

function addColorToGrid(grid: string, color: any, index: number): void {
  let colorField = document.createElement("div");
  colorField.setAttribute("class", "field");
  colorField.setAttribute("id", `field_${index}`);

  let textOfField = document.createElement("span");
  textOfField.appendChild(document.createTextNode(color.mainColor));
  colorField.appendChild(textOfField);

  document.getElementById(grid).appendChild(colorField);

  styleColorField(color, index);
  colorField.addEventListener("mousedown", (event: any) => {
    handleColorClick(event.button, color);
  });
}

function requestLastColors() {
  ipcRenderer.invoke(ipcChannel.requestLastColors, "requesting all last colors").then((colors: any) => {
    clearGrid("grid_last");
    for (let i = 0; i < colors.length; i++) {
      addColorToGrid("grid_last", colors[i], i);
    }
  });
}

function openLink(link: String) {
  ipcRenderer.sendSync(ipcChannel.linkPressed, link);
}

// events
remoteWindow.on("blur", () => {
  remoteWindow.hide();
});

ipcRenderer.on(ipcChannel.refreshedLastColors, (event: any, arg: any) => {
  clearGrid("grid_last");
  for (let i = 0; i < arg.length; i++) {
    addColorToGrid("grid_last", arg[i], i);
  }
});

lastColorsNav.addEventListener("click", requestLastColors);
