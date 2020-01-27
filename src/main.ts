#!/usr/bin/env node
const fs = require("fs");
const wallpaper = require("wallpaper");
const canvas = require("canvas");
const converter = require("color-convert");
const path = require("path");
const electron = require("electron");

const { app, Menu, Tray, dialog } = require("electron");

const monitor = electron.screen;
const wallDir = "./walls";
let randomHexColor: any;
let ditherColor: any;
let ditherEnabled: Boolean = true;
let fontColor: any;
let tray: any = null;

/**
 *  disable auto-launch default
 */
app.setLoginItemSettings({
  openAtLogin: false,
  path: app.getPath("exe")
});

/**
 *  checks wallpaper directory if it exists,
 *  if it doesn"t, it creates it
 */
async function checkWallpaperFolder() {
  if (!fs.existsSync(wallDir)) {
    fs.mkdirSync(wallDir);
  }
}

/**
 *  cleans up the wallpaper folder
 */
async function cleanupFolder() {
  const images = fs.readdirSync(wallDir);
  if (images.length > 0) {
    fs.unlinkSync(wallDir + "/" + images.pop());
  }
}

/**
 *  generates a random color & decides
 *  if the font color should be white or black
 */
async function generateColor() {
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
  if (r - 65 > 0) {
    r -= 65;
  } else {
    r = 0;
  }

  if (g - 65 > 0) {
    g -= 65;
  } else {
    g = 0;
  }

  if (b - 65 > 0) {
    b -= 65;
  } else {
    b = 0;
  }

  ditherColor = "#" + converter.rgb.hex(r, g, b);
}

/**
 *  generates the wallpaper, and saves it
 *  to the wall folder
 */
async function generateWall() {
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
    wallctx.fillRect(0, h, w, -64);
  }


  // text
  wallctx.fillStyle = fontColor;
  wallctx.font = "128px Unifont";
  wallctx.textAlign = "center";
  wallctx.fillText(randomHexColor, w / 2, h / 2);

  // write buffer to image
  const buffer = wall.toBuffer("image/png");
  fs.writeFileSync(path.join(wallDir + "/" + randomHexColor + ".png"), buffer);
}

/**
 *  sets last generated picture
 *  as wallpaper
 */
async function setWallpaper() {
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
    }

  } else {
    const response = dialog.showMessageBoxSync(whenDisabled);
    if (response === 1) {
      app.setLoginItemSettings({
        openAtLogin: true,
        path: app.getPath("exe")
      });
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
      label: "Dithering",
      submenu: [
        {
          label: "Enable/Disable"
        },
        {
          label: "Darken Main Color by"
        }
      ]
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
