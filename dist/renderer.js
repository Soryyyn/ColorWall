"use strict";
var _a = require("electron"), ipcRenderer = _a.ipcRenderer, remote = _a.remote;
// @ts-ignore
var win = remote.getCurrentWindow();
var pin = document.getElementsByClassName("fa-thumbtack")[0];
var pinSet = false;
win.on("blur", function () {
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
    }
    else {
        pinSet = false;
        win.on("blur", function () {
            win.close();
        });
        pin.setAttribute("style", "color: #6e6e6e");
    }
}
/**
 *  get current loaded file for main html
 */
function getLoadedFile() {
    var currentURL = win.webContents.getURL();
    currentURL = currentURL.split("/");
    return currentURL[currentURL.length - 1];
}
