"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commandsSections_1 = __importDefault(require("./commander/commandsSections"));
const commandPacks_1 = __importDefault(require("./commander/commandPacks"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const commandsSections = new commandsSections_1.default({
    name: "Online game",
    header: process.env.BUILD_MODE === "dev" ? "DEV" : "PROD",
    currentDirPath: __dirname,
    commands: {
        "-br": {
            name: "br",
            actionDescription: "builds server (tsc) and restart pm2 server",
            cmd: [
                { cmd: "prisma", cmdParams: ["deploy"] },
                { cmd: "tsc" },
                { cmd: "pm2", cmdParams: ["ecosystem", "restart"] },
            ]
        },
        "-up": {
            name: "up",
            actionDescription: "pm2 ecosystem",
            cmd: [{ cmd: "pm2", cmdParams: ["start", "ecosystem.config.js"] }]
        }
    },
    sections: Object.assign(Object.assign({}, commandPacks_1.default), { "tsc": {
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
        }, "prisma": {
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
        }, "docker-compose": {
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
        } })
});
commandsSections.Enter(() => {
    console.clear();
    console.log(" bye ");
});
