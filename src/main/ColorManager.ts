import converter from 'color-convert';
import fs from 'fs';

export class ColorManager {
  private _lastColors: Array<Object> = [];
  private _favoriteColors: Array<Object> = [];
  private _cachePath: string = "./favorites";

  public addNewColor(color: Array<string>): void {
    this._lastColors.push({
      mainColor: color[0],
      fontColor: color[1],
      ditherColor: color[2]
    });
  }

  public get lastColors(): Array<Object> {
    return this._lastColors;
  }

  public addNewFavorite(color: Array<string>): void {
    this._favoriteColors.push({
      mainColor: color[0],
      fontColor: color[1],
      ditherColor: color[2]
    });

    fs.writeFileSync(this._cachePath, `${this._favoriteColors}\n`
    );
  }

  public get favoriteColors(): Array<Object> {
    return this._favoriteColors;
  }

  public removeFavorite(index: number): void {
    this._favoriteColors.splice(index, 1);
  }

  public generateColor(): void {
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
  }
}

// TODO: comment this file