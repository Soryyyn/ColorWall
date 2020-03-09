// npm modules
import canvas from 'canvas';
import wallpaper from 'wallpaper';
import { screen } from 'electron';
import fs from 'fs';
import path from 'path';

// classes / self made modules
import { SpaceManager } from './SpaceManager';
import { WallpaperColor } from '../common/models/WallpaperColor';

const spaceManager = new SpaceManager();

// register font for use without the need of installing it
canvas.registerFont(path.join(__dirname, "..", "..", "media/unifont.ttf"), { family: "Unifont" });

/**
 * used for all wallpaper managing
 *
 * @export
 * @class WallpaperManager
 */
export class WallpaperManager {
  private _ditherEnabled: boolean = false;
  private _fontSize: number;
  private _fontEnabled: boolean = true;
  private _currentWallpaper: string;


  /**
   * return the current wallpaper main color
   *
   * @returns {string} hexcode string
   * @memberof WallpaperManager
   */
  public getCurrentWallpaper(): string {
    return this._currentWallpaper;
  }

  /**
   * generates a new wallpaper
   *
   * @param {WallpaperColor} color
   * @memberof WallpaperManager
   */
  public generateWallpaper(color: WallpaperColor) {
    const w = screen.getPrimaryDisplay().size.width;
    const h = screen.getPrimaryDisplay().size.height;
    const wall = canvas.createCanvas(w, h);
    const wallctx = wall.getContext("2d");

    if (!this._ditherEnabled) {
      wallctx.fillStyle = color.mainColor;
      wallctx.fillRect(0, 0, w, h);
    } else {
      wallctx.fillStyle = color.mainColor;
      wallctx.fillRect(0, 0, w, h);

      wallctx.fillStyle = color.ditherColor;
      wallctx.fillRect(0, h, w, -80);
      for (let i = 0; i < w; i += 20) {
        wallctx.fillStyle = color.mainColor;
        wallctx.fillRect(i, h - 90, 10, 10);
        wallctx.fillStyle = color.ditherColor;
        wallctx.fillRect(i + 10, h - 90, 10, 10);
        wallctx.fillStyle = color.ditherColor;
        wallctx.fillRect(0, h - 100, w, 10);

        wallctx.fillStyle = color.mainColor;
        wallctx.fillRect(i, h - 110, 10, 10);
        wallctx.fillStyle = color.ditherColor;
        wallctx.fillRect(i + 10, h - 110, 10, 10);
        wallctx.fillStyle = color.ditherColor;
        wallctx.fillRect(0, h - 120, w, 10);

        wallctx.fillStyle = color.mainColor;
        wallctx.fillRect(i, h - 130, 10, 10);
        wallctx.fillStyle = color.ditherColor;
        wallctx.fillRect(i + 10, h - 130, 10, 10);
        wallctx.fillStyle = color.mainColor;
        wallctx.fillRect(i + 10, h - 140, 10, 10);
        wallctx.fillStyle = color.ditherColor;
        wallctx.fillRect(i, h - 140, 10, 10);

        wallctx.fillStyle = color.mainColor;
        wallctx.fillRect(i, h - 150, 10, 10);
        wallctx.fillStyle = color.ditherColor;
        wallctx.fillRect(i + 10, h - 150, 10, 10);
        wallctx.fillStyle = color.mainColor;
        wallctx.fillRect(i + 10, h - 160, 10, 10);
        wallctx.fillStyle = color.ditherColor;
        wallctx.fillRect(i, h - 160, 10, 10);

        wallctx.fillStyle = color.mainColor;
        wallctx.fillRect(i, h - 170, 10, 10);
        wallctx.fillStyle = color.ditherColor;
        wallctx.fillRect(i + 10, h - 170, 10, 10);
        wallctx.fillStyle = color.mainColor;
        wallctx.fillRect(i + 10, h - 180, 10, 10);
        wallctx.fillStyle = color.ditherColor;
        wallctx.fillRect(i, h - 180, 10, 10);

        wallctx.fillStyle = color.mainColor;
        wallctx.fillRect(0, h - 190, w, 10);
        wallctx.fillStyle = color.ditherColor;
        wallctx.fillRect(i, h - 200, 10, 10);
        wallctx.fillStyle = color.mainColor;
        wallctx.fillRect(i + 10, h - 200, 10, 10);

        wallctx.fillStyle = color.mainColor;
        wallctx.fillRect(0, h - 210, w, 10);
        wallctx.fillStyle = color.ditherColor;
        wallctx.fillRect(i, h - 220, 10, 10);
        wallctx.fillStyle = color.mainColor;
        wallctx.fillRect(i + 10, h - 220, 10, 10);
      }
    }

    if (this._fontEnabled) {
      wallctx.fillStyle = color.fontColor;
      wallctx.font = `${this._fontSize}px Unifont`;
      wallctx.textAlign = "center";
      wallctx.fillText(color.mainColor, w / 2, h / 2);
    }

    const buffer = wall.toBuffer("image/png");
    fs.writeFileSync(path.join(spaceManager.getWallpaperDirectory() + "/" + color.mainColor + ".png"), buffer);
  }

  /**
   * set the newly generated picture as a wallpaper
   *
   * @param {WallpaperColor} color
   * @memberof WallpaperManager
   */
  public setWallpaper(color: WallpaperColor) {
    this._currentWallpaper = color.mainColor;
    wallpaper.set(path.join(spaceManager.getWallpaperDirectory() + "/" + color.mainColor + ".png")).then((resolved: any) => { });
  }

  /**
   * updates all settings that are used for generating a wallpaper
   *
   * @param {boolean} ditherEnabled
   * @param {number} fontSize
   * @param {boolean} fontEnabled
   * @memberof WallpaperManager
   */
  public updateWallpaperSettings(ditherEnabled: boolean, fontSize: number, fontEnabled: boolean) {
    this._ditherEnabled = ditherEnabled;
    this._fontSize = fontSize;
    this._fontEnabled = fontEnabled;
  }

}