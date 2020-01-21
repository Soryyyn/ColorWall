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
async function generateColor() {
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
}

/**
 *  generates the wallpaper, and saves it
 *  to the wall folder
 */
async function generateWall() {
  const res = await resolution.get();
  const w = res.width;
  const h = res.height;

  const wall = canvas.createCanvas(w, h);
  const wallctx = wall.getContext("2d");

  // bg
  wallctx.fillStyle = randomHexColor;
  wallctx.fillRect(0, 0, w, h);

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
  console.log(chalk.greenBright("new wallpaper set!"))
}

/**
 *  executes all hexwall functions
 */
async function main() {
  await checkWallpaperFolder();
  await cleanupFolder();
  await generateColor()
  await generateWall();
  await setWallpaper();
}

// main();

/**
 *  electron stuff
 */
const electron = require("electron");
const { app, Tray } = require("electron");

const trayIcon = path.join(__dirname, "./../media/single_icon.png")

app.on("ready", () => {
  console.log("hexwall started");

});