"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
function logError(message) {
    const dateNow = new Date(Date.now());
    console.log(" |" +
        ` [ ${dateNow.toDateString()} ]` +
        ` [ ${dateNow.toLocaleTimeString()} ]` +
        ` [ ${chalk.redBright("ERR")} ]` +
        " |---| " +
        chalk.redBright(JSON.stringify(message, null, 2)));
}
exports.default = logError;
