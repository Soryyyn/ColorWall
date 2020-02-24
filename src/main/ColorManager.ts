import converter from 'color-convert';
import fs from 'fs';
import path from 'path';

export class ColorManager {
  private _lastColors: Array<Object> = [];
  private _favoriteColors: Array<Object> = [];
  private _cachePath = "./favorites.json";

  public addNewColor(color: Array<string>): void {
    this._lastColors.unshift({
      mainColor: color[0],
      fontColor: color[1],
      ditherColor: color[2],
    });
  }

  public getLastColors(): Array<Object> {
    return this._lastColors;
  }

  private checkIfFavoriteAlreadyInArray(color: string): boolean {
    for (let i = 0; i < this._favoriteColors.length; i++) {
      let temp = Object.values(this._favoriteColors[i])[0];
      if (temp == color) {
        return true;
      }
    }
    return false;
  }

  public addNewFavorite(newColor: any): void {
    if (!this.checkIfFavoriteAlreadyInArray(newColor.mainColor)) {
      this._favoriteColors.unshift({
        mainColor: newColor.mainColor,
        fontColor: newColor.fontColor,
        ditherColor: newColor.ditherColor
      });

      fs.writeFileSync(this._cachePath, `${JSON.stringify(this._favoriteColors)}`
      );
    }
  }

  public getFavoriteColors(): Array<Object> {
    return this._favoriteColors;
  }

  public removeFavorite(index: number): void {
    this._favoriteColors.splice(index, 1);
  }

  public loadFavoritesFromFile() {
    if (!fs.existsSync(this._cachePath)) {
      fs.writeFileSync(this._cachePath, JSON.stringify(this._favoriteColors));
    }

    let favorites = require(path.join("../../", this._cachePath));
    if (favorites !== null || favorites !== undefined || favorites.length <= 0) {
      for (let i = 0; i < favorites.length; i++) {
        this._favoriteColors.unshift({
          mainColor: favorites[i].mainColor,
          fontColor: favorites[i].fontColor,
          ditherColor: favorites[i].ditherColor
        })
      }
    }
  }

  public generateColor(): Array<string> {
    let mainColor: string;
    let fontColor: string;
    let ditherColor: string;

    let r = Math.floor(Math.random() * 255 + 1);
    let g = Math.floor(Math.random() * 255 + 1);
    let b = Math.floor(Math.random() * 255 + 1);
    const rgb = r + g + b;

    if (rgb > 382) {
      fontColor = "#000000";
    } else {
      fontColor = "#FFFFFF";
    }
    mainColor = "#" + converter.rgb.hex([r, g, b]);

    // for dark dither color
    if (r - 20 > 0) {
      r -= 20;
    } else {
      r = 0;
    }
    if (g - 20 > 0) {
      g -= 20;
    } else {
      g = 0;
    }
    if (b - 20 > 0) {
      b -= 20;
    } else {
      b = 0;
    }
    ditherColor = "#" + converter.rgb.hex([r, g, b]);

    this.addNewColor([mainColor, fontColor, ditherColor]);
    return [mainColor, fontColor, ditherColor];
  }
}