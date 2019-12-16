import WebSocket from "ws";
import express from "express";

import webPageRoute from "./expressRouter/webPageRoute";

import logLetters from "./consoleLogs/logLetters";
import logInfo from "./consoleLogs/logInfo";

import {GamesManager} from "./gamesManager/gamesManager";
import {StartLoggingSystemStatsTimeout} from "./consoleLogs/logSystemInfo";


export async function runProductionBuild(webPort: number, gameWSPort: number) {
    console.clear();
    logLetters("hi!");
    logLetters("prod +_+");
    console.log();

    logInfo(`Server version: ${process.env.npm_package_version}`);

    const app = express();
    const gamesManager = new GamesManager(
        new WebSocket.Server({port: gameWSPort}),
        () => logInfo(`Game listening at port ${gameWSPort}`)
    );

    app.use(webPageRoute);
    app.listen(webPort, () => logInfo(`Web listening at port ${webPort}`));

    StartLoggingSystemStatsTimeout(600000);
}