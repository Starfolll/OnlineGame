"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
function logLink(link, message) {
    const dateNow = new Date(Date.now());
    console.log(" |" +
        ` [ ${dateNow.toDateString()} ]` +
        ` [ ${dateNow.toLocaleTimeString()} ]` +
        ` [ ${chalk.gray("WEB")} ]` +
        " |---| " +
        chalk.underline(link) + " => " +
        message);
}
exports.default = logLink;
