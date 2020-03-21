const { ipcRenderer, remote } = require("electron");
const m = require("mithril");

const { TitlebarComponent } = require("./../new_renderer/components/TitlebarComponent");
const { NavigationComponent } = require("./../new_renderer/components/NavigationComponent");

m.mount(document.getElementById("titlebar"), TitlebarComponent);
m.mount(document.getElementById("navigation"), NavigationComponent);
