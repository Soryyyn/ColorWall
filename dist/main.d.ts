#!/usr/bin/env node
declare const fs: any;
declare const wallpaper: any;
declare const canvas: any;
declare const converter: any;
declare const path: any;
declare const electron: any;
declare const moment: any;
declare const url: any;
declare const app: any, Menu: any, Tray: any, dialog: any, BrowserWindow: any, ipcMain: any;
declare const monitor: any;
declare const wallDir = "./walls";
declare let randomHexColor: any;
declare let ditherColor: any;
declare let ditherEnabled: Boolean;
declare let fontColor: any;
declare let tray: any;
declare let win: any;
/**
 * adding to log.txt for debug purposes
 * @param text
 */
declare function logEntry(text: String): void;
/**
 *  checks wallpaper directory if it exists,
 *  if it doesn't, it creates it
 */
declare function checkWallpaperFolder(): Promise<void>;
/**
 *  cleans up the wallpaper folder
 */
declare function cleanupFolder(): Promise<void>;
/**
 *  generates a random color & decides
 *  if the font color should be white or black
 */
declare function generateColor(): Promise<void>;
/**
 *  generates the wallpaper, and saves it
 *  to the wall folder
 */
declare function generateWall(): Promise<void>;
/**
 *  sets last generated picture
 *  as wallpaper
 */
declare function setWallpaper(): Promise<void>;
/**
 *  executes all hexwall functions
 */
declare function newRandomHexWall(): Promise<void>;
/**
 *  prompt if auto launch should be enabled or not
 */
declare function askAutoLaunch(): void;
/**
 *  prompt if dithering should be enabled or not
 */
declare function askDithering(): void;
/**
 *  adds hexwall to systemtray
 */
declare function createTray(): Promise<void>;
/**
 *  create manager window
 */
declare function createWindow(): void;
