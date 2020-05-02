import chalk = require("chalk");

export default function logLink(link: string, message?: any) {
    const dateNow = new Date(Date.now());
    console.log(
        " |" +
        ` [ ${dateNow.toDateString()} ]` +
        ` [ ${dateNow.toLocaleTimeString()} ]` +
        ` [ ${chalk.gray("WEB")} ]` +
        " |---| " +
        chalk.underline(link) + " => " +
        message
    );
}