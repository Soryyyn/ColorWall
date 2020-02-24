import fs from 'fs';
import path from 'path';

export class SpaceManager {
  private _wallDir: string = "wall";

  constructor() {
    if (!fs.existsSync(path.join(process.cwd(), this._wallDir))) {
      fs.mkdirSync(path.join(process.cwd(), this._wallDir));
    }
  }

  public getWallpaperDirectory(): string {
    return path.join(process.cwd(), this._wallDir);
  }

  public cleanupWallpaperDirectory() {
    const images = fs.readdirSync(path.join(process.cwd(), this._wallDir));
    if (images.length > 0) {
      fs.unlinkSync(path.join(process.cwd(), this._wallDir, "/", images.pop()));
    }
  }
}