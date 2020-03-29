// npm modules
import { app, BrowserWindow, Menu, Tray, ipcMain } from 'electron';
import open from 'open';
import path from 'path';
import url from 'url';

// classes / self made modules
import { ConfigManager } from './ConfigManager';
const configManager = new ConfigManager();

import { ColorManager } from './ColorManager';
const colorManager = new ColorManager();

import { WallpaperManager } from './WallpaperManager';
const wallpaperManager = new WallpaperManager();

import { SpaceManager } from './SpaceManager';
const spaceManager = new SpaceManager();

import { IpcChannelLibrary } from '../common/IpcChannels';
import { WallpaperColor } from '../common/models/WallpaperColor';


let win: BrowserWindow = null;
let tray: Tray = null;


/**
 * adds app to tray with icon
 */
function createTray() {
  tray = new Tray(path.join(app.getAppPath(), "media/single_icon.png"));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "HexWall",
      click() {
        win.show();
      }
    },
    {
      label: "New Wallpaper",
      click() {
        if (configManager.getCurrentConfiguration().chooseFromFavorites === true) {
          newFavoriteColor();
        } else {
          newRandomColor();
        }

        win.webContents.send(IpcChannelLibrary.refreshedLastColors, colorManager.getLastColors());
      }
    },
    {
      label: "Quit",
      click() {
        tray.destroy();
        spaceManager.cleanupWallpaperDirectory();
        app.quit();
      }
    }
  ]);

  tray.setToolTip("HexWall");
  tray.setContextMenu(contextMenu);
}

/**
 * creates the BrowserWindow, loads the index.html and hides it
 */
function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    resizable: false,
    fullscreenable: false,
    maximizable: false,
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    show: false,
    icon: path.join(app.getAppPath(), "media/single_icon.png")
  });

  win.loadURL(
    url.format({
      pathname: path.join(app.getAppPath(), "page/index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  win.center();
}

/**
 * updates the auto launch setting (system startup)
 * @param {boolean} status
 */
function updateAutoLaunch(status: boolean) {
  app.setLoginItemSettings({
    openAtLogin: status,
    path: process.execPath,
    args: []
  });
}

/**
 * updates the settings of all classes
 */
function updateSettings() {
  // main settings
  updateAutoLaunch(configManager.getCurrentConfiguration().autoLaunch);

  // wallpaper settings
  wallpaperManager.updateSettings(
    configManager.getCurrentConfiguration().ditherEnabled,
    configManager.getCurrentConfiguration().wallpaperFontSize,
    configManager.getCurrentConfiguration().fontEnabled,
  );

  // color settings
  colorManager.updateSettings(
    configManager.getCurrentConfiguration().chooseFromFavorites
  );
}

/**
 * sets the wallpaper to a new random color
 */
function newRandomColor(): void {
  let colors = colorManager.generateColor();
  wallpaperManager.generateWallpaper(colors);
  wallpaperManager.setWallpaper(colors);
}

/**
 * sets the wallpaper to a favorite color
 */
function newFavoriteColor(): void {
  let colors = colorManager.generateColorFromFavorites();
  wallpaperManager.generateWallpaper(colors);
  wallpaperManager.setWallpaper(colors);
}

/**
 * all things that get executed on app start
 */
function onReady() {
  app.allowRendererProcessReuse = true;

  createWindow();
  createTray();
  updateSettings();

  if (configManager.getCurrentConfiguration().chooseFromFavorites === true) {
    newFavoriteColor();
  } else {
    newRandomColor();
  }
}



// electron events
app.on("ready", onReady);

app.on("window-all-closed", (event: Event) => {
  event.preventDefault()
  win.hide();
});



// ipc event handling
ipcMain.on(IpcChannelLibrary.linkPressed, (event: any, arg: any) => {
  open(arg);
  event.returnValue = true;
});

ipcMain.handle(IpcChannelLibrary.requestLastColors, () => {
  return colorManager.getLastColors();
});

ipcMain.handle(IpcChannelLibrary.requestFavoriteColors, () => {
  return colorManager.getFavoriteColors();
});

ipcMain.on(IpcChannelLibrary.setToSelectedColor, (event: Event, arg: WallpaperColor) => {
  if (wallpaperManager.getCurrentWallpaper() !== arg.mainColor) {
    wallpaperManager.generateWallpaper(arg);
    wallpaperManager.setWallpaper(arg);
  }
  event.returnValue = true;
});

ipcMain.on(IpcChannelLibrary.addToFavorites, (event: Event, arg: WallpaperColor) => {
  colorManager.addNewFavorite(arg);
  event.returnValue = true;
});

ipcMain.on(IpcChannelLibrary.removeFromFavorites, (event: Event, arg: WallpaperColor) => {
  colorManager.removeFavorite(arg);
  event.returnValue = true;
});

ipcMain.handle(IpcChannelLibrary.requestConfig, () => {
  return configManager.getCurrentConfiguration();
});

ipcMain.on(IpcChannelLibrary.refreshedConfig, (event: Event, arg: any) => {
  arg = JSON.parse(arg);

  configManager.refreshConfig(arg)
  updateSettings();

  event.returnValue = true;
});