import chalk = require("chalk");

export default function logInfo(message: any) {
    const dateNow = new Date(Date.now());
    console.log(
        " |" +
        ` [ ${dateNow.toDateString()} ]` +
        ` [ ${dateNow.toLocaleTimeString()} ]` +
        ` [ ${chalk.greenBright("INF")} ]` +
        " |---| " +
        JSON.stringify(message, null, 2)
    );
}