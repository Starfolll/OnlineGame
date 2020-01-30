"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const gitCommands = {
    acp: () => ({
        name: "acp",
        actionDescription: "git add . && git commit COMMIT_NAME && git push",
        cmd: [
            {
                cmd: "ls"
            },
            {
                cmd: "git",
                cmdParams: "add .".split(" "),
            },
            {
                cmd: "git",
                cmdParams: "commit -m COMMIT_NAME".split(" "),
                cmdConfigurableValues: "COMMIT_NAME".split(" ")
            },
            {
                cmd: "git",
                cmdParams: "push".split(" "),
            }
        ]
    }),
};
const gitCommandsSection = {
    name: "git",
    startCommand: () => child_process_1.execSync("git branch", { stdio: "inherit" }),
    commands: {
        "-acp": gitCommands.acp()
    }
};
exports.default = gitCommandsSection;
