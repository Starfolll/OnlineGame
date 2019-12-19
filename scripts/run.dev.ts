import WebSocket from "ws";
import express from "express";

import webPageRoute from "./router/webPage.route";

import logLetters from "./consoleLogs/logLetters";
import logInfo from "./consoleLogs/logInfo";
import logLink from "./consoleLogs/logLink";

import DB_Users from "./models/user/db_users";

import {GamesManager} from "./gamesManager/gamesManager";
import {StartLoggingSystemStatsTimeout} from "./consoleLogs/logSystemInfo";
import {Decks} from "./gamesManager/gameTableManager/deck/decks";
import {HeroesStacks} from "./gamesManager/gameTableManager/heroesStacks/heroesStacks";
import {userData} from "./models/user/user";


export async function runDevelopmentBuild(webPort: number, gameWSPort: number) {
    console.clear();
    logLetters("hi!");
    logLetters("dev +_+");
    console.log();

    logLink(`http://localhost:${webPort}`, "Main website");
    logInfo(`Server version: ${process.env.npm_package_version}`);

    const app = express();
    const gamesManager = new GamesManager(
        new WebSocket.Server({port: gameWSPort}),
        () => logInfo(`Game listening at port ${gameWSPort}`)
    );

    app.use(webPageRoute);
    app.listen(webPort, () => logInfo(`Web listening at port ${webPort}`));

    StartLoggingSystemStatsTimeout(120000 * 3);

    gamesManager.CreateNewTable(
        "1",
        new Set(["1", "2"]),
        Decks.defaultDeck,
        HeroesStacks.defaultStack
    );

    const starfolll = await DB_Users.IsUserExists({name: "admin"});

    console.log(starfolll);

    if (starfolll) await DB_Users.RemoveUser("admin");

    await DB_Users.AddNewUser({
        "name": "admin",
        "email": "andrey.kovyarov@gmail.com",
        "password": "password",
        "publicName": "admin"
    } as userData);

    const user = await DB_Users.GetUserDataByEmailAndPassword("andrey.kovyarov@gmail.com", "password");
    console.log(user);
}