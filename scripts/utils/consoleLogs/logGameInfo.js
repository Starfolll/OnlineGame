"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
function logGameInfo(message) {
    const dateNow = new Date(Date.now());
    console.log(" |" +
        ` [ ${dateNow.toDateString()} ]` +
        ` [ ${dateNow.toLocaleTimeString()} ]` +
        ` [ ${chalk.yellowBright("GEM")} ]` +
        " |---| " +
        JSON.stringify(message, null, 2));
}
exports.default = logGameInfo;
