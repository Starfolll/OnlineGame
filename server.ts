import express from "express";
import WebSocket from "ws";

import webPageRoute from "./scripts/expressRouter/webPageRoute";

import {GamesManager} from "./scripts/gamesManager/gamesManager"
import {HeroesStacks} from "./scripts/gamesManager/gameTableManager/heroesStacks/heroesStacks";
import {Decks} from "./scripts/gamesManager/gameTableManager/deck/decks";
import logInfo from "./scripts/consoleLoger/logInfo";
import logLetters from "./scripts/consoleLoger/logLetters";
import {StartLoggingSystemStatsTimeout} from "./scripts/consoleLoger/logSystemInfo";

const app = express();
const gamesManager = new GamesManager(new WebSocket.Server({port: 8080}));

(async () => {
    console.clear();
    logLetters("Hi!");
    logLetters("lol +_+");
    console.log();

    app.use(webPageRoute);
    app.listen(8000, () => logInfo("server started!"));

    StartLoggingSystemStatsTimeout();

    gamesManager.CreateNewTable(
        1,
        new Set([1, 2]),
        Decks.defaultDeck,
        HeroesStacks.defaultStack
    );
})();