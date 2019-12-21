import Db_Lobbies from "./db_lobbies";
import {userData, userPublicData, userUniqueData} from "../user/user";
import WebSocket from "ws";
import LobbyUser from "../../globalLobbyManager/lobbyUser";
import Chat from "../../chat/chat";
import ChatMessage, {chatMessageInfo} from "../../chat/chatMessage";

export type extendedLobbyData = {
    lobbyData: lobbyData,
    chat: Array<chatMessageInfo>
}

export type lobbyData = {
    id: string;
    name?: string;
}

export default class Lobby {
    public readonly id: string;
    public readonly name?: string;

    private readonly usersInLobby: { [userId: string]: LobbyUser } = {};
    private readonly chat: Chat<ChatMessage>;


    constructor(data: lobbyData, maxSavedMessages: number) {
        this.id = data.id;
        this.name = data.name;

        this.chat = new Chat<ChatMessage>(maxSavedMessages);
        this.chat.AddMessage(new ChatMessage(
            {
                id: "server",
                publicName: "SERVER"
            },
            `Global lobby [ ${data.name} ]`,
            true
        ));
    }


    get lobbyData(): lobbyData {
        return {
            id: this.id,
            name: this.name
        }
    }


    protected AddNewChatMessage(message: string, user: userPublicData): void {
        const chatMessage = new ChatMessage(user, message);
        this.chat.AddMessage(chatMessage);
        this.InformUsersAboutChatMassage(chatMessage.GetMessageInfo());
    }

    // users connection
    protected async GetUserInLobbyInfo(userUniqueData: userUniqueData): Promise<userData | null> {
        return await Db_Lobbies.GetUserInLobbyInfo(userUniqueData);
    }

    protected async GetUsersIdInLobby(): Promise<Array<string>> {
        return await Db_Lobbies.GetUsersIdInLobby(this.id);
    }

    protected async ConnectUserToLobby(userUniqueData: userUniqueData, connection: WebSocket): Promise<LobbyUser | null> {
        await Db_Lobbies.ConnectUserToLobby(this.id, userUniqueData);
        const userData = await this.GetUserInLobbyInfo(userUniqueData);
        if (!!userData) {
            const lobbyUser = new LobbyUser(userData, connection);
            this.usersInLobby[lobbyUser.id] = (lobbyUser);
            return lobbyUser;
        }
        return null;
    }

    protected async DisconnectUserFromLobby(userId: string): Promise<void> {
        await Db_Lobbies.DisconnectUserFromLobby(this.id, {id: userId});
        delete this.usersInLobby[userId];
    }


    protected async GetLobbyInfo(): Promise<extendedLobbyData> {
        return {
            lobbyData: this.lobbyData,
            chat: this.chat.GetMessages().map(m => m.GetMessageInfo()),
        }
    }

    // informatory
    public InformUsersAboutChatMassage(message: chatMessageInfo): void {
        Object.keys(this.usersInLobby).forEach(uId => this.usersInLobby[uId].InformAboutChatMessage(message));
    }
}