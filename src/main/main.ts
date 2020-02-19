import { ipcChannel } from '../common/IpcChannels';
import { ColorManager } from './ColorManager';
import { WallpaperManager } from './WallpaperManager';
import { Config } from '../common/Config';
import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import open from 'open';
import path from 'path';
import url from 'url';

let win: any;
let tray: any = null;
const colorManager = new ColorManager();
const wallpaperManager = new WallpaperManager();
const config = new Config();
app.allowRendererProcessReuse = true;

function createTray() {
  tray = new Tray(path.join(__dirname, "../../media/single_icon.png"));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "HexWall",
      click() {
        win.show();
      }
    },
    {
      type: "separator"
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
      type: "separator"
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
    icon: path.join(__dirname, "../../media/single_icon.png")
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "../../page/index.html"),
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
    openAtLogin: config.autoLaunch,
    path: process.execPath,
    args: []
  });

  colorManager.loadFavoritesFromFile();
  let colors = colorManager.generateColor();
  wallpaperManager.generateWallpaper(colors[0], colors[1], colors[2]);
  wallpaperManager.setWallpaper(colors[0]);
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

ipcMain.handle(ipcChannel.requestLastColors, async (event: any, arg: any) => {
  return colorManager.getLastColors();
});

ipcMain.handle(ipcChannel.requestFavoriteColors, async (event: any, arg: any) => {
  return colorManager.getFavoriteColors();
});

ipcMain.on(ipcChannel.setToSelectedColor, async (event: any, arg: any) => {
  wallpaperManager.generateWallpaper(arg.mainColor, arg.fontColor, arg.ditherColor);
  wallpaperManager.setWallpaper(arg.mainColor);
  event.returnValue = true;
});

ipcMain.on(ipcChannel.addToFavorites, (event: any, arg: any) => {
  colorManager.addNewFavorite(arg);
  event.returnValue = true;
});