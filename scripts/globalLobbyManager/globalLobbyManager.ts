import WebSocket from "ws";
import GlobalLobby from "./globalLobby";
import IsLobbyMessageValid from "./communicationWithUser/globalLobby/responseGlobalLobbyMessages";
import logError from "../consoleLogs/logError";
import DB_Users from "../models/user/db_users";
import DB_Tables from "../models/table/db_tables";
import GetGlobalLobbyMessage from "./communicationWithUser/globalLobby/informGlobalLobbyMessages";
import DB_Rooms from "../models/room/db_rooms";

export default class GlobalLobbyManager {
    private readonly globalLobby: GlobalLobby;

    constructor(gameWSS: WebSocket.Server, globalLobby: GlobalLobby, cb?: Function) {
        this.globalLobby = globalLobby;

        gameWSS.on("connection", (connection: WebSocket) => {
            const onMessageHandler = async (event: { data: any; type: string; target: WebSocket }) => {
                try {
                    const validMessage = IsLobbyMessageValid.GetValidUserInitialConnection(JSON.parse(event.data));
                    if (!validMessage) throw new Error();

                    const userData = await DB_Users.GetUserDataByIdAndToken(validMessage.id, validMessage.token);
                    if (!userData) throw new Error();

                    const tableId = await DB_Tables.GetUserTableId({id: userData.id});
                    if (!!tableId) {
                        connection.send(JSON.stringify(GetGlobalLobbyMessage.RedirectToGameTable(tableId)));
                        throw new Error();
                    }

                    const roomId = await DB_Rooms.GetUserRoomId({id: userData.id});
                    if (!!roomId) {
                        const isRoomPublic = await DB_Rooms.IsRoomPublic(roomId);

                        connection.send(JSON.stringify(GetGlobalLobbyMessage.RedirectToRoom(
                            this.globalLobby.GetRoomData(roomId, isRoomPublic)!
                        )));
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