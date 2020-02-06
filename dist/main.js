#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const wallpaper_1 = __importDefault(require("wallpaper"));
const color_convert_1 = __importDefault(require("color-convert"));
const path_1 = __importDefault(require("path"));
const electron_1 = __importDefault(require("electron"));
const electron_2 = require("electron");
const canvas_1 = __importDefault(require("canvas"));
const monitor = electron_1.default.screen;
const wallDir = "./walls";
let randomHexColor;
let ditherColor;
let ditherEnabled = true;
let fontColor;
let tray = null;
/**
 *  checks wallpaper directory if it exists,
 *  if it doesn't, it creates it
 */
async function checkWallpaperFolder() {
    if (!fs_1.default.existsSync(wallDir)) {
        fs_1.default.mkdirSync(wallDir);
    }
}
/**
 *  cleans up the wallpaper folder
 */
async function cleanupFolder() {
    const images = fs_1.default.readdirSync(wallDir);
    if (images.length > 0) {
        fs_1.default.unlinkSync(wallDir + "/" + images.pop());
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
    }
    else {
        fontColor = "#FFFFFF";
    }
    randomHexColor = "#" + color_convert_1.default.rgb.hex([r, g, b]);
    // for dark dither color
    if (r - 20 > 0) {
        r -= 20;
    }
    else {
        r = 0;
    }
    if (g - 20 > 0) {
        g -= 20;
    }
    else {
        g = 0;
    }
    if (b - 20 > 0) {
        b -= 20;
    }
    else {
        b = 0;
    }
    ditherColor = "#" + color_convert_1.default.rgb.hex([r, g, b]);
}
/**
 *  generates the wallpaper, and saves it
 *  to the wall folder
 */
async function generateWall() {
    canvas_1.default.registerFont("./unifont.ttf", { family: "Unifont" });
    const w = monitor.getPrimaryDisplay().size.width;
    const h = monitor.getPrimaryDisplay().size.height;
    const wall = canvas_1.default.createCanvas(w, h);
    const wallctx = wall.getContext("2d");
    if (!ditherEnabled) {
        // bg
        wallctx.fillStyle = randomHexColor;
        wallctx.fillRect(0, 0, w, h);
    }
    else {
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
    wallctx.fillStyle = fontColor;
    wallctx.font = "128px 'Unifont'";
    wallctx.textAlign = "center";
    wallctx.fillText(randomHexColor, w / 2, h / 2);
    // write buffer to image
    let buffer = wall.toBuffer();
    fs_1.default.writeFileSync(path_1.default.join(wallDir + "/" + randomHexColor + ".png"), buffer);
}
/**
 *  sets last generated picture
 *  as wallpaper
 */
async function setWallpaper() {
    await wallpaper_1.default.set(path_1.default.join(wallDir + "/" + randomHexColor + ".png"));
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
    if (electron_2.app.getLoginItemSettings().openAtLogin) {
        const response = electron_2.dialog.showMessageBoxSync(whenEnabled);
        if (response === 1) {
            electron_2.app.setLoginItemSettings({
                openAtLogin: false,
                path: electron_2.app.getPath("exe")
            });
        }
    }
    else {
        const response = electron_2.dialog.showMessageBoxSync(whenDisabled);
        if (response === 1) {
            electron_2.app.setLoginItemSettings({
                openAtLogin: true,
                path: electron_2.app.getPath("exe")
            });
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
        const response = electron_2.dialog.showMessageBoxSync(whenEnabled);
        if (response === 1) {
            ditherEnabled = false;
        }
    }
    else {
        const response = electron_2.dialog.showMessageBoxSync(whenDisabled);
        if (response === 1) {
            ditherEnabled = true;
        }
    }
}
/**
 *  adds hexwall to systemtray
 */
async function createTray() {
    tray = new electron_2.Tray(path_1.default.join(__dirname, "../media/single_icon.png"));
    const contextMenu = electron_2.Menu.buildFromTemplate([
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
                electron_2.app.quit();
            }
        }
    ]);
    tray.setToolTip("HexWall");
    tray.setContextMenu(contextMenu);
}
/**
 *  if app is started add to tray and listen on menu
 */
electron_2.app.on("ready", () => {
    createTray();
    newRandomHexWall();
});
electron_2.app.on("activate", () => {
    if (tray === null) {
        createTray();
        newRandomHexWall();
    }
});
electron_2.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_2.app.quit();
        fs_1.default.unlinkSync("./log.txt");
    }
});
