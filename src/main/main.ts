import { ipcChannel } from '../common/IpcChannels';
import { ConfigManager } from './ConfigManager';
import { ColorManager } from './ColorManager';
import { WallpaperManager } from './WallpaperManager';
import { configurationFilesDir } from '../common/GlobalPath';
import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import open from 'open';
import path from 'path';
import url from 'url';

console.log(configurationFilesDir);

let win: any = null;
let tray: any = null;
const colorManager = new ColorManager();
const wallpaperManager = new WallpaperManager();
const configManager = new ConfigManager();
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

function onReady() {
  createWindow();
  createTray();

  app.setLoginItemSettings({
    openAtLogin: configManager.loadconfig().autoLaunch,
    path: process.execPath,
    args: []
  });

  colorManager.loadFavoritesFromFile();
  let colors = colorManager.generateColor();
  wallpaperManager.generateWallpaper(colors[0], colors[1], colors[2]);
  wallpaperManager.setWallpaper(colors[0]);
}

function updateAutoLaunch(status: boolean) {
  app.setLoginItemSettings({
    openAtLogin: status,
    path: process.execPath,
    args: []
  });
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
  wallpaperManager.generateWallpaper(arg.mainColor, arg.fontColor, arg.ditherColor);
  wallpaperManager.setWallpaper(arg.mainColor);
  event.returnValue = true;
});

ipcMain.on(ipcChannel.addToFavorites, (event: any, arg: any) => {
  colorManager.addNewFavorite(arg);
  event.returnValue = true;
});

ipcMain.handle(ipcChannel.requestConfig, (event: any, arg: any) => {
  return configManager.loadconfig();
});

ipcMain.on(ipcChannel.changedAutoLaunch, (event: any, arg: any) => {
  configManager.refreshAutoLaunch(arg);
  updateAutoLaunch(arg);
  event.returnValue = true;
});

ipcMain.on(ipcChannel.changedDithering, (event: any, arg: any) => {
  configManager.refreshDithering(arg);
  wallpaperManager.setDitherEnabled(arg);
  event.returnValue = true;
});