"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commandsSections_1 = __importDefault(require("./commander/commandsSections"));
const commandsSections = new commandsSections_1.default({
    name: "Online game",
    header: "DEV",
    commands: {
        "-build-all": {
            name: "build-all",
            actionDescription: "tsc && prisma deploy",
            cmd: [
                { cmd: "tsc" },
                { cmd: "prisma", cmdParams: ["deploy"] },
                { cmd: "sudo", cmdParams: "docker-compose down".split(" ") },
                { cmd: "sudo", ignoreLogs: true, cmdParams: "docker-compose up".split(" ") }
            ]
        }
    },
    sections: {
        "git": {
            name: "git",
            commands: {
                "-acp": {
                    name: "acp",
                    actionDescription: "git add . && git commit COMMIT_NAME && git push",
                    cmd: [
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
                }
            }
        },
        "tsc": {
            name: "tsc",
            commands: {
                "-build": {
                    name: "build",
                    actionDescription: "build .ts files",
                    cmd: [{
                            cmd: "tsc"
                        }]
                }
            },
        },
        "pm2": {
            name: "pm2",
            commands: {
                "-list": {
                    name: "list",
                    actionDescription: "pm2 list",
                    cmd: [{
                            cmd: "pm2",
                            cmdParams: ["list"],
                        }]
                },
                "-monitor": {
                    name: "monitor",
                    actionDescription: "pm2 monit",
                    cmd: [{
                            cmd: "pm2",
                            cmdParams: ["monit"],
                        }]
                },
                "-start": {
                    name: "start",
                    actionDescription: "pm2 start {FILE_PATH} --name {APP_NAME} -- {ARGS}",
                    cmd: [{
                            cmd: "pm2",
                            cmdParams: "start FILE_PATH --name APP_NAME -- ARGS".split(" "),
                            cmdConfigurableValues: ["FILE_PATH", "APP_NAME", "ARGS"]
                        }],
                },
                "-restart": {
                    name: "restart",
                    actionDescription: "pm2 restart {APP_NAME}",
                    cmd: [{
                            cmd: "pm2",
                            cmdParams: "restart APP_NAME".split(" "),
                            cmdConfigurableValues: ["APP_NAME"]
                        }],
                },
                "-stop": {
                    name: "stop",
                    actionDescription: "pm2 stop {APP_NAME}",
                    cmd: [{
                            cmd: "pm2",
                            cmdParams: "stop APP_NAME".split(" "),
                            cmdConfigurableValues: ["APP_NAME"]
                        }],
                },
                "-delete": {
                    name: "delete",
                    actionDescription: "pm2 delete {APP_NAME}",
                    cmd: [{
                            cmd: "pm2",
                            cmdParams: "delete APP_NAME".split(" "),
                            cmdConfigurableValues: ["APP_NAME"]
                        }],
                },
                "-reload": {
                    name: "reload",
                    actionDescription: "pm2 reload {APP_NAME}",
                    cmd: [{
                            cmd: "pm2",
                            cmdParams: "reload APP_NAME".split(" "),
                            cmdConfigurableValues: ["APP_NAME"]
                        }],
                }
            }
        },
        "prisma": {
            name: "prisma",
            commands: {
                "-deploy": {
                    name: "deploy",
                    cmd: [{
                            cmd: "prisma",
                            cmdParams: ["deploy"]
                        }]
                }
            }
        },
        "docker-compose": {
            name: "docker-compose",
            commands: {
                "-up": {
                    name: "up",
                    actionDescription: "docker-compose up",
                    cmd: [{
                            cmd: "sudo",
                            cmdParams: "docker-compose up".split(" ")
                        }]
                },
                "-down": {
                    name: "down",
                    actionDescription: "docker-compose down",
                    cmd: [{
                            cmd: "sudo",
                            cmdParams: "docker-compose down".split(" ")
                        }]
                }
            }
        },
    }
});
commandsSections.Enter(() => {
    console.clear();
    console.log(" bye ");
});
