const { ipcRenderer, remote } = require("electron");

// @ts-ignore
let win = remote.getCurrentWindow();

const pin = document.getElementsByClassName("fa-thumbtack")[0];
let pinSet: Boolean = false;

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

    for (let i = 0; i < colors.length; i++) {
      let field = document.createElement("div");
      field.setAttribute("class", "field");
      field.setAttribute("id", `field_${i}`);
      field.appendChild(document.createTextNode(colors[i].color));
      document.getElementById("grid_last").appendChild(field);
    }

    for (let i = 0; i < colors.length; i++) {
      document.getElementById(`field_${i}`).style.backgroundColor = colors[i].color;

      document.getElementById(`field_${i}`).style.borderRadius = "5px";

      // document.getElementById(`${i}_color`).style.fontSize = "2rem";
      // document.getElementById(`${i}_color`).style.textDecoration = "none";
      // document.getElementById(`${i}_color`).style.listStyle = "none";
      // document.getElementById(`${i}_color`).style.textAlign = "center";

      // document.getElementById(`${i}_color`).style.padding = "0.5rem 0 0.5rem 0";
      // document.getElementById(`${i}_color`).style.marginBottom = "2rem";

      // document.getElementById(`${i}_color`).style.borderColor = "white";
      // document.getElementById(`${i}_color`).style.borderStyle = "solid";
      // document.getElementById(`${i}_color`).style.borderWidth = "2px";
      // document.getElementById(`${i}_color`).style.borderRadius = "5px";
      // document.getElementById(`${i}_color`).style.boxShadow = "2px 2px 10px 0px rgba(0, 0, 0, 1)";

      // document.getElementById(`${i}_color`).style.backgroundColor = colors[i].color;
      // document.getElementById(`${i}_color`).style.color = colors[i].fontColor;

      // let field = document.getElementsByClassName("field")[i];
      // field.style.flex = "1";
    }
  });
}