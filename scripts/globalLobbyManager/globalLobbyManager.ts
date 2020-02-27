import WebSocket from "ws";

import DB_Users from "../models/user/db_users";
import DB_Tables from "../models/table/db_tables";
import DB_Rooms from "../models/room/db_rooms";

import logError from "../utils/consoleLogs/logError";

import GlobalLobby from "./globalLobby";
import IsLobbyMessageValid from "./communicationWithUser/globalLobby/responseGlobalLobbyMessages";
import GetGlobalLobbyMessage from "./communicationWithUser/globalLobby/informGlobalLobbyMessages";
import DB_Lobbies from "../models/lobby/db_lobbies";

export default class GlobalLobbyManager {
    private readonly globalLobby: GlobalLobby;

    constructor(
        gameWSS: WebSocket.Server,
        globalLobby: GlobalLobby,
        cb?: Function
    ) {
        this.globalLobby = globalLobby;

        gameWSS.on("connection", (connection: WebSocket) => {
            const onMessageHandler = async (event: { data: any; type: string; target: WebSocket }) => {
                try {
                    const validMessage = IsLobbyMessageValid.GetValidUserInitialConnection(JSON.parse(event.data));
                    if (!validMessage) throw new Error();

                    const userData = await DB_Users.GetUserDataByIdAndToken(validMessage.id, validMessage.token);
                    if (!userData || !userData.isVerified) throw new Error();

                    const lobbyId = await DB_Lobbies.IsUserInLobby(this.globalLobby.id, {id: userData.id});
                    if (lobbyId) {
                        connection.close(1007, "clone");
                        return;
                    }

                    const tableId = await DB_Tables.GetUserTableId({id: userData.id});
                    if (!!tableId) {
                        connection.send(JSON.stringify(GetGlobalLobbyMessage.RedirectToGameTable(tableId)));
                        throw new Error();
                    }

                    connection.removeEventListener("message", onMessageHandler);
                    await this.globalLobby.ConnectUser({id: userData.id}, connection);
                } catch (e) {
                    if (!!e.message) logError(e.message);
                    console.log(e);
                    connection.close(1007, "invalid data model");
                }
            };

            connection.addEventListener("message", onMessageHandler);
        });

        if (!!cb) cb();
    }
}
