import chalk = require("chalk");

export function logSystemInfo() {
    const dateNow = new Date(Date.now());

    const usedMemory = `${(((process.memoryUsage().heapUsed / 1024 / 1024) * 100) | 0) / 100}`;
    const cpuUsage = (((process.cpuUsage().system * 100 / process.cpuUsage().user) * 100) | 0) / 100;

    console.log(
        " |" +
        ` [ ${dateNow.toDateString()} ]` +
        ` [ ${dateNow.toLocaleTimeString()} ]` +
        ` [ ${chalk.blueBright("SYS")} ]` +
        " |---| " +
        chalk.blueBright(`mem: ${usedMemory} mb`) + " | " +
        chalk.blueBright(`cpu: ${cpuUsage} %`)
    );
}

export function StartLoggingSystemStatsTimeout(timeout = 120000) {
    setTimeout(() => {
        logSystemInfo();
        StartLoggingSystemStatsTimeout(timeout);
    }, timeout)
}