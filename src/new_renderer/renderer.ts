const { ipcRenderer, remote } = require("electron");
const m = require("mithril");
const { TitlebarComponent } = require("./../new_renderer/components/TitlebarComponent");

m.mount(document.getElementById("titlebar"), TitlebarComponent);
