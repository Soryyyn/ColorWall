import { ipcChannel } from '../common/IpcChannels';
import { ConfigManager } from './ConfigManager';
import { ColorManager } from './ColorManager';
import { WallpaperManager } from './WallpaperManager';
import { SpaceManager } from './SpaceManager';
import { WallpaperColor } from '../common/models/WallpaperColor';
import { WallpaperColors } from '../common/models/WallpaperColors';
import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import open from 'open';
import path from 'path';
import url from 'url';

let win: any = null;
let tray: any = null;
const colorManager = new ColorManager();
const wallpaperManager = new WallpaperManager();
const configManager = new ConfigManager();
const spaceManager = new SpaceManager();
app.allowRendererProcessReuse = true;

function createTray() {
  tray = new Tray(path.join(__dirname, "..", "..", "media/single_icon.png"));

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
        let colors = colorManager.generateColor();
        wallpaperManager.generateWallpaper(colors[0], colors[1], colors[2]);
        wallpaperManager.setWallpaper(colors[0]);
        win.webContents.send(ipcChannel.refreshedLastColors, colorManager.getLastColors());
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
    icon: path.join(__dirname, "..", "..", "media/single_icon.png")
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "..", "..", "/page/index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  win.center();
}

function updateAutoLaunch(status: boolean) {
  app.setLoginItemSettings({
    openAtLogin: status,
    path: process.execPath,
    args: []
  });
}

function initSettings() {
  updateAutoLaunch(configManager.getCurrentConfiguration().autoLaunch);
  wallpaperManager.updateWallpaperSettings(
    configManager.getCurrentConfiguration().ditherEnabled,
    configManager.getCurrentConfiguration().wallpaperFontSize,
    configManager.getCurrentConfiguration().fontEnabled,
  );
}

function onReady() {
  createWindow();
  createTray();
  initSettings();

  let colors = colorManager.generateColor();
  wallpaperManager.generateWallpaper(colors);
  wallpaperManager.setWallpaper(colors);
}

// electron events
app.on("ready", onReady);

app.on("window-all-closed", (e: any) => {
  e.preventDefault()
  win.hide();
});

// ipc events
ipcMain.on(ipcChannel.linkPressed, (event: any, arg: any) => {
  open(arg);
  event.returnValue = true;
});

ipcMain.handle(ipcChannel.requestLastColors, (event: any, arg: any) => {
  return colorManager.getLastColors();
});

ipcMain.handle(ipcChannel.requestFavoriteColors, (event: any, arg: any) => {
  return colorManager.getFavoriteColors();
});

ipcMain.on(ipcChannel.setToSelectedColor, (event: any, arg: any) => {
  if (wallpaperManager.getCurrentWallpaper() !== arg.mainColor) {
    wallpaperManager.generateWallpaper(arg.mainColor, arg.fontColor, arg.ditherColor);
    wallpaperManager.setWallpaper(arg.mainColor);
  }
  event.returnValue = true;
});

ipcMain.on(ipcChannel.addToFavorites, (event: any, arg: any) => {
  colorManager.addNewFavorite(arg);
  event.returnValue = true;
});

ipcMain.on(ipcChannel.removeFromFavorites, (event: any, arg: any) => {
  colorManager.removeFavorite(arg);
  event.returnValue = true;
});

ipcMain.handle(ipcChannel.requestConfig, (event: any, arg: any) => {
  return configManager.getCurrentConfiguration();
});

// TODO: refactor config changing
ipcMain.on(ipcChannel.refreshedConfig, (event: any, arg: any) => {
  arg = JSON.parse(arg);

  // if (colorManager.getFavoriteColors().length > 0) {
  configManager.refreshConfig(arg)
  updateAllSettings();
  // } else {
  //   arg = JSON.parse(arg);
  //   arg.chooseFromFavorites = false;
  //   arg = JSON.stringify(arg);
  //   configManager.refreshConfig(arg)

  //   updateAutoLaunch(configManager.getCurrentConfiguration().autoLaunch);
  //   wallpaperManager.setFontEnabled(configManager.getCurrentConfiguration().fontEnabled);
  //   wallpaperManager.setFontSize(configManager.getCurrentConfiguration().wallpaperFontSize);
  //   wallpaperManager.setDitherEnabled(configManager.getCurrentConfiguration().dithering);
  // }

  event.returnValue = true;
});