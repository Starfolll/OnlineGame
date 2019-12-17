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
        if (line === "") return;
        console.log();

        execSync(`git add .`);
        console.log("Added files to git ." + "\n");

        const commitStdout = execSync(`git commit -m "${line}"`);
        console.log(commitStdout.toString());

        const pushStdout = execSync("git push");
        console.log(pushStdout.toString());

        return;
    }
}