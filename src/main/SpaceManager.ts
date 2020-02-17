import fs from 'fs';

/**
 *  managing folders/space which hexwall takes
 *  @class
 */
export class SpaceManager {

  private _wallDir: string = "./wall";

  /**
   *  getter for wallpaper directory
   *
   *  @function wallDir
   *  @returns {string} relative wallpaper saving directory path
   */
  get wallDir(): string {
    return this._wallDir;
  }

  /**
   *  checks wallpaper directory if it exists,
   *  if it doesn't, it creates it
   *
   *  @function checkWallpaperFolder
   */
  public checkWallpaperFolder() {
    if (!fs.existsSync(this._wallDir)) {
      fs.mkdirSync(this._wallDir);
    }
  }

  /**
   *  cleans up the wallpaper directory
   *
   *  @function cleanupWallpaperDirectory
   */
  public cleanupWallpaperDirectory() {
    const images = fs.readdirSync(this._wallDir);
    if (images.length > 0) {
      fs.unlinkSync(this._wallDir + "/" + images.pop());
    }
  }
}