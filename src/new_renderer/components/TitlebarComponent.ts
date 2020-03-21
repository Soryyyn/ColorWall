const { remote } = require("electron");
const m = require("mithril");

let remoteWindow = remote.getCurrentWindow();

export const TitlebarComponent = {
  closeWindow() {
    remoteWindow.hide();
  },
  view() {
    return m("div", { "id": "close" },
      m("i", { "class": "fas fa-times", "onclick": this.closeWindow })
    )
  }
}