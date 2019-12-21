import WebSocket from "ws";

import User, {userData} from "../models/user/user";
import GetGlobalLobbyMessage from "./communicationWithUser/globalLobby/informGlobalLobbyMessages";
import {extendedLobbyData} from "../models/lobby/lobby";
import {chatMessageInfo} from "../chat/chatMessage";

export default class LobbyUser extends User {
    public readonly connection: WebSocket;


    constructor(data: userData, connection: WebSocket) {
        super(data);

        this.connection = connection;
    }


    public InformAboutLobby(lobbyData: extendedLobbyData): void {
        this.connection.send(JSON.stringify(GetGlobalLobbyMessage.LobbyInfo(lobbyData)));
    }

    public InformAboutChatMessage(message: chatMessageInfo): void {
        this.connection.send(JSON.stringify(GetGlobalLobbyMessage.ChatMessage(message)));
    }
}