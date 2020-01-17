"use strict";
var startup = require('user-startup');
var nodePath = process.execPath;
var startupArgs = ['./main.js'];
var output = '../out.log';
// Creates startup script and spawns process
startup.create('hexwall', nodePath, startupArgs, output);
// Removes startup script
startup.remove('hexwall');
