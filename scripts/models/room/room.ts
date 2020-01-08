import {userPublicData, userUniqueData} from "../user/user";

import DB_Rooms from "./db_rooms";

import Chat from "../../utils/chat/chat";
import ChatMessage, {chatMessageInfo} from "../../utils/chat/chatMessage";
import LobbyUser from "../../globalLobbyManager/lobbyUser";
import {userRoomResponse} from "../../globalLobbyManager/communicationWithUser/room/responseRoomMessage.types";
import IsRoomMessageValid from "../../globalLobbyManager/communicationWithUser/room/responseRoomMessage";
import GamesManagerApiRequests from "../../api/gamesManager/gamesManager.api.requests";

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
    public creator?: LobbyUser;

    private readonly usersInRoom: { [userId: string]: LobbyUser } = {};
    private readonly chat: Chat<ChatMessage>;

    private readonly onRoomDeleteHandler: (isRoomPublic: boolean, roomId: string) => void;


    constructor(
        roomData: roomData,
        onRoomDeleteHandler: (isRoomPublic: boolean, roomId: string) => void,
        creator?: LobbyUser
    ) {
        this.id = roomData.id;
        this.isPublic = roomData.isPublic;
        this.maxUsersInRoom = roomData.maxUsersInRoom;
        this.usersInRoom = {};

        this.creator = creator;
        if (!!this.creator) {
            this.usersInRoom[this.creator.id] = this.creator;
            this.AttachUserOnMessageSend(this.creator);
            this.AttachUserOnClose(this.creator);
        }

        this.onRoomDeleteHandler = onRoomDeleteHandler;

        this.chat = new Chat<ChatMessage>(30);
    }


    get usersIdInRoom(): Array<string> {
        return Object.keys(this.usersInRoom);
    }


    public IsRoomFull(): boolean {
        return Object.keys(this.usersInRoom).length >= this.maxUsersInRoom;
    }


    // connections
    public AttachUserOnMessageSend(user: LobbyUser): void {
        user.ConnectionAddEventListener(
            "room",
            "onMessage",
            "message",
            this.GetOnMessageSentEventListener(user)
        );
    }

    public AttachUserOnClose(user: LobbyUser): void {
        user.ConnectionAddEventListener(
            "room",
            "onClose",
            "close",
            this.GetOnCloseEventListener(user)
        )
    }


    public async ConnectUserToRoom(user: LobbyUser): Promise<void> {
        await DB_Rooms.ConnectUserToRoom(this.id, {id: user.id});

        this.usersInRoom[user.id] = user;

        this.AttachUserOnMessageSend(user);
        this.AttachUserOnClose(user);

        user.InformAboutConnectedToRoom(this.GetExtendedRoomData());
        this.InformUsersAboutUserConnected(user.GetUserPublicData());

        if (this.IsRoomFull() && this.isPublic) this.StartPublicGame();
    }

    private async RemoveUserFromRoom(userId: string): Promise<void> {
        await DB_Rooms.DisconnectUserFromRoom(this.id, {id: userId});

        const user = this.usersInRoom[userId];
        user.ConnectionClearClassListeners("room");

        delete this.usersInRoom[userId];
        this.InformUsersAboutUserRemoved(userId);

        if (!this.isPublic && !!this.creator && userId === this.creator.id) {
            this.creator = this.usersInRoom[this.usersIdInRoom[0]];
            if (!!this.creator) {
                await DB_Rooms.ResetUserCreator(this.id, {id: this.creator.id} as userUniqueData);
                this.InformUsersAboutNewCreator(this.creator.id);
            } else {
                this.onRoomDeleteHandler(this.isPublic, this.id);
            }
        }
    }


    // start game
    private async StartPublicGame(): Promise<void> {
        const tableData = (await GamesManagerApiRequests.CreateNewTable(this.usersIdInRoom));

        this.InformUsersAboutGameStart(tableData.id);
        this.RemoveUsersEventHandlers();
        this.onRoomDeleteHandler(this.isPublic, this.id);
    }

    private RemoveUsersEventHandlers(): void {
        this.usersIdInRoom.forEach(uId => {
            this.usersInRoom[uId].ConnectionRemoveAllListeners();
            this.usersInRoom[uId].CloseConnection(1000, "redirect to game server");
        });
    }

    // event listeners
    private GetOnMessageSentEventListener(user: LobbyUser): any {
        return (event: { data: any; type: string; target: WebSocket }): void => {
            this.ReadUserResponse(user.id, event.data,);
        };
    }

    private GetOnCloseEventListener(user: LobbyUser): any {
        return (event: { wasClean: boolean; code: number; reason: string; target: WebSocket }): void => {
            this.RemoveUserFromRoom(user.id).then(r => r);
        };
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

                case userRoomResponse.removeUserFromRoom:
                    this.UserResponseRemoveUser(userId, messageBody);
                    break;

                case userRoomResponse.leaveRoom:
                    this.UserResponseLeaveRoom(userId, messageBody);
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

    protected UserResponseRemoveUser(userId: string, messageBody: any): void {
        const validMessage = IsRoomMessageValid.GetValidRemoveUser(messageBody);
        if (!validMessage) return;

        if (!this.isPublic && !!this.creator && userId === this.creator.id &&
            validMessage.userId !== this.creator.id &&
            this.usersIdInRoom.some(uId => uId === validMessage.userId)
        ) {
            this.RemoveUserFromRoom(userId).then(r => r);
        }
    }

    protected UserResponseLeaveRoom(userId: string, messageBody: any): void {
        const validMessage = IsRoomMessageValid.GetValidLeaveRoom(messageBody);
        if (!validMessage) return;

        this.RemoveUserFromRoom(userId).then(r => r);
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
            this.usersInRoom[uId].InformAboutRoomUserRemoved(userId);
        });
    }

    public InformUsersAboutGameStart(tableId: string): void {
        this.usersIdInRoom.forEach(uId => {
            this.usersInRoom[uId].InformAboutGameStart(tableId);
        });
    }

    public InformUsersAboutNewCreator(creatorId: string): void {
        this.usersIdInRoom.forEach(uId => {
            this.usersInRoom[uId].InformAboutNewRoomCreator(creatorId);
        })
    }
}