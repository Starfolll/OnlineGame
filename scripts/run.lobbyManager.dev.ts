import logInfo from "./utils/consoleLogs/logInfo";
import logLink from "./utils/consoleLogs/logLink";
import {StartLoggingSystemStatsTimeout} from "./utils/consoleLogs/logSystemInfo";
import GlobalLobbyManager from "./globalLobbyManager/globalLobbyManager";
import WebSocket from "ws";
import GlobalLobby from "./globalLobbyManager/globalLobby";
import DB_Lobbies from "./models/lobby/db_lobbies";
import wrappedPrisma from "./models/wrappedPrisma";


export default class GlobalLobbyManagerServerDev {
    private lobbyManager: GlobalLobbyManager | undefined;

    private lobbyManagerWSPort: number | undefined;

    constructor() {
        (async () => {
            logInfo("Mode: LOBBY MANAGER");
            logInfo(`Server version: ${process.env.npm_package_version}`);
            StartLoggingSystemStatsTimeout(120000 * 3);

            await wrappedPrisma.deleteManyRooms();
            await wrappedPrisma.deleteManyLobbies();

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