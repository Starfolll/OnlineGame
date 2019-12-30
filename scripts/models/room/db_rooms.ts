import {userUniqueData} from "../user/user";
import logError from "../../utils/consoleLogs/logError";
import logInfo from "../../utils/consoleLogs/logInfo";
import {roomData} from "./room";
import DB_Users from "../user/db_users";
import dockerPrisma from "../dockerPrisma";

export default class DB_Rooms {
    public static async CreateNewRoom(room: {
        lobbyId: string,
        id?: string,
        isPublic?: boolean,
        maxUsersInRoom: number
        creator?: userUniqueData
    }): Promise<roomData> {
        const res = await dockerPrisma.createRoom({
            id: room.id,
            isPublic: room.isPublic || false,
            creator: {
                connect: room.creator
            },
            lobby: {
                connect: {
                    id: room.lobbyId
                }
            },
            usersInRoom: {
                connect: room.creator || []
            }
        });

        if (!res.id) logError(res);
        logInfo(`New room: ${res.id}, ${res.isPublic ? "public" : "private"}`);

        return {
            id: res.id,
            isPublic: res.isPublic,
            maxUsersInRoom: room.maxUsersInRoom,
            creator: !!room.creator ? (await DB_Users.GetUserData(room.creator))! : undefined
        }
    }

    public static async DeleteRoom(roomId: string): Promise<void> {
        await dockerPrisma.deleteRoom({id: roomId});
    }

    public static async IsRoomExists(roomId: string): Promise<boolean> {
        return !!(await dockerPrisma.room({id: roomId}));
    }

    public static async IsRoomPublic(roomId: string): Promise<boolean> {
        return ((await dockerPrisma.room({id: roomId}))!).isPublic;
    }

    public static async ConnectUserToRoom(roomId: string, user: userUniqueData): Promise<void> {
        await dockerPrisma.updateRoom({
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
        await dockerPrisma.updateRoom({
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
        const tables = await dockerPrisma.rooms({
            where: {
                usersInRoom_some: user
            }
        });

        if (tables.length > 0) return tables[0].id;
        return undefined;
    }
}