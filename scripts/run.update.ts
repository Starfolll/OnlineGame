import {execSync} from "child_process";
import readline from "readline";
import chalk from "chalk";

export async function runUpdate() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "> "
    });

    console.log(` | ${chalk.greenBright("Write commit name")}`);
    for await (const line of rl) {
        console.log();

        const addStdout = execSync(`git add .`);
        console.log(addStdout + "\n");

        const commitStdout = execSync(`git commit -m "${line}"`);
        console.log(commitStdout + "\n");

        const pushStdout = execSync("git push");
        console.log(pushStdout + "\n");
        break;
    }
}