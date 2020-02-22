import fs from 'fs'

export class ConfigManager {
  private _configPath: string = "./config.json";
  private _settings = {
    autoLaunch: false,
    dithering: false
  };

  constructor() {
    if (!fs.existsSync(this._configPath)) {
      fs.writeFileSync(this._configPath, JSON.stringify(this._settings));
    }
  }

  public loadconfig(): any {
    return this._settings;
  }

  // add config bools here for more settings
  public refreshConfig(_autoLaunch: boolean, _dithering: boolean) {
    this._settings.autoLaunch = _autoLaunch;
    this._settings.dithering = _dithering;
  }
}