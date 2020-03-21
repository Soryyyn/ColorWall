const { remote } = require("electron");
const m = require("mithril");


export const NavigationComponent = {
  checked: {
    lastColors: true,
    favorites: false,
    settings: false,
    about: false
  },
  view() {
    console.log(this.checked)

    return m("nav",
      m("ul", { "id": "navbarContainer" }, [
        m("li", { "id": "lastcolorsNav", "onclick": !this.checked.lastColors },
          "last colors"
        ),
        m("li", { "id": "favoritesNav", "onclick": !this.checked.favorites },
          "favorites"
        ),
        m("li", { "id": "settingsNav", "onclick": !this.checked.settings },
          "settings"
        ),
        m("li", { "id": "aboutNav", "onclick": !this.checked.about },
          "about"
        )
      ])
    );
  }
}