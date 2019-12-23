import {userUniqueData} from "../models/user/user";
import WebSocket from "ws";
import Lobby, {lobbyData} from "../models/lobby/lobby";
import LobbyUser from "./lobbyUser";
import IsLobbyMessageValid from "./communicationWithUser/globalLobby/responseGlobalLobbyMessages";
import {userGlobalLobbyResponse} from "./communicationWithUser/globalLobby/responseGlobalLobbyMessages.types";


export default class GlobalLobby extends Lobby {
    constructor(data: lobbyData, maxSavedMessages: number) {
        super(data, maxSavedMessages);
    }


    public async ConnectUser(user: userUniqueData, connection: WebSocket): Promise<void> {
        const lobbyUser = await this.ConnectUserToLobby(user, connection);
        if (!!lobbyUser) {
            lobbyUser.InformAboutLobby(await this.GetLobbyInfo());
            this.AttachUserOnMessageSend(lobbyUser);
            this.AttachUserOnDisconnected(lobbyUser);
        }
    }


    protected AttachUserOnMessageSend(user: LobbyUser): void {
        const onMessageHandler = (event: { data: any; type: string; target: WebSocket }): void => {
            this.ReadUserResponse(user, event.data);
        };

        user.connection.addEventListener("message", onMessageHandler);
    }

    protected AttachUserOnDisconnected(user: LobbyUser): void {
        const onDisconnected = (event: { wasClean: boolean; code: number; reason: string; target: WebSocket }): void => {
            this.DisconnectUserFromLobby(user.id).then(r => r);
        };

        user.connection.addEventListener("close", onDisconnected);
    }


    private ReadUserResponse(user: LobbyUser, message: string): void {
        try {
            const messageBody = JSON.parse(message);

            if (!messageBody["messageType"]) return;
            const messageType = messageBody["messageType"];

            switch (messageType) {
                case userGlobalLobbyResponse.globalLobbyChatMessage:
                    this.UserResponseChatMessage(user, messageBody);
                    break;

                case userGlobalLobbyResponse.publicLobbySearch:
                    this.UserResponsePublicLobbySearch(user, messageBody);
                    break;
            }

        } catch (e) {

        }
    }

    private UserResponseChatMessage(user: LobbyUser, messageBody: any): void {
        const validMessage = IsLobbyMessageValid.GetValidChatMessage(messageBody);
        if (!validMessage) return;

        this.AddNewChatMessage(
            validMessage.message,
            user.GetUserPublicData()
        );
    }

    private UserResponsePublicLobbySearch(user: LobbyUser, messageBody: any): void {
        const validMessage = IsLobbyMessageValid.GetValidPublicLobbySearch(messageBody);
        if (!validMessage) return;

        this.ConnectUserToPublicRoom(user).then(r => r);
    }
}