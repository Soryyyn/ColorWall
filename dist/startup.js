"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var path = require("path");
var shell = require("shelljs");
shell.config.silent = true; // silent no output
var Startup = /** @class */ (function () {
    function Startup() {
    }
    Startup.prototype.add = function () {
        try {
            console.log(chalk.green("hexwall added successfully to startup"));
        }
        catch (err) {
            console.log(chalk.red("adding hexwall to startup failed. error: ") + err);
        }
    };
    Startup.prototype.remove = function () {
        try {
            console.log(chalk.green("hexwall removed successfully from startup"));
        }
        catch (err) {
            console.log(chalk.red("removing hexwall from startup failed. error: ") + err);
        }
    };
    return Startup;
}());
exports.Startup = Startup;
