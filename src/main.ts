#!/usr/bin/env node
const fs = require("fs");
const wallpaper = require("wallpaper");
const canvas = require("canvas");
const resolution = require("screen-resolution");
const converter = require("color-convert");
const path = require("path");
const chalk = require("chalk");

const wallDir = "./walls";
let randomHexColor: any;
let fontColor: any;

/**
 *  checks wallpaper directory if it exists,
 *  if it doesn't, it creates it
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
async function generateColor(hex?: String) {

  if (hex == null || hex == "" || hex == undefined) {
    const r = Math.floor(Math.random() * 255 + 1);
    const g = Math.floor(Math.random() * 255 + 1);
    const b = Math.floor(Math.random() * 255 + 1);
    const rgb = r + g + b;

    if (rgb > 382) {
      fontColor = "#000000";
    } else {
      fontColor = "#FFFFFF";
    }
    randomHexColor = "#" + converter.rgb.hex(r, g, b);
  } else {
    hex = converter.hex.rgb(hex);
    const rgb = Number(hex[0]) + Number(hex[1]) + Number(hex[2]);

    if (rgb > 382) {
      fontColor = "#000000";
    } else {
      fontColor = "#FFFFFF";
    }
  }

}

/**
 *  generates the wallpaper, and saves it
 *  to the wall folder
 */
async function generateWall(hex: String) {
  const res = await resolution.get();
  const w = res.width;
  const h = res.height;

  const wall = canvas.createCanvas(w, h);
  const wallctx = wall.getContext("2d");

  // bg
  wallctx.fillStyle = hex;
  wallctx.fillRect(0, 0, w, h);

  // text
  wallctx.fillStyle = fontColor;
  wallctx.font = "128px Unifont";
  wallctx.textAlign = "center";
  wallctx.fillText(hex, w / 2, h / 2);

  // write buffer to image
  const buffer = wall.toBuffer("image/png");
  fs.writeFileSync(path.join(wallDir + "/" + hex + ".png"), buffer);
}

/**
 *  sets last generated picture
 *  as wallpaper
 */
async function setWallpaper(hex: String) {
  await wallpaper.set(path.join(wallDir + "/" + hex + ".png"));
  console.log(chalk.greenBright("new wallpaper set!"))
}

/**
 *  executes all hexwall functions
 */
async function newHexWallRandom() {
  await checkWallpaperFolder();
  await cleanupFolder();
  await generateColor()
  await generateWall(randomHexColor);
  await setWallpaper(randomHexColor);
}

/**
 *  for custom hexwall
 */
async function newHexWallCustom(hex: String) {
  await checkWallpaperFolder();
  await cleanupFolder();
  await generateColor(hex)
  await generateWall(hex);
  await setWallpaper(hex);
}

/**
 *  system tray handling
 */
const electron = require("electron");
const { app, Menu, Tray, dialog } = require("electron");

let tray: any = null
const appFolder = path.basename(process.execPath);
console.log(appFolder);



/**
 *  prompt if auto launch should be enabled or not
 */
function askAutoLaunch() {
  const whenDisabled = {
    type: 'question',
    buttons: ['Cancel', 'Yes, please', 'No, thanks'],
    defaultId: 2,
    title: 'Auto Launch',
    message: 'HexWall on System Startup currently disabled, want to enable?',
  };

  const whenEnabled = {
    type: 'question',
    buttons: ['Cancel', 'Yes, please', 'No, thanks'],
    defaultId: 2,
    title: 'Auto Launch',
    message: 'HexWall on System Startup currently enabled, want to disable?',
  };

  // if (autoLaunch.isEnabled()) {
  //   const response = dialog.showMessageBoxSync(whenEnabled);
  //   if (response == 1) {

  //   }
  // } else {
  //   const response = dialog.showMessageBoxSync(whenDisabled);
  //   if (response == 1) {

  //   }
  // }

}

/**
 *  if app is started add to tray and listen on menu
 */
app.on("ready", () => {

  console.log(app.getPath("exe"));

  tray = new Tray(path.join(__dirname, "../media/single_icon.png"))


  const contextMenu = Menu.buildFromTemplate([
    {
      label: "New Wallpaper",
      click: function () {
        newHexWallRandom();
      }
    },
    {
      label: "Auto Launch",
      click: function () {
        askAutoLaunch();
      }
    },
    {
      label: "Quit",
      click: function () {
        tray.destroy();
        app.quit();
      }
    }
  ]);

  tray.setToolTip("HexWall");
  tray.setContextMenu(contextMenu);



});