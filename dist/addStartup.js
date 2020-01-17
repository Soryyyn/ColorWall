"use strict";
var startup = require('user-startup');
var nodePath = process.execPath;
var startupArgs = ['./main.js'];
var output = '../out.log';
startup.create('hexwall', nodePath, startupArgs, output);
startup.remove('hexwall');
