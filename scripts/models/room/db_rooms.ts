import {prisma} from "../../../generated/prisma-client";
import {userUniqueData} from "../user/user";
import logError from "../../consoleLogs/logError";
import logInfo from "../../consoleLogs/logInfo";
import {roomData} from "./room";

export default class DB_Rooms {
    public static async CreateNewRoom(room: {
        lobbyId: string,
        id?: string,
        isPublic?: false,
        usersIdInRoom: Array<string>
    }): Promise<roomData> {
        const res = await prisma.createRoom({
            id: room.id,
            isPublic: room.isPublic || false,
            lobby: {
                connect: {
                    id: room.lobbyId
                }
            },
            usersInRoom: {
                connect: room.usersIdInRoom.map(uId => ({id: uId}))
            }
        });

        if (!res.id) logError(res);
        logInfo(`New room: ${res.id}, ${res.isPublic ? "public" : "private"}`);

        return {
            id: res.id,
            isPublic: res.isPublic,
            usersIdInRoom: room.usersIdInRoom
        }
    }

    public static async IsRoomExists(roomId: string): Promise<boolean> {
        return !!(await prisma.lobby({id: roomId}));
    }

    public static async ConnectUserToRoom(roomId: string, user: userUniqueData): Promise<void> {
        await prisma.updateRoom({
            data: {
                usersInRoom: {
                    connect: user
                }
            },
            where: {
                id: roomId
            }
        });
    }

    public static async DisconnectUserFromRoom(roomId: string, user: userUniqueData): Promise<void> {
        await prisma.updateRoom({
            data: {
                usersInRoom: {
                    disconnect: user
                }
            },
            where: {
                id: roomId
            }
        });
    }

    public static async GetUserRoomId(user: userUniqueData): Promise<string | undefined> {
        const tables = await prisma.rooms({
            where: {
                usersInRoom_some: user
            }
        });

        if (tables.length > 0) return tables[0].id;
        return undefined;
    }
}