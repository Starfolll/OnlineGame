import WebSocket from "ws";
import GlobalLobby from "./globalLobby";
import IsLobbyMessageValid from "./communicationWithUser/globalLobby/responseGlobalLobbyMessages";
import logError from "../consoleLogs/logError";
import DB_Users from "../models/user/db_users";

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