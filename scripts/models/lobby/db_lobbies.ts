import {prisma} from "../../../generated/prisma-client";
import {lobbyData} from "./lobby";
import logError from "../../consoleLogs/logError";
import {userData, userUniqueData} from "../user/user";
import logInfo from "../../consoleLogs/logInfo";

export default class Db_Lobbies {
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

    public static async GetUserInLobbyInfo(userUniqueData: userUniqueData): Promise<userData | null> {
        const user = await prisma.user(userUniqueData);
        if (!user) return null;
        return user as userData;
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
        })
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
        })
    }
}