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

        const onDisconnectHandler = this.GetUserOnDisconnectedFunction(user);
        this.BindUserOnMessageSend(user, onDisconnectHandler);

        user.InformAboutConnectedToRoom(this.GetExtendedRoomData());
        this.InformUsersAboutUserConnected(user.GetUserPublicData());
    }

    private async RemoveUserFromRoom(userId: string): Promise<void> {
        await DB_Rooms.DisconnectUserFromRoom(this.id, {id: userId});
        delete this.usersInRoom[userId];
        this.InformUsersAboutUserRemoved(userId);
    }


    // events function
    protected BindUserOnMessageSend(user: LobbyUser, onDisconnectedHandler: any): void {
        const onMessageHandler = (event: { data: any; type: string; target: WebSocket }): void => {
            const removeHandler = this.GetRemoveHandlerFunction(user, onMessageHandler, onDisconnectedHandler);
            this.ReadUserResponse(
                user.id,
                event.data,
                removeHandler
            );
        };

        user.connection.addEventListener("message", onMessageHandler);
        user.connection.addEventListener("close", onDisconnectedHandler);
    }

    protected GetUserOnDisconnectedFunction(user: LobbyUser) {
        return (event: { wasClean: boolean; code: number; reason: string; target: WebSocket }): void => {
            this.RemoveUserFromRoom(user.id).then(r => r);
        };
    }

    protected GetRemoveHandlerFunction(user: LobbyUser, onMessageHandler: any, onDisconnectHandler: any) {
        return () => {
            user.connection.removeEventListener("message", onMessageHandler);
            user.connection.removeEventListener("close", onDisconnectHandler);
        };
    }


    private ReadUserResponse(userId: string, message: string, handlerRemoval: any): void {
        try {
            const messageBody = JSON.parse(message);

            if (!messageBody["messageType"]) return;
            const messageType = messageBody["messageType"];

            switch (messageType) {
                case userRoomResponse.chatMessage:
                    this.UserResponseChatMessage(userId, messageBody);
                    break;
                case userRoomResponse.leaveRoom:
                    this.UserResponseLeaveRoom(userId, messageBody, handlerRemoval);
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

    protected UserResponseLeaveRoom(userId: string, messageBody: any, handlerRemoval: any): void {
        const validMessage = IsRoomMessageValid.GetValidLeaveRoom(messageBody);
        if (!validMessage) return;

        handlerRemoval();
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

    public InformUsersAboutUserRemoved(userId: string): void {
        this.usersIdInRoom.forEach(uId => {
            if (userId !== uId) this.usersInRoom[uId].InformAboutRoomUserRemoved(userId);
        });
    }
}