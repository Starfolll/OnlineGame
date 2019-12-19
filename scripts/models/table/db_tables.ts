import {prisma} from "../../../generated/prisma-client";
import logGameInfo from "../../consoleLogs/logGameInfo";
import {tableData} from "./table";
import logError from "../../consoleLogs/logError";
import {userUniqueData} from "../user/user";

export default class DB_Tables {
    public static async CreateNewTable(usersId: Array<string>): Promise<tableData> {
        const res = await prisma.createTable({
            usersInGame: {
                connect: usersId.map(uId => ({
                    id: uId
                }))
            }
        });

        if (!res.id) logGameInfo(res);
        logGameInfo(`New table: ${res.id}`);

        return {
            id: res.id,
            usersId: usersId
        };
    }

    public static async DeleteTable(tableId: string): Promise<void> {
        const res = await prisma.deleteTable({id: tableId});
        if (!res.id) logError(res);
    }

    public static async GetUsersIdInTable(tableId: string): Promise<Array<string>> {
        return (await prisma.users({
            where: {
                table: await prisma.table({
                    id: tableId
                })
            }
        })).map(u => u.id);
    }

    public static async IsTableExists(tableId: string): Promise<boolean> {
        return !!(await prisma.table({id: tableId}));
    }

    public static async GetUserTableId(user: userUniqueData): Promise<string | undefined> {
        const tables = await prisma.tables({
            where: {
                usersInGame_some: user
            }
        });

        if (tables.length > 0) return tables[0].id;
        return undefined;
    }
}