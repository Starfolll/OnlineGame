import Chat from "../../chat/chat";
import ChatMessage from "../../chat/chatMessage";
import User from "../user/user";

export type roomData = {
    id: string;
    isPublic: boolean;
    usersIdInRoom: Array<string>;
}

export default class Room {
    public readonly id: string;
    public readonly isPublic: boolean;

    private readonly usersIdInRoom: Set<string>;
    private readonly usersInLobby: { [userId: string]: User } = {};
    private readonly chat: Chat<ChatMessage>;


    constructor(roomData: roomData) {
        this.id = roomData.id;
        this.isPublic = roomData.isPublic;
        this.usersIdInRoom = new Set(roomData.usersIdInRoom);

        this.chat = new Chat<ChatMessage>(30);
    }
}