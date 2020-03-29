const { remote } = require("electron");
const m = require("mithril");


export class NavigationComponent {

  private _checked = {
    lastColors: true,
    favorites: false,
    settings: false,
    about: false
  }

  private navigationLinkClicked(id: string) {
    if (id === "lastcolorsNav") {
      this._checked.lastColors = true;
      this._checked.favorites = false;
      this._checked.settings = false;
      this._checked.about = false;

    } else if (id === "favoritesNav") {
      this._checked.lastColors = false;
      this._checked.favorites = true;
      this._checked.settings = false;
      this._checked.about = false;

    } else if (id === "settingsNav") {
      this._checked.lastColors = false;
      this._checked.favorites = false;
      this._checked.settings = true;
      this._checked.about = false;

    } else if (id === "aboutNav") {
      this._checked.lastColors = false;
      this._checked.favorites = false;
      this._checked.settings = false;
      this._checked.about = true;
    }
  }

  public view() {
    return m("nav",
      m("ul", { "id": "navbarContainer" }, [
        m("li", { "id": "lastcolorsNav", onclick: () => { this.navigationLinkClicked("lastcolorsNav") } },
          "last colors"
        ),
        m("li", { "id": "favoritesNav", onclick: () => { this.navigationLinkClicked("favoritesNav") } },
          "favorites"
        ),
        m("li", { "id": "settingsNav", onclick: () => { this.navigationLinkClicked("settingsNav") } },
          "settings"
        ),
        m("li", { "id": "aboutNav", onclick: () => { this.navigationLinkClicked("aboutNav") } },
          "about"
        )
      ])
    );
  }

}