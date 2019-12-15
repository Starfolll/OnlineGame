import WebSocket from "ws";
import express from "express";

import webPageRoute from "./expressRouter/webPageRoute";

import logLetters from "./consoleLoger/logLetters";
import logInfo from "./consoleLoger/logInfo";

import {GamesManager} from "./gamesManager/gamesManager";
import {StartLoggingSystemStatsTimeout} from "./consoleLoger/logSystemInfo";
import {Decks} from "./gamesManager/gameTableManager/deck/decks";
import {HeroesStacks} from "./gamesManager/gameTableManager/heroesStacks/heroesStacks";


export async function runDevelopmentBuild(webPort: number, gameWSPort: number) {
    console.clear();
    logLetters("hi!");
    logLetters("dev +_+");
    console.log();

    logInfo(`Server version: ${process.env.npm_package_version}`);

    const app = express();
    const gamesManager = new GamesManager(
        new WebSocket.Server({port: gameWSPort}),
        () => logInfo(`Game listening at port ${gameWSPort}`)
    );

    app.use(webPageRoute);
    app.listen(webPort, () => logInfo(`Web listening at port ${webPort}`));

    StartLoggingSystemStatsTimeout();

    gamesManager.CreateNewTable(
        1,
        new Set([1, 2]),
        Decks.defaultDeck,
        HeroesStacks.defaultStack
    );
}