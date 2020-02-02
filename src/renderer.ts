const { ipcRenderer, remote } = require("electron");

// @ts-ignore
let win = remote.getCurrentWindow();

const pin = document.getElementById("pin");
let pinSet: Boolean = false;

win.on("blur", () => {
  win.close();
});

function pinWindow() {
  if (pinSet === false) {
    pinSet = true;
    win.removeAllListeners("blur");
    // pin.setAttribute("color", "white");
  } else {
    pinSet = false;
    win.on("blur", () => {
      win.close();
    });
    // pin.removeAttribute("color");
  }
}
