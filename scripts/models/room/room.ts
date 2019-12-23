import Chat from "../../chat/chat";
import ChatMessage, {chatMessageInfo} from "../../chat/chatMessage";
import {userPublicData} from "../user/user";
import LobbyUser from "../../globalLobbyManager/lobbyUser";
import WebSocket from "ws";
import DB_Rooms from "./db_rooms";
import {userRoomResponse} from "../../globalLobbyManager/communicationWithUser/room/responseRoomMessage.types";
import IsRoomMessageValid from "../../globalLobbyManager/communicationWithUser/room/responseRoomMessage";

export type extendedRoomData = {
    roomData: roomData;
    usersInRoom: Array<userPublicData>
}

export type roomData = {
    id: string;
    isPublic: boolean;
    maxUsersInRoom: number;
    creator?: userPublicData;
}

export default class Room {
    public readonly id: string;
    public readonly isPublic: boolean;
    public readonly maxUsersInRoom: number;
    public readonly creator?: LobbyUser;

    private readonly usersInRoom: { [userId: string]: LobbyUser } = {};
    private readonly chat: Chat<ChatMessage>;


    constructor(roomData: roomData, creator?: LobbyUser) {
        this.id = roomData.id;
        this.isPublic = roomData.isPublic;
        this.maxUsersInRoom = roomData.maxUsersInRoom;
        this.creator = creator;

        this.chat = new Chat<ChatMessage>(30);
    }


    get usersIdInRoom(): Array<string> {
        return Object.keys(this.usersInRoom);
    }


    public IsRoomFull(): boolean {
        return Object.keys(this.usersInRoom).length >= this.maxUsersInRoom;
    }


    // connections
    public async ConnectUserToRoom(user: LobbyUser): Promise<void> {
        await DB_Rooms.ConnectUserToRoom(this.id, {id: user.id});

        this.usersInRoom[user.id] = user;

        this.AttachUserOnMessageSend(user);
        this.AttachUserOnDisconnected(user);
        user.InformAboutConnectedToRoom(this.GetExtendedRoomData());
        this.InformUsersAboutUserConnected(user.GetUserPublicData());
    }

    private async DisconnectUserFromRoom(userId: string): Promise<void> {
        await DB_Rooms.DisconnectUserFromRoom(this.id, {id: userId});
        delete this.usersInRoom[userId];
        this.InformUsersAboutUserDisconnected(userId);
    }


    // events
    protected AttachUserOnMessageSend(user: LobbyUser): void {
        const onMessageHandler = (event: { data: any; type: string; target: WebSocket }): void => {
            this.ReadUserResponse(user.id, event.data);
        };

        user.connection.addEventListener("message", onMessageHandler);
    }

    protected AttachUserOnDisconnected(user: LobbyUser): void {
        const onDisconnected = (event: { wasClean: boolean; code: number; reason: string; target: WebSocket }): void => {
            this.DisconnectUserFromRoom(user.id).then(r => r);
        };

        user.connection.addEventListener("close", onDisconnected);
    }


    private ReadUserResponse(userId: string, message: string): void {
        try {
            const messageBody = JSON.parse(message);

            if (!messageBody["messageType"]) return;
            const messageType = messageBody["messageType"];

            switch (messageType) {
                case userRoomResponse.chatMessage:
                    this.UserResponseChatMessage(userId, messageBody);
                    break;
            }
        } catch (e) {

        }
    }

    private UserResponseChatMessage(userId: string, messageBody: any): void {
        const validMessage = IsRoomMessageValid.GetValidChatMessage(messageBody);
        if (!validMessage) return;

        const message = new ChatMessage(
            this.usersInRoom[userId].GetUserPublicData(),
            validMessage.message
        );

        this.chat.AddMessage(message);
        this.InformUsersAboutRoomChatMessage(message.GetMessageInfo());
    }

    // room info
    public GetExtendedRoomData(): extendedRoomData {
        return {
            "roomData": this.GetRoomData(),
            "usersInRoom": Object.keys(this.usersInRoom).map(uId => {
                return this.usersInRoom[uId].GetUserPublicData();
            })
        }
    }

    public GetRoomData(): roomData {
        return {
            "maxUsersInRoom": this.maxUsersInRoom,
            "isPublic": this.isPublic,
            "id": this.id
        }
    }


    // informatory
    public InformUsersAboutRoomChatMessage(message: chatMessageInfo): void {
        this.usersIdInRoom.forEach(uId => {
            this.usersInRoom[uId].InformAboutRoomChatMessage(message);
        });
    }

    public InformUsersAboutUserConnected(user: userPublicData): void {
        this.usersIdInRoom.forEach(uId => {
            if (user.id !== uId) this.usersInRoom[uId].InformAboutRoomUserConnected(user);
        });
    }

    public InformUsersAboutUserDisconnected(userId: string): void {
        this.usersIdInRoom.forEach(uId => {
            this.usersInRoom[uId].InformAboutRoomUserRemoved(userId);
        });
    }
}