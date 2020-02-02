"use strict";
var _a = require("electron"), ipcRenderer = _a.ipcRenderer, remote = _a.remote;
// @ts-ignore
var win = remote.getCurrentWindow();
var pin = document.getElementById("pin");
var pinSet = false;
win.on("blur", function () {
    win.close();
});
function pinWindow() {
    if (pinSet === false) {
        pinSet = true;
        win.removeAllListeners("blur");
        // pin.setAttribute("color", "white");
    }
    else {
        pinSet = false;
        win.on("blur", function () {
            win.close();
        });
        // pin.removeAttribute("color");
    }
}
