#!/usr/bin/env node
const fs = require("fs");
const wallpaper = require("wallpaper");
const canvas = require("canvas");
const converter = require("color-convert");
const path = require("path");
const electron = require("electron");
const moment = require("moment");

const { app, Menu, Tray, dialog } = require("electron");

const monitor = electron.screen;
const wallDir = "./walls";
let randomHexColor: any;
let ditherColor: any;
let ditherEnabled: Boolean = true;
let fontColor: any;
let tray: any = null;

/**
 * adding to log.txt for debug purposes
 * @param text
 */
function logEntry(text: String) {
  fs.writeFileSync("./log.txt", moment().format("YYYY-MM-DD HH:mm:ss") + ": " + text + "\n", { flag: "a" });
}

/**
 *  checks wallpaper directory if it exists,
 *  if it doesn't, it creates it
 */
async function checkWallpaperFolder() {
  logEntry("checking if walls folder exists");
  if (!fs.existsSync(wallDir)) {
    logEntry("creating wall folder");
    fs.mkdirSync(wallDir);
  }
}

/**
 *  cleans up the wallpaper folder
 */
async function cleanupFolder() {
  logEntry("cleaning up wall folder");
  const images = fs.readdirSync(wallDir);
  if (images.length > 0) {
    fs.unlinkSync(wallDir + "/" + images.pop());
  }
  logEntry("cleaned up wall folder");
}

/**
 *  generates a random color & decides
 *  if the font color should be white or black
 */
async function generateColor() {
  logEntry("generating color");
  let r = Math.floor(Math.random() * 255 + 1);
  let g = Math.floor(Math.random() * 255 + 1);
  let b = Math.floor(Math.random() * 255 + 1);
  const rgb = r + g + b;

  if (rgb > 382) {
    fontColor = "#000000";
  } else {
    fontColor = "#FFFFFF";
  }
  randomHexColor = "#" + converter.rgb.hex(r, g, b);

  // for dark dither color
  if (r - 20 > 0) {
    r -= 20;
  } else {
    r = 0;
  }

  if (g - 20 > 0) {
    g -= 20;
  } else {
    g = 0;
  }

  if (b - 20 > 0) {
    b -= 20;
  } else {
    b = 0;
  }

  ditherColor = "#" + converter.rgb.hex(r, g, b);
  logEntry("finished generating color");
}

/**
 *  generates the wallpaper, and saves it
 *  to the wall folder
 */
async function generateWall() {
  logEntry("generating wallpaper");
  const w = monitor.getPrimaryDisplay().size.width;
  const h = monitor.getPrimaryDisplay().size.height;

  const wall = canvas.createCanvas(w, h);
  const wallctx = wall.getContext("2d");

  if (!ditherEnabled) {
    // bg
    wallctx.fillStyle = randomHexColor;
    wallctx.fillRect(0, 0, w, h);
  } else {
    // bg
    wallctx.fillStyle = randomHexColor;
    wallctx.fillRect(0, 0, w, h);

    // dither
    wallctx.fillStyle = ditherColor;
    wallctx.fillRect(0, h, w, -80);

    for (let i = 0; i < w; i += 20) {
      // pattern 1
      wallctx.fillStyle = randomHexColor;
      wallctx.fillRect(i, h - 90, 10, 10);
      wallctx.fillStyle = ditherColor;
      wallctx.fillRect(i + 10, h - 90, 10, 10);
      wallctx.fillStyle = ditherColor;
      wallctx.fillRect(0, h - 100, w, 10);

      wallctx.fillStyle = randomHexColor;
      wallctx.fillRect(i, h - 110, 10, 10);
      wallctx.fillStyle = ditherColor;
      wallctx.fillRect(i + 10, h - 110, 10, 10);
      wallctx.fillStyle = ditherColor;
      wallctx.fillRect(0, h - 120, w, 10);

      // pattern 2
      wallctx.fillStyle = randomHexColor;
      wallctx.fillRect(i, h - 130, 10, 10);
      wallctx.fillStyle = ditherColor;
      wallctx.fillRect(i + 10, h - 130, 10, 10);
      wallctx.fillStyle = randomHexColor;
      wallctx.fillRect(i + 10, h - 140, 10, 10);
      wallctx.fillStyle = ditherColor;
      wallctx.fillRect(i, h - 140, 10, 10);

      wallctx.fillStyle = randomHexColor;
      wallctx.fillRect(i, h - 150, 10, 10);
      wallctx.fillStyle = ditherColor;
      wallctx.fillRect(i + 10, h - 150, 10, 10);
      wallctx.fillStyle = randomHexColor;
      wallctx.fillRect(i + 10, h - 160, 10, 10);
      wallctx.fillStyle = ditherColor;
      wallctx.fillRect(i, h - 160, 10, 10);

      wallctx.fillStyle = randomHexColor;
      wallctx.fillRect(i, h - 170, 10, 10);
      wallctx.fillStyle = ditherColor;
      wallctx.fillRect(i + 10, h - 170, 10, 10);
      wallctx.fillStyle = randomHexColor;
      wallctx.fillRect(i + 10, h - 180, 10, 10);
      wallctx.fillStyle = ditherColor;
      wallctx.fillRect(i, h - 180, 10, 10);

      // pattern 3
      wallctx.fillStyle = randomHexColor;
      wallctx.fillRect(0, h - 190, w, 10);
      wallctx.fillStyle = ditherColor;
      wallctx.fillRect(i, h - 200, 10, 10);
      wallctx.fillStyle = randomHexColor;
      wallctx.fillRect(i + 10, h - 200, 10, 10);

      wallctx.fillStyle = randomHexColor;
      wallctx.fillRect(0, h - 210, w, 10);
      wallctx.fillStyle = ditherColor;
      wallctx.fillRect(i, h - 220, 10, 10);
      wallctx.fillStyle = randomHexColor;
      wallctx.fillRect(i + 10, h - 220, 10, 10);
    }
  }

  // text
  wallctx.fillStyle = fontColor;
  wallctx.font = "128px Unifont";
  wallctx.textAlign = "center";
  wallctx.fillText(randomHexColor, w / 2, h / 2);

  // write buffer to image
  logEntry("creating wallpaper file");
  const buffer = wall.toBuffer("image/png");
  fs.writeFileSync(path.join(wallDir + "/" + randomHexColor + ".png"), buffer);
}

