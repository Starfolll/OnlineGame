import WebSocket from "ws";

import User, {userData, userPublicData} from "../models/user/user";
import GetGlobalLobbyMessage from "./communicationWithUser/globalLobby/informGlobalLobbyMessages";
import {extendedLobbyData} from "../models/lobby/lobby";
import {chatMessageInfo} from "../chat/chatMessage";
import {extendedRoomData} from "../models/room/room";
import GetRoomMessage from "./communicationWithUser/room/informRoomMessages";

export default class LobbyUser extends User {
    public readonly connection: WebSocket;


    constructor(data: userData, connection: WebSocket) {
        super(data);

        this.connection = connection;
    }


    // informatory
    // lobby
    public InformAboutLobby(lobbyData: extendedLobbyData): void {
        this.connection.send(JSON.stringify(GetGlobalLobbyMessage.LobbyInfo(lobbyData)));
    }

    public InformAboutGlobalLobbyChatMessage(message: chatMessageInfo): void {
        this.connection.send(JSON.stringify(GetGlobalLobbyMessage.GlobalLobbyChatMessage(message)));
    }

    public InformAboutConnectedToRoom(message: extendedRoomData): void {
        this.connection.send(JSON.stringify(GetGlobalLobbyMessage.RedirectToRoom(message)));
    }

    // room
    public InformAboutRoomChatMessage(message: chatMessageInfo): void {
        this.connection.send(JSON.stringify(GetRoomMessage.RoomChatMessage(message)));
    }

    public InformAboutRoomUserConnected(user: userPublicData): void {
        this.connection.send(JSON.stringify(GetRoomMessage.UserConnected(user)));
    }

    public InformAboutRoomUserRemoved(userId: string): void {
        this.connection.send(JSON.stringify(GetRoomMessage.UserRemoved(userId)));
    }
}