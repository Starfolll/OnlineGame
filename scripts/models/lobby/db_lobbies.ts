import {prisma} from "../../../generated/prisma-client";
import {lobbyData} from "./lobby";
import logError from "../../utils/consoleLogs/logError";
import {userUniqueData} from "../user/user";
import logInfo from "../../utils/consoleLogs/logInfo";

export default class DB_Lobbies {
    public static async GetLobbyData(lobbyId: string): Promise<lobbyData | undefined> {
        const res = await prisma.lobby({id: lobbyId});
        if (!res?.id) logError(res);
        if (!res?.id) return undefined;

        return {
            name: res.name,
            id: res.id
        }
    }

    public static async CreateNewLobby(lobby: {
        id?: string,
        name: string
    }): Promise<lobbyData> {
        const res = await prisma.createLobby({
            id: lobby.id,
            name: lobby.name
        });

        if (!res.id) logError(res);
        logInfo(`New lobby: ${res.id}, ${res.name}`);

        return {
            id: res.id,
            name: res.name
        }
    }

    public static async DeleteLobby(lobbyId: string): Promise<void> {
        const res = await prisma.deleteLobby({id: lobbyId});
        if (!res.id) logError(res);
    }

    public static async IsLobbyExists(lobbyId: string): Promise<boolean> {
        return !!(await prisma.lobby({id: lobbyId}));
    }

    public static async GetUsersIdInLobby(lobbyId: string): Promise<Array<string>> {
        return (await prisma.users({
            where: {
                lobby: await prisma.lobby({
                    id: lobbyId
                })
            }
        })).map(u => u.id);
    }

    public static async IsUserInLobby(lobbyId: string, userUniqueData: userUniqueData): Promise<boolean> {
        return (await prisma.lobbies({where: {usersInLobby_some: userUniqueData}})).length > 0;
    }

    public static async ConnectUserToLobby(lobbyId: string, user: userUniqueData): Promise<void> {
        await prisma.updateLobby({
            data: {
                usersInLobby: {
                    connect: user
                }
            },
            where: {
                id: lobbyId
            }
        });
    }

    public static async DisconnectUserFromLobby(lobbyId: string, user: userUniqueData): Promise<void> {
        await prisma.updateLobby({
            data: {
                usersInLobby: {
                    disconnect: user
                }
            },
            where: {
                id: lobbyId
            }
        });
    }
}