import { ipcChannel } from '../common/IpcChannels';
import { ColorManager } from './ColorManager';
import { WallpaperManager } from './WallpaperManager';
import { Config } from '../common/Config';
import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import open from 'open';
import path from 'path';
import url from 'url';

// @ts-ignore
let win: any;
let tray: any = null;
const colorManager = new ColorManager();
const wallpaperManager = new WallpaperManager();
const config = new Config();

function createTray() {
  tray = new Tray(path.join(__dirname, "../../media/single_icon.png"));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "HexWall",
      click() {
        createWindow()
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
  createTray();

  app.setLoginItemSettings({
    openAtLogin: config.autoLaunch,
    path: process.execPath,
    args: []
  });

  app.allowRendererProcessReuse = true;

  let colors = colorManager.generateColor();
  wallpaperManager.generateWallpaper(colors[0], colors[1], colors[2]);
  wallpaperManager.setWallpaper(colors[0]);
}

// electron events
app.on("ready", onReady);

app.on("window-all-closed", (e: any) => {
  e.preventDefault()
});

// ipc events
ipcMain.on("openLink", (event: any, arg: any) => {
  open(arg);
  event.returnValue = true;
});

// send colors to frontend
ipcMain.handle("getLastColors", async (event: any, arg: any) => {
  return colorManager.getLastColors();
});

ipcMain.on("setToSelectedColor", async (event: any, arg: any) => {
  wallpaperManager.generateWallpaper(arg.color, arg.ditherColor, arg.fontColor);
  wallpaperManager.setWallpaper(arg.color);
  event.returnValue = true;
});