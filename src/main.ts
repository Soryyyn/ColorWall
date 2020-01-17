const fs = require("fs");
const wallpaper = require("wallpaper");
const canvas = require("canvas");
const schedule = require("node-schedule");
const resolution = require("screen-resolution");
const converter = require("color-convert");

const wallDir = "./walls";
let randomHexColor;
let fontColor;

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
  fs.unlinkSync(wallDir + "/" + images.pop());
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
    fontColor = "#FFFFFF";
  } else {
    fontColor = "#000000";
  }
  randomHexColor = "#" + converter.rgb.hex(r, g, b);
}

/**
 *  generates the wallpaper, and saves it
 *  to the wall folder
 */
async function generateWall() {
  const res = await resolution.get();
  const w = res.get("width");
  const h = res.get("height");

  const wall = canvas.createCanvas(w, h);
  const wallctx = wall.getcontext("2d");

}

generateWall();