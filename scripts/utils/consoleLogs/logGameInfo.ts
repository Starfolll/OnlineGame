import chalk = require("chalk");

export default function logGameInfo(message: any) {
    const dateNow = new Date(Date.now());
    console.log(
        " |" +
        ` [ ${dateNow.toDateString()} ]` +
        ` [ ${dateNow.toLocaleTimeString()} ]` +
        ` [ ${chalk.yellowBright("GEM")} ]` +
        " |---| " +
        JSON.stringify(message, null, 2)
    );
}