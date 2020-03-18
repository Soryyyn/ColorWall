const { ipcRenderer, remote } = require("electron");
const mithril = require("mithril");
const { TestComponent } = remote.require("../new_renderer/components/TestComponent");
const { yeetComponent } = remote.require("../new_renderer/components/yeetComponent");

mithril.mount(document.getElementById('test'), TestComponent);
mithril.mount(document.getElementById('yeet'), yeetComponent);
