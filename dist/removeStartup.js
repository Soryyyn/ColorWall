"use strict";
var startup = require('user-startup');
var nodePath = process.execPath;
var startupArgs = ['./main.js'];
var output = '../out.log';
startup.remove('hexwall');
