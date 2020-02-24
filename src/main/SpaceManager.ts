import { userDataPath } from '../common/GlobalPath';
import fs from 'fs';
import path from 'path';

export class SpaceManager {
  private _wallDir: string = "wall";

  constructor() {
    if (!fs.existsSync(path.join(userDataPath, this._wallDir))) {
      fs.mkdirSync(path.join(userDataPath, this._wallDir));
    }
  }

  public getWallpaperDirectory(): string {
    return path.join(userDataPath, this._wallDir);
  }

  public cleanupWallpaperDirectory() {
    const images = fs.readdirSync(path.join(userDataPath, this._wallDir));
    if (images.length > 0) {
      fs.unlinkSync(path.join(userDataPath, this._wallDir, "/", images.pop()));
    }
  }
}