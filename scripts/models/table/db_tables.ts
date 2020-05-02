import logGameInfo from "../../utils/consoleLogs/logGameInfo";
import {tableData} from "./table";
import logError from "../../utils/consoleLogs/logError";
import {userUniqueData} from "../user/user";
import wrappedPrisma from "../wrappedPrisma";

export default class DB_Tables {
    public static async CreateNewTable(usersId: Array<string>): Promise<tableData> {
        const res = await wrappedPrisma.createTable({
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
        const res = await wrappedPrisma.deleteTable({id: tableId});
        if (!res.id) logError(res);
    }

    public static async GetUsersIdInTable(tableId: string): Promise<Array<string>> {
        return (await wrappedPrisma.users({
            where: {
                table: await wrappedPrisma.table({
                    id: tableId
                })
            }
        })).map(u => u.id);
    }

    public static async IsTableExists(tableId: string): Promise<boolean> {
        return !!(await wrappedPrisma.table({id: tableId}));
    }

    public static async GetUserTableId(user: userUniqueData): Promise<string | undefined> {
        const tables = await wrappedPrisma.tables({
            where: {
                usersInGame_some: user
            }
        });

        if (tables.length > 0) return tables[0].id;
        return undefined;
    }
}