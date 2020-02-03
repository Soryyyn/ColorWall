"use strict";
var _a = require("electron"), ipcRenderer = _a.ipcRenderer, remote = _a.remote;
// @ts-ignore
var win = remote.getCurrentWindow();
var pin = document.getElementsByClassName("fa-thumbtack")[0];
var pinSet = false;
/**
 *  set defaults (close window on focus lost, hide main divs)
 */
function setDefaults() {
    win.on("blur", function () {
        win.close();
    });
    document.getElementById("lastcolors").style.display = "none";
    document.getElementById("favorites").style.display = "none";
    document.getElementById("settings").style.display = "none";
    document.getElementById("aboutNav").style.color = "white";
}
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
 *  show / hide element on click
 * @param element
 */
function showElement(element) {
    if (element === "about") {
        document.getElementById("about").style.display = "block";
        document.getElementById("aboutNav").style.color = "white";
        document.getElementById("lastcolors").style.display = "none";
        document.getElementById("lastcolorsNav").style.color = "#6e6e6e";
        document.getElementById("favorites").style.display = "none";
        document.getElementById("favoritesNav").style.color = "#6e6e6e";
        document.getElementById("settings").style.display = "none";
        document.getElementById("settingsNav").style.color = "#6e6e6e";
    }
    else if (element === "lastcolors") {
        document.getElementById("about").style.display = "none";
        document.getElementById("aboutNav").style.color = "#6e6e6e";
        document.getElementById("lastcolors").style.display = "block";
        document.getElementById("lastcolorsNav").style.color = "white";
        document.getElementById("favorites").style.display = "none";
        document.getElementById("favoritesNav").style.color = "#6e6e6e";
        document.getElementById("settings").style.display = "none";
        document.getElementById("settingsNav").style.color = "#6e6e6e";
    }
    else if (element === "favorites") {
        document.getElementById("about").style.display = "none";
        document.getElementById("aboutNav").style.color = "#6e6e6e";
        document.getElementById("lastcolors").style.display = "none";
        document.getElementById("lastcolorsNav").style.color = "#6e6e6e";
        document.getElementById("favorites").style.display = "block";
        document.getElementById("favoritesNav").style.color = "white";
        document.getElementById("settings").style.display = "none";
        document.getElementById("settingsNav").style.color = "#6e6e6e";
    }
    else if (element === "settings") {
        document.getElementById("about").style.display = "none";
        document.getElementById("aboutNav").style.color = "#6e6e6e";
        document.getElementById("lastcolors").style.display = "none";
        document.getElementById("lastcolorsNav").style.color = "#6e6e6e";
        document.getElementById("favorites").style.display = "none";
        document.getElementById("favoritesNav").style.color = "#6e6e6e";
        document.getElementById("settings").style.display = "block";
        document.getElementById("settingsNav").style.color = "white";
    }
}
/**
 * send link to main process to open in browser
 * @param link
 */
function openLink(link) {
    ipcRenderer.sendSync("openLink", link);
}
setDefaults();
