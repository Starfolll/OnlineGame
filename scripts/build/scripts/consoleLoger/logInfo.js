"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
function logInfo(message) {
    const dateNow = new Date(Date.now());
    console.log(" |" +
        ` [ ${dateNow.toDateString()} ]` +
        ` [ ${dateNow.toLocaleTimeString()} ]` +
        ` [ ${chalk.greenBright("INF")} ]` +
        " |---| " +
        message);
}
exports.default = logInfo;
