"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
function logSystemInfo() {
    const dateNow = new Date(Date.now());
    const usedMemory = `${(((process.memoryUsage().heapUsed / 1024 / 1024) * 100) | 0) / 100}`;
    const cpuUsage = (((process.cpuUsage().system * 100 / process.cpuUsage().user) * 100) | 0) / 100;
    console.log(" |" +
        ` [ ${dateNow.toDateString()} ]` +
        ` [ ${dateNow.toLocaleTimeString()} ]` +
        ` [ ${chalk.blueBright("SYS")} ]` +
        " |---| " +
        chalk.blueBright(`mem: ${usedMemory} mb`) + " | " +
        chalk.blueBright(`cpu: ${cpuUsage} %`));
}
exports.logSystemInfo = logSystemInfo;
function StartLoggingSystemStatsTimeout(timeout = 120000) {
    setTimeout(() => {
        logSystemInfo();
        StartLoggingSystemStatsTimeout(timeout);
    }, timeout);
}
exports.StartLoggingSystemStatsTimeout = StartLoggingSystemStatsTimeout;
