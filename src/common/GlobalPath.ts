// npm modules
import electron from 'electron';

// returns the appdata path of the user (for config files)
export const configurationFilesDir = (electron.app || electron.remote.app).getPath('userData');