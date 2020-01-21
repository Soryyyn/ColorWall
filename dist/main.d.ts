#!/usr/bin/env node
declare const fs: any;
declare const wallpaper: any;
declare const canvas: any;
declare const resolution: any;
declare const converter: any;
declare const path: any;
declare const chalk: any;
declare const wallDir = "./walls";
declare let randomHexColor: any;
declare let fontColor: any;
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
declare function main(): Promise<void>;
/**
 *  electron stuff
 */
declare const electron: any;
declare const app: any, Tray: any;
declare const trayIcon: any;
