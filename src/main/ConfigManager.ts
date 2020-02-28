import { configurationFilesDir } from '../common/GlobalPath';
import fs from 'fs'
import path from 'path';

export class ConfigManager {
  private _configPath: string = "config.json";
  private _settings = {
    autoLaunch: false,
    dithering: false,
    wallpaperFontSize: 128,
  };

  constructor() {
    if (!fs.existsSync(path.join(configurationFilesDir, this._configPath))) {
      fs.writeFileSync(path.join(configurationFilesDir, this._configPath), JSON.stringify(this._settings));
    } else {
      this._settings = require(path.join(configurationFilesDir, "config.json"));
    }
  }

  public loadconfig(): any {
    return this._settings;
  }

  public refreshConfig(newConfig: any) {
    newConfig = JSON.parse(newConfig); // ignore / makes it work

    this._settings.autoLaunch = newConfig.autoLaunch;
    this._settings.dithering = newConfig.dithering;
    this._settings.wallpaperFontSize = newConfig.fontSize;

    fs.writeFileSync(path.join(configurationFilesDir, this._configPath), JSON.stringify(this._settings));
  }
}