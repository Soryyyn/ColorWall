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
var resolution = require("screen-resolution");
var converter = require("color-convert");
var path = require("path");
var chalk = require("chalk");
var wallDir = "./walls";
var randomHexColor;
var fontColor;
/**
 *  checks wallpaper directory if it exists,
 *  if it doesn't, it creates it
 */
function checkWallpaperFolder() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!fs.existsSync(wallDir)) {
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
            images = fs.readdirSync(wallDir);
            if (images.length > 0) {
                fs.unlinkSync(wallDir + "/" + images.pop());
            }
            return [2 /*return*/];
        });
    });
}
/**
 *  generates a random color & decides
 *  if the font color should be white or black
 */
function generateColor(hex) {
    return __awaiter(this, void 0, void 0, function () {
        var r, g, b, rgb, rgb;
        return __generator(this, function (_a) {
            if (hex == null || hex == "" || hex == undefined) {
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
            }
            else {
                hex = converter.hex.rgb(hex);
                rgb = Number(hex[0]) + Number(hex[1]) + Number(hex[2]);
                if (rgb > 382) {
                    fontColor = "#000000";
                }
                else {
                    fontColor = "#FFFFFF";
                }
            }
            return [2 /*return*/];
        });
    });
}
/**
 *  generates the wallpaper, and saves it
 *  to the wall folder
 */
function generateWall(hex) {
    return __awaiter(this, void 0, void 0, function () {
        var res, w, h, wall, wallctx, buffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resolution.get()];
                case 1:
                    res = _a.sent();
                    w = res.width;
                    h = res.height;
                    wall = canvas.createCanvas(w, h);
                    wallctx = wall.getContext("2d");
                    // bg
                    wallctx.fillStyle = hex;
                    wallctx.fillRect(0, 0, w, h);
                    // text
                    wallctx.fillStyle = fontColor;
                    wallctx.font = "128px Unifont";
                    wallctx.textAlign = "center";
                    wallctx.fillText(hex, w / 2, h / 2);
                    buffer = wall.toBuffer("image/png");
                    fs.writeFileSync(path.join(wallDir + "/" + hex + ".png"), buffer);
                    return [2 /*return*/];
            }
        });
    });
}
/**
 *  sets last generated picture
 *  as wallpaper
 */
function setWallpaper(hex) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, wallpaper.set(path.join(wallDir + "/" + hex + ".png"))];
                case 1:
                    _a.sent();
                    console.log(chalk.greenBright("new wallpaper set!"));
                    return [2 /*return*/];
            }
        });
    });
}
/**
 *  executes all hexwall functions
 */
function newHexWallRandom() {
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
                    return [4 /*yield*/, generateWall(randomHexColor)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, setWallpaper(randomHexColor)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 *  for custom hexwall
 */
function newHexWallCustom(hex) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkWallpaperFolder()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, cleanupFolder()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, generateColor(hex)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, generateWall(hex)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, setWallpaper(hex)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 *  system tray handling
 */
var electron = require("electron");
var _a = require("electron"), app = _a.app, Menu = _a.Menu, Tray = _a.Tray, dialog = _a.dialog;
var tray = null;
var appFolder = path.basename(process.execPath);
console.log(appFolder);
/**
 *  prompt if auto launch should be enabled or not
 */
function askAutoLaunch() {
    var whenDisabled = {
        type: 'question',
        buttons: ['Cancel', 'Yes, please', 'No, thanks'],
        defaultId: 2,
        title: 'Auto Launch',
        message: 'HexWall on System Startup currently disabled, want to enable?',
    };
    var whenEnabled = {
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
app.on("ready", function () {
    console.log(app.getPath("exe"));
    tray = new Tray(path.join(__dirname, "../media/single_icon.png"));
    var contextMenu = Menu.buildFromTemplate([
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
