// npm modules
import fs from 'fs';
import path from 'path';

// classes / self made modules
import { configurationFilesDir } from '../common/GlobalPath';


/**
 * used for managing the wallpaper directory in userdata
 *
 * @export
 * @class SpaceManager
 */
export class SpaceManager {
  private _wallDir: string = "wall";


  /**
   * creates instance of spacemanager
   * @memberof SpaceManager
   */
  constructor() {
    if (!fs.existsSync(path.join(configurationFilesDir, this._wallDir))) {
      fs.mkdirSync(path.join(configurationFilesDir, this._wallDir));
    }
  }

  /**
   * get the wallpaper directory path
   *
   * @returns {string} path of directory
   * @memberof SpaceManager
   */
  public getWallpaperDirectory(): string {
    return path.join(configurationFilesDir, this._wallDir);
  }

  /**
   * deletes all but the current wallpapers in the directory
   *
   * @memberof SpaceManager
   */
  public cleanupWallpaperDirectory(): void {
    const images = fs.readdirSync(path.join(configurationFilesDir, this._wallDir));

    if (images.length > 1) {
      for (let i = 0; i < images.length + 1; i++) {
        fs.unlinkSync(path.join(configurationFilesDir, this._wallDir, images.pop()));
      }
    }
  }
}