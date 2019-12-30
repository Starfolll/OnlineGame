import logInfo from "./utils/consoleLogs/logInfo";
import logLink from "./utils/consoleLogs/logLink";
import {StartLoggingSystemStatsTimeout} from "./utils/consoleLogs/logSystemInfo";
import GlobalLobbyManager from "./globalLobbyManager/globalLobbyManager";
import WebSocket from "ws";
import GlobalLobby from "./globalLobbyManager/globalLobby";
import DB_Lobbies from "./models/lobby/db_lobbies";
import dockerPrisma from "./models/dockerPrisma";


export default class GlobalLobbyManagerServerDev {
    private lobbyManager: GlobalLobbyManager | undefined;

    private lobbyManagerWSPort: number | undefined;

    constructor() {
        (async () => {
            // console.clear();
            // logLetters("hi!");
            // logLetters("dev +_+");
            // console.log();

            // console.log();
            logInfo("Mode: LOBBY MANAGER");
            logInfo(`Server version: ${process.env.npm_package_version}`);
            StartLoggingSystemStatsTimeout(120000 * 3);
            // console.log();

            await dockerPrisma.deleteManyRooms();
            await dockerPrisma.deleteManyLobbies();

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