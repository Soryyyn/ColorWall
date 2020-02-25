import canvas from 'canvas';
import wallpaper from 'wallpaper';
import { screen } from 'electron';
import fs from 'fs';
import path from 'path';
import { SpaceManager } from './SpaceManager';

const spaceManager = new SpaceManager();

export class WallpaperManager {
  private _ditherEnabled: boolean = false;
  private _fontSize: number = 128;

  public setDitherEnabled(value: boolean) {
    this._ditherEnabled = value;
  }

  public generateWallpaper(mainColor: string, fontColor: string, ditherColor: string) {
    const w = screen.getPrimaryDisplay().size.width;
    const h = screen.getPrimaryDisplay().size.height;
    const wall = canvas.createCanvas(w, h);
    const wallctx = wall.getContext("2d");

    if (!this._ditherEnabled) {
      wallctx.fillStyle = mainColor;
      wallctx.fillRect(0, 0, w, h);
    } else {
      wallctx.fillStyle = mainColor;
      wallctx.fillRect(0, 0, w, h);

      wallctx.fillStyle = ditherColor;
      wallctx.fillRect(0, h, w, -80);
      for (let i = 0; i < w; i += 20) {
        wallctx.fillStyle = mainColor;
        wallctx.fillRect(i, h - 90, 10, 10);
        wallctx.fillStyle = ditherColor;
        wallctx.fillRect(i + 10, h - 90, 10, 10);
        wallctx.fillStyle = ditherColor;
        wallctx.fillRect(0, h - 100, w, 10);

        wallctx.fillStyle = mainColor;
        wallctx.fillRect(i, h - 110, 10, 10);
        wallctx.fillStyle = ditherColor;
        wallctx.fillRect(i + 10, h - 110, 10, 10);
        wallctx.fillStyle = ditherColor;
        wallctx.fillRect(0, h - 120, w, 10);

        wallctx.fillStyle = mainColor;
        wallctx.fillRect(i, h - 130, 10, 10);
        wallctx.fillStyle = ditherColor;
        wallctx.fillRect(i + 10, h - 130, 10, 10);
        wallctx.fillStyle = mainColor;
        wallctx.fillRect(i + 10, h - 140, 10, 10);
        wallctx.fillStyle = ditherColor;
        wallctx.fillRect(i, h - 140, 10, 10);

        wallctx.fillStyle = mainColor;
        wallctx.fillRect(i, h - 150, 10, 10);
        wallctx.fillStyle = ditherColor;
        wallctx.fillRect(i + 10, h - 150, 10, 10);
        wallctx.fillStyle = mainColor;
        wallctx.fillRect(i + 10, h - 160, 10, 10);
        wallctx.fillStyle = ditherColor;
        wallctx.fillRect(i, h - 160, 10, 10);

        wallctx.fillStyle = mainColor;
        wallctx.fillRect(i, h - 170, 10, 10);
        wallctx.fillStyle = ditherColor;
        wallctx.fillRect(i + 10, h - 170, 10, 10);
        wallctx.fillStyle = mainColor;
        wallctx.fillRect(i + 10, h - 180, 10, 10);
        wallctx.fillStyle = ditherColor;
        wallctx.fillRect(i, h - 180, 10, 10);

        wallctx.fillStyle = mainColor;
        wallctx.fillRect(0, h - 190, w, 10);
        wallctx.fillStyle = ditherColor;
        wallctx.fillRect(i, h - 200, 10, 10);
        wallctx.fillStyle = mainColor;
        wallctx.fillRect(i + 10, h - 200, 10, 10);

        wallctx.fillStyle = mainColor;
        wallctx.fillRect(0, h - 210, w, 10);
        wallctx.fillStyle = ditherColor;
        wallctx.fillRect(i, h - 220, 10, 10);
        wallctx.fillStyle = mainColor;
        wallctx.fillRect(i + 10, h - 220, 10, 10);
      }
    }

    wallctx.fillStyle = fontColor;
    wallctx.font = `${this._fontSize}px Unifont`;
    wallctx.textAlign = "center";
    wallctx.fillText(mainColor, w / 2, h / 2);

    const buffer = wall.toBuffer("image/png");
    fs.writeFileSync(path.join(spaceManager.getWallpaperDirectory() + "/" + mainColor + ".png"), buffer);
  }

  public setWallpaper(mainColor: string) {
    wallpaper.set(path.join(spaceManager.getWallpaperDirectory() + "/" + mainColor + ".png")).then((resolved: any) => {
      // spaceManager.cleanupWallpaperDirectory();
    });
  }
}