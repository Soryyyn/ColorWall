#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fs = require("fs");
var wallpaper = require("wallpaper");
var canvas = require("canvas");
var converter = require("color-convert");
var path = require("path");
// @ts-ignore
var electron = require("electron");
var moment = require("moment");
var url = require("url");
var opn = require("opn");
var _a = require("electron"), app = _a.app, Menu = _a.Menu, Tray = _a.Tray, dialog = _a.dialog, BrowserWindow = _a.BrowserWindow, ipcMain = _a.ipcMain;
var monitor = electron.screen;
var wallDir = "./walls";
var randomHexColor;
var ditherColor;
var ditherEnabled = true;
var fontColor;
var tray = null;
// @ts-ignore
var win;
/**
 *  disable auto-launch default
 */
app.setLoginItemSettings({
    openAtLogin: false,
    path: app.getPath("exe")
});
/**
 * adding to log.txt for debug purposes
 * @param text
 */
function logEntry(text) {
    fs.writeFileSync("./log.txt", moment().format("YYYY-MM-DD HH:mm:ss") + ": " + text + "\n", { flag: "a" });
}
/**
 *  checks wallpaper directory if it exists,
 *  if it doesn't, it creates it
 */
function checkWallpaperFolder() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            logEntry("checking if walls folder exists");
            if (!fs.existsSync(wallDir)) {
                logEntry("creating wall folder");
                fs.mkdirSync(wallDir);
            }
            return [2 /*return*/];
        });
    });
}
/**
 *  cleans up the wallpaper folder
 */
function cleanupFolder() {
    return __awaiter(this, void 0, void 0, function () {
        var images;
        return __generator(this, function (_a) {
            logEntry("cleaning up wall folder");
            images = fs.readdirSync(wallDir);
            if (images.length > 0) {
                fs.unlinkSync(wallDir + "/" + images.pop());
            }
            logEntry("cleaned up wall folder");
            return [2 /*return*/];
        });
    });
}
/**
 *  generates a random color & decides
 *  if the font color should be white or black
 */
function generateColor() {
    return __awaiter(this, void 0, void 0, function () {
        var r, g, b, rgb;
        return __generator(this, function (_a) {
            logEntry("generating color");
            r = Math.floor(Math.random() * 255 + 1);
            g = Math.floor(Math.random() * 255 + 1);
            b = Math.floor(Math.random() * 255 + 1);
            rgb = r + g + b;
            if (rgb > 382) {
                fontColor = "#000000";
            }
            else {
                fontColor = "#FFFFFF";
            }
            randomHexColor = "#" + converter.rgb.hex(r, g, b);
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
            ditherColor = "#" + converter.rgb.hex(r, g, b);
            logEntry("finished generating color");
            return [2 /*return*/];
        });
    });
}
/**
 *  generates the wallpaper, and saves it
 *  to the wall folder
 */
function generateWall() {
    return __awaiter(this, void 0, void 0, function () {
        var w, h, wall, wallctx, i, buffer;
        return __generator(this, function (_a) {
            logEntry("generating wallpaper");
            w = monitor.getPrimaryDisplay().size.width;
            h = monitor.getPrimaryDisplay().size.height;
            wall = canvas.createCanvas(w, h);
            wallctx = wall.getContext("2d");
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
                for (i = 0; i < w; i += 20) {
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
            buffer = wall.toBuffer("image/png");
            fs.writeFileSync(path.join(wallDir + "/" + randomHexColor + ".png"), buffer);
            return [2 /*return*/];
        });
    });
}
/**
 *  sets last generated picture
 *  as wallpaper
 */
function setWallpaper() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logEntry("setting wallpaper");
                    return [4 /*yield*/, wallpaper.set(path.join(wallDir + "/" + randomHexColor + ".png"))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 *  executes all hexwall functions
 */
function newRandomHexWall() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkWallpaperFolder()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, cleanupFolder()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, generateColor()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, generateWall()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, setWallpaper()];
                case 5:
                    _a.sent();
                    logEntry("---------------------------------");
                    return [2 /*return*/];
            }
        });
    });
}
/**
 *  prompt if auto launch should be enabled or not
 */
function askAutoLaunch() {
    var whenDisabled = {
        type: "question",
        buttons: ["Cancel", "Yes, please", "No, thanks"],
        defaultId: 2,
        title: "Auto Launch",
        message: "HexWall on System Startup currently disabled, want to enable?",
    };
    var whenEnabled = {
        type: "question",
        buttons: ["Cancel", "Yes, please", "No, thanks"],
        defaultId: 2,
        title: "Auto Launch",
        message: "HexWall on System Startup currently enabled, want to disable?",
    };
    if (app.getLoginItemSettings().openAtLogin) {
        var response = dialog.showMessageBoxSync(whenEnabled);
        if (response === 1) {
            app.setLoginItemSettings({
                openAtLogin: false,
                path: app.getPath("exe")
            });
            logEntry("disabling autolaunch");
        }
    }
    else {
        var response = dialog.showMessageBoxSync(whenDisabled);
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
    var whenDisabled = {
        type: "question",
        buttons: ["Cancel", "Yes, please", "No, thanks"],
        defaultId: 2,
        title: "Dithering",
        message: "Dithering currently disabled, want to enable?",
    };
    var whenEnabled = {
        type: "question",
        buttons: ["Cancel", "Yes, please", "No, thanks"],
        defaultId: 2,
        title: "Dithering",
        message: "Dithering currently currently enabled, want to disable?",
    };
    if (ditherEnabled) {
        var response = dialog.showMessageBoxSync(whenEnabled);
        if (response === 1) {
            ditherEnabled = false;
            logEntry("disabling dithering");
        }
    }
    else {
        var response = dialog.showMessageBoxSync(whenDisabled);
        if (response === 1) {
            ditherEnabled = true;
            logEntry("enabling dithering");
        }
    }
}
/**
 *  adds hexwall to systemtray
 */
function createTray() {
    return __awaiter(this, void 0, void 0, function () {
        var contextMenu;
        return __generator(this, function (_a) {
            tray = new Tray(path.join(__dirname, "../media/single_icon.png"));
            contextMenu = Menu.buildFromTemplate([
                {
                    label: "HexWall",
                    click: function () {
                        createWindow();
                    }
                },
                {
                    type: "separator"
                },
                {
                    label: "New Wallpaper",
                    click: function () {
                        newRandomHexWall();
                    }
                },
                {
                    label: "Auto Launch",
                    click: function () {
                        askAutoLaunch();
                    }
                },
                {
                    label: "Enable/Disable Dithering",
                    click: function () {
                        askDithering();
                    }
                },
                {
                    type: "separator"
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
            return [2 /*return*/];
        });
    });
}
/**
 *  create manager window
 */
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
        icon: path.join(__dirname, "../media/single_icon.png")
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, "../page/index.html"),
        protocol: "file:",
        slashes: true
    }));
    win.center();
    // win.webContents.openDevTools()
}
/**
 *  signal management
 */
app.on("ready", function () {
    createTray();
    newRandomHexWall();
});
app.on("activate", function () {
    if (tray === null) {
        createTray();
        newRandomHexWall();
    }
});
// on window close dont close app
app.on("window-all-closed", function (e) {
    e.preventDefault();
});
// open clicked link in front end
ipcMain.on("openLink", function (event, arg) {
    opn(arg);
    event.returnValue = true;
});
