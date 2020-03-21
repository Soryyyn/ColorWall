// npm modules
import converter from 'color-convert';
import fs from 'fs';
import path from 'path';

// classes / self made modules
import { configurationFilesDir } from '../common/GlobalPath';
import { WallpaperColor } from '../common/models/WallpaperColor';
import { WallpaperColors } from '../common/models/WallpaperColors';


/**
 * used for managing all colors
 *
 * @export
 * @class ColorManager
 */
export class ColorManager {
  private _lastColors: WallpaperColors = [];
  private _favoriteColors: WallpaperColors = [];
  private _favoritesFilePath = "favorites.json";
  private _chooseFromFavorites: boolean = false;

  /**
   * creates instance of colormanager, and loads favorites from file
   * @memberof ColorManager
   */
  constructor() {
    if (!fs.existsSync(path.join(configurationFilesDir, this._favoritesFilePath))) {
      this.saveChanges();
    }

    let temp = fs.readFileSync(path.join(configurationFilesDir, this._favoritesFilePath));
    let favorites = JSON.parse(temp.toString());

    if (favorites !== null || favorites !== undefined || favorites.length > 0) {
      for (let i = 0; i < favorites.length; i++) {
        this._favoriteColors.unshift(favorites[i]);
      }
    }
  }

  /**
   * adds a new color to last colors
   *
   * @param {WallpaperColor} color
   * @memberof ColorManager
   */
  public addNewColor(color: WallpaperColor): void {
    this._lastColors.unshift({
      mainColor: color.mainColor,
      fontColor: color.fontColor,
      ditherColor: color.ditherColor,
    });
  }

  /**
   * returns array of last colors
   *
   * @returns {WallpaperColors}
   * @memberof ColorManager
   */
  public getLastColors(): WallpaperColors {
    return this._lastColors;
  }

  /**
   * checks if the color is already in the list (avoids duplicate)
   *
   * @private
   * @param {string} color
   * @returns {boolean}
   * @memberof ColorManager
   */
  private checkIfFavoriteAlreadyInArray(color: string): boolean {
    for (let i = 0; i < this._favoriteColors.length; i++) {
      let temp = Object.values(this._favoriteColors[i])[0];
      if (temp == color) {
        return true;
      }
    }
    return false;
  }

  /**
   * writes favorite colors to file
   *
   * @private
   * @memberof ColorManager
   */
  private saveChanges(): void {
    fs.writeFileSync(path.join(configurationFilesDir, this._favoritesFilePath), `${JSON.stringify(this._favoriteColors)}`);
  }

  /**
   * adds a new color to favorite colors & favorites file
   *
   * @param {WallpaperColor} newColor
   * @memberof ColorManager
   */
  public addNewFavorite(newColor: WallpaperColor): void {
    if (!this.checkIfFavoriteAlreadyInArray(newColor.mainColor)) {
      this._favoriteColors.unshift({
        mainColor: newColor.mainColor,
        fontColor: newColor.fontColor,
        ditherColor: newColor.ditherColor
      });

      fs.writeFileSync(path.join(configurationFilesDir, this._favoritesFilePath), `${JSON.stringify(this._favoriteColors)}`);
    }
  }

  /**
   * returns list of all favorite colors
   *
   * @returns {WallpaperColors}
   * @memberof ColorManager
   */
  public getFavoriteColors(): WallpaperColors {
    return this._favoriteColors;
  }

  /**
   * removes color from favorites colors list & file
   *
   * @param {WallpaperColor} color
   * @memberof ColorManager
   */
  public removeFavorite(color: WallpaperColor): void {
    for (let i = 0; i < this._favoriteColors.length; i++) {
      if (this._favoriteColors[i].mainColor === color.mainColor) {
        this._favoriteColors.splice(i, 1);
      }
    }

    this.saveChanges();
  }

  /**
   * generates a new wallpaper color & adds it to the last colors list
   *
   * @returns {WallpaperColor}
   * @memberof ColorManager
   */
  public generateColor(): WallpaperColor {
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

    let color = {
      mainColor: mainColor,
      fontColor: fontColor,
      ditherColor: ditherColor
    };

    this.addNewColor(color);
    return color;
  }

  /**
   * update the settings of color
   *
   * @param {boolean} chooseFromFavorites
   * @memberof ColorManager
   */
  public updateSettings(chooseFromFavorites: boolean) {
    this._chooseFromFavorites = chooseFromFavorites;
  }

  /**
   * chooses a favorite color from the list and returns it
   *
   * @returns {WallpaperColor}
   * @memberof ColorManager
   */
  public generateColorFromFavorites(): WallpaperColor {
    let index = Math.floor(Math.random() * this._favoriteColors.length);
    return this._favoriteColors[index];
  }
}