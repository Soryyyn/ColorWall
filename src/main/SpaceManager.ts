import fs from 'fs';

export class SpaceManager {
  private _wallDir: string = "./wall";

  constructor() {
    if (!fs.existsSync(this._wallDir)) {
      fs.mkdirSync(this._wallDir);
    }
  }

  public getWallpaperDirectory(): string {
    return this._wallDir;
  }

  public cleanupWallpaperDirectory() {
    const images = fs.readdirSync(this._wallDir);
    if (images.length > 0) {
      fs.unlinkSync(this._wallDir + "/" + images.pop());
    }
  }
}