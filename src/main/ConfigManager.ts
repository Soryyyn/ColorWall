// npm modules
import fs from 'fs'
import path from 'path';

// classes / models
import { configurationFilesDir } from '../common/GlobalPath';
import { Settings } from '../common/models/Settings';

/**
 * used for managing the configuration file in userdata
 *
 * @export
 * @class ConfigManager
 */
export class ConfigManager {
  private _configPath: string = "config.json";
  private _settings: Settings = {
    autoLaunch: false,
    ditherEnabled: false,
    fontEnabled: true,
    wallpaperFontSize: 128,
    chooseFromFavorites: false,
  };

  /**
   * creates instance of configmanager, creates
   * the (if necessary) config file and loads it into a object
   * @memberof ConfigManager
   */
  constructor() {
    if (!fs.existsSync(path.join(configurationFilesDir, this._configPath))) {
      fs.writeFileSync(path.join(configurationFilesDir, this._configPath), JSON.stringify(this._settings));
    } else {
      this._settings = require(path.join(configurationFilesDir, "config.json"));
    }
  }

  /**
   * returns the currently saved / used configuration
   *
   * @returns {Settings}
   * @memberof ConfigManager
   */
  public initCurrentConfiguration(): Settings {
    return this._settings;
  }

  /**
   * write the new configuration which the user has set in the ui,
   * to the config file
   *
   * @param {Settings} newConfig
   * @memberof ConfigManager
   */
  public refreshConfig(newConfig: Settings): void {
    this._settings.autoLaunch = newConfig.autoLaunch;
    this._settings.ditherEnabled = newConfig.ditherEnabled;
    this._settings.fontEnabled = newConfig.fontEnabled;
    this._settings.wallpaperFontSize = newConfig.wallpaperFontSize;
    this._settings.chooseFromFavorites = newConfig.chooseFromFavorites;

    fs.writeFileSync(path.join(configurationFilesDir, this._configPath), JSON.stringify(this._settings));
  }
}