import DB_Lobbies from "./db_lobbies";
import {userUniqueData} from "../user/user";

export type lobbyData = {
    id: string;
    isGlobal: boolean;
    name?: string;
}

export default class Lobby {
    public readonly id: string;
    public readonly isGlobal: boolean;
    public readonly name?: string;


    constructor(data: lobbyData) {
        this.id = data.id;
        this.isGlobal = data.isGlobal;
        this.name = data.name;
    }


    public async GetUsersIdInLobby(): Promise<Array<string>> {
        return await DB_Lobbies.GetUsersIdInLobby(this.id);
    }

    public async ConnectUser(user: userUniqueData): Promise<void> {
        await DB_Lobbies.ConnectUserToLobby(this.id, user);
    }

    public async DisconnectUser(user: userUniqueData): Promise<void> {
        await DB_Lobbies.DisconnectUserFromLobby(this.id, user);
    }
}