import logLetters from "./utils/consoleLogs/logLetters";
import logInfo from "./utils/consoleLogs/logInfo";
import logLink from "./utils/consoleLogs/logLink";

import {prisma} from "../generated/prisma-client";
import {StartLoggingSystemStatsTimeout} from "./utils/consoleLogs/logSystemInfo";
import GlobalLobbyManager from "./globalLobbyManager/globalLobbyManager";
import WebSocket from "ws";
import GlobalLobby from "./globalLobbyManager/globalLobby";
import DB_Lobbies from "./models/lobby/db_lobbies";


export default class GlobalLobbyManagerServerDev {
    private lobbyManager: GlobalLobbyManager | undefined;

    private lobbyManagerWSPort: number | undefined;

    constructor() {
        (async () => {
            console.clear();
            logLetters("hi!");
            logLetters("dev +_+");
            console.log();

            console.log();
            logInfo("Mode: LOBBY MANAGER");
            logInfo(`Server version: ${process.env.npm_package_version}`);
            StartLoggingSystemStatsTimeout(120000 * 3);
            console.log();

            logLink(`http://localhost:4466`, "Prisma playground");
            logLink(`http://localhost:4466/_admin`, "Prisma admin panel");
            console.log();

            await prisma.deleteManyRooms();
            await prisma.deleteManyLobbies();

            this.lobbyManagerWSPort = +process.env.PUBLIC_GLOBAL_LOBBY_WS_PORT!;

            this.lobbyManager = new GlobalLobbyManager(
                new WebSocket.Server({
                    port: this.lobbyManagerWSPort
                }),
                new GlobalLobby(
                    await DB_Lobbies.CreateNewLobby({name: "global 1"}),
                    30
                )
            )
        })();
    }
}