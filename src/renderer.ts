const { ipcRenderer, remote } = require("electron");

function addAppInfos() {
  // @ts-ignore
  document.getElementById("node-version").innerHTML = "Node.js Version: " + process.versions.node;
  // @ts-ignore
  document.getElementById("chrome-version").innerHTML = "Chrome Version: " + process.versions.chrome;
  // @ts-ignore
  document.getElementById("electron-version").innerHTML = "Electron Version: " + process.versions.electron;
}

function closeWindow() {
  var window = remote.getCurrentWindow();
  window.close();
}

addAppInfos();
