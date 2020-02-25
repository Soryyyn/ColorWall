import { configurationFilesDir } from '../common/GlobalPath';
import fs from 'fs';
import path from 'path';

export class SpaceManager {
  private _wallDir: string = "wall";

  constructor() {
    if (!fs.existsSync(path.join(configurationFilesDir, this._wallDir))) {
      fs.mkdirSync(path.join(configurationFilesDir, this._wallDir));
    }
  }

  public getWallpaperDirectory(): string {
    return path.join(configurationFilesDir, this._wallDir);
  }

  public cleanupWallpaperDirectory() {
    const images = fs.readdirSync(path.join(configurationFilesDir, this._wallDir));

    if (images.length > 0) {
      for (let i = 0; i < images.length + 1; i++) {
        fs.unlinkSync(path.join(configurationFilesDir, this._wallDir, images.pop()));
      }
    }
  }
}