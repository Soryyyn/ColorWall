import electron from 'electron';
export const configurationFilesDir = (electron.app || electron.remote.app).getPath(
  'userData'
);