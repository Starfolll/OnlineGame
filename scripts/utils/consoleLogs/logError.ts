import chalk = require("chalk");

export default function logError(message: any,) {
    const dateNow = new Date(Date.now());
    console.log(
        " |" +
        ` [ ${dateNow.toDateString()} ]` +
        ` [ ${dateNow.toLocaleTimeString()} ]` +
        ` [ ${chalk.redBright("ERR")} ]` +
        " |---| " +
        chalk.redBright(JSON.stringify(message, null, 2))
    );
}