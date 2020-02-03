const { ipcRenderer, remote } = require("electron");

// @ts-ignore
let win = remote.getCurrentWindow();

const pin = document.getElementsByClassName("fa-thumbtack")[0];
let pinSet: Boolean = false;

win.on("blur", () => {
  win.close();
});

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
    pin.setAttribute("style", "color: #6e6e6e");
  }
}

/**
 *  get current loaded file for main html
 */
function getLoadedFile() {
  let currentURL = win.webContents.getURL();
  currentURL = currentURL.split("/");
  return currentURL[currentURL.length - 1];
}