/**
 *  sets last generated picture
 *  as wallpaper
 */
async function setWallpaper() {
  logEntry("setting wallpaper");
  await wallpaper.set(path.join(wallDir + "/" + randomHexColor + ".png"));
}

/**
 *  executes all hexwall functions
 */
async function newRandomHexWall() {
  await checkWallpaperFolder();
  await cleanupFolder();
  await generateColor();
  await generateWall();
  await setWallpaper();
  logEntry("---------------------------------");
}

/**
 *  prompt if auto launch should be enabled or not
 */
function askAutoLaunch() {
  const whenDisabled = {
    type: "question",
    buttons: ["Cancel", "Yes, please", "No, thanks"],
    defaultId: 2,
    title: "Auto Launch",
    message: "HexWall on System Startup currently disabled, want to enable?",
  };

  const whenEnabled = {
    type: "question",
    buttons: ["Cancel", "Yes, please", "No, thanks"],
    defaultId: 2,
    title: "Auto Launch",
    message: "HexWall on System Startup currently enabled, want to disable?",
  };

  if (app.getLoginItemSettings().openAtLogin) {
    const response = dialog.showMessageBoxSync(whenEnabled);
    if (response === 1) {
      app.setLoginItemSettings({
        openAtLogin: false,
        path: app.getPath("exe")
      });
      logEntry("disabling autolaunch");
    }
  } else {
    const response = dialog.showMessageBoxSync(whenDisabled);
    if (response === 1) {
      app.setLoginItemSettings({
        openAtLogin: true,
        path: app.getPath("exe")
      });
      logEntry("enabling autolaunch");
    }
  }

}

/**
 *  prompt if dithering should be enabled or not
 */
function askDithering() {
  const whenDisabled = {
    type: "question",
    buttons: ["Cancel", "Yes, please", "No, thanks"],
    defaultId: 2,
    title: "Dithering",
    message: "Dithering currently disabled, want to enable?",
  };

  const whenEnabled = {
    type: "question",
    buttons: ["Cancel", "Yes, please", "No, thanks"],
    defaultId: 2,
    title: "Dithering",
    message: "Dithering currently currently enabled, want to disable?",
  };

  if (ditherEnabled) {
    const response = dialog.showMessageBoxSync(whenEnabled);
    if (response === 1) {
      ditherEnabled = false;
      logEntry("disabling dithering");
    }
  } else {
    const response = dialog.showMessageBoxSync(whenDisabled);
    if (response === 1) {
      ditherEnabled = true;
      logEntry("enabling dithering");
    }
  }
}

/**
 *  adds hexwall to systemtray
 */
async function createTray() {
  tray = new Tray(path.join(__dirname, "../media/single_icon.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "HexWall"
    },
    {
      type: "separator"
    },
    {
      label: "New Wallpaper",
      click() {
        newRandomHexWall();
      }
    },
    {
      label: "Auto Launch",
      click() {
        askAutoLaunch();
      }
    },
    {
      label: "Enable/Disable Dithering",
      click() {
        askDithering();
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

/**
 *  if app is started add to tray and listen on menu
 */
app.on("ready", () => {
  createTray();
  newRandomHexWall();
});

app.on("activate", () => {
  if (tray === null) {
    createTray();
    newRandomHexWall();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    fs.unlinkSync("./log.txt");
  }
});