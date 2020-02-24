import fs from 'fs'
import path from 'path';

export class ConfigManager {
  private _configPath: string = "config.json";
  private _settings = {
    autoLaunch: false,
    dithering: false
  };

  constructor() {
    if (!fs.existsSync(path.join(process.cwd(), this._configPath))) {
      fs.writeFileSync(path.join(process.cwd(), this._configPath), JSON.stringify(this._settings));
    } else {
      this._settings = require(path.join(process.cwd(), "..", "..", "config.json"));
    }
  }

  public loadconfig(): any {
    return this._settings;
  }

  // add config bools here for more settings
  public refreshAutoLaunch(enabled: boolean) {
    this._settings.autoLaunch = enabled;
    fs.writeFileSync(path.join(process.cwd(), this._configPath), JSON.stringify(this._settings));
  }

  public refreshDithering(enabled: boolean) {
    this._settings.dithering = enabled;
    fs.writeFileSync(path.join(process.cwd(), this._configPath), JSON.stringify(this._settings));
  }
}