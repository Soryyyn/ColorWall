const { ipcRenderer, remote } = require("electron");

// @ts-ignore
let win = remote.getCurrentWindow();

const pin = document.getElementsByClassName("fa-thumbtack")[0];
let pinSet: Boolean = false;
let colors = [];

/**
 *  set defaults (close window on focus lost, hide main divs)
 */
win.on("blur", () => {
  win.close();
});

document.getElementById("lastcolors").style.display = "none";
document.getElementById("favorites").style.display = "none";
document.getElementById("settings").style.display = "none";

document.getElementById("aboutNav").style.color = "white";

/**
 * disable window from closing on focus lost
 */
function pinWindow() {
  if (pinSet === false) {
    pinSet = true;
    win.removeAllListeners("blur");
    pin.setAttribute("style", "color: white");
  } else {
    pinSet = false;
    win.on("blur", () => {
      win.close();
    });
    pin.setAttribute("style", "color: #9e9e9e");
  }
}

/**
 * show / hide element on click
 * @param element
 */
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

/**
 * send link to main process to open in browser
 * @param link
 */
function openLink(link: String) {
  ipcRenderer.sendSync("openLink", link);
}

/**
 * clear frontend, get all colors from main process, and add to list
 */
function getLastColors() {
  ipcRenderer.invoke("getLastColors", "getting colors").then((colors: any) => {
    while (document.getElementById("grid_last").firstChild) {
      document.getElementById("grid_last").removeChild(document.getElementById("grid_last").firstChild);
    }

    colors = colors;

    for (let i = 0; i < colors.length; i++) {
      let field = document.createElement("div");
      field.setAttribute("class", "field");
      field.setAttribute("id", `field_${i}`);

      let text = document.createElement("span");
      text.setAttribute("id", `text_${i}`);
      text.appendChild(document.createTextNode(colors[i].color));
      field.appendChild(text);

      let check = document.createElement("i");
      check.setAttribute("class", "fas fa-check");
      field.appendChild(check);

      document.getElementById("grid_last").appendChild(field);
    }

    for (let i = 0; i < colors.length; i++) {
      let field = document.getElementById(`field_${i}`);
      field.style.backgroundColor = colors[i].color;
      field.style.borderRadius = "5px";

      field.addEventListener("mousedown", (event: any) => {
        handleColorClick(event.button, `field_${i}`, colors[i]);
      });
    }
  });
}

// TODO: refactor code into more files / classes
function handleColorClick(button: Number, field: string, color: String) {
  switch (button) {
    case 0: {
      ipcRenderer.sendSync("setToSelectedColor", color);
      let parent = document.getElementById(field);
      let check = parent.getElementsByTagName("i");
      check[0].style.opacity = "1";
      break;
    }

    case 2: {
      break;
    }
  }
}