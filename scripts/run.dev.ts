import WebSocket from "ws";
import express from "express";

import webPageRoute from "./router/static/webPage.route";
import usersAvatar from "./router/static/usersAvatar";

import logLetters from "./consoleLogs/logLetters";
import logInfo from "./consoleLogs/logInfo";
import logLink from "./consoleLogs/logLink";

import {prisma} from "../generated/prisma-client";
import DB_Users from "./models/user/db_users";
import DB_Lobbies from "./models/lobby/db_lobbies";

import {GamesManager} from "./gamesManager/gamesManager";
import {StartLoggingSystemStatsTimeout} from "./consoleLogs/logSystemInfo";
import GlobalLobbyManager from "./globalLobbyManager/globalLobbyManager";
import GlobalLobby from "./globalLobbyManager/globalLobby";
import {Decks} from "./gamesManager/gameTableManager/deck/decks";
import {HeroesStacks} from "./gamesManager/gameTableManager/heroesStacks/heroesStacks";


export async function runDevelopmentBuild(webPort: number, gameWSPort: number, globalLobbyWSPort: number) {
    console.clear();
    logLetters("hi!");
    logLetters("dev +_+");
    console.log();

    logLink(`http://localhost:${webPort}`, "Website");
    logLink(`http://localhost:4466`, "Prisma playground");
    logLink(`http://localhost:4466/_admin`, "Prisma admin panel");
    console.log();

    logInfo(`Server version: ${process.env.npm_package_version}`);
    StartLoggingSystemStatsTimeout(120000 * 3);


    const app = express();
    app.use("/", webPageRoute);
    app.use("/usersAvatars", usersAvatar);
    app.listen(webPort);
    logInfo(`Web listening at port ${webPort}`);

    const gamesManager = new GamesManager(
        new WebSocket.Server({port: gameWSPort}),
        () => logInfo(`Game manager listening at port ${gameWSPort}`)
    );

    await prisma.deleteManyRooms();
    await prisma.deleteManyLobbies();
    await prisma.deleteManyTables();
    await prisma.deleteManyUsers();

    const lobbyManager = new GlobalLobbyManager(
        new WebSocket.Server({port: globalLobbyWSPort}),
        new GlobalLobby(
            await DB_Lobbies.CreateNewLobby({name: "global 1"}),
            30
        ),
        () => logInfo(`Lobby manager listening at port ${globalLobbyWSPort}`)
    );

    console.log();

    await DB_Users.CreateNewUser({
        "id": "id1",
        "name": "admin 1",
        "email": "admin 1 email",
        "password": "password",
        "publicName": "admin 1",
        "token": "1"
    });

    await DB_Users.CreateNewUser({
        "id": "id2",
        "name": "admin 2",
        "email": "admin 2 email",
        "password": "password",
        "publicName": "admin 2",
        "token": "2"
    });

    console.log();

    await gamesManager.CreateNewTable(
        {usersId: []},
        Decks.defaultDeck,
        HeroesStacks.defaultStack
    );

    console.log();
}