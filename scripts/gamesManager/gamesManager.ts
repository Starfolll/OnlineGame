import WebSocket from "ws";

import {GameTableManager} from "./gameTableManager/gameTableManager";
import {Player} from "./players/player";
import {Hero} from "./gameTableManager/heroesStacks/hero";
import {Card} from "./gameTableManager/deck/card";
import {IsGameMessageValid} from "./players/communicationWithPlayer/responseGameMessages";

import logError from "../utils/consoleLogs/logError";
import DB_Users from "../models/user/db_users";
import DB_Tables from "../models/table/db_tables";
import {tableData} from "../models/table/table";


export class GamesManager {
    private readonly tables: { [id: string]: GameTableManager } = {};


    private readonly onGameEndCallback = async (tableId: string) => {
        await this.DropTable(tableId);
    };


    constructor(gameWSS: WebSocket.Server, cb?: Function) {
        gameWSS.on("connection", (connection: WebSocket) => {
            const onMessageHandler = async (event: { data: any; type: string; target: WebSocket }) => {
                try {
                    const validMessage = IsGameMessageValid.GetValidPlayerInitialConnection(JSON.parse(event.data));

                    if (!validMessage) throw new Error();
                    const userData = await DB_Users.GetUserDataByIdAndToken(validMessage.id, validMessage.token);

                    if (!userData || !userData.isVerified) throw new Error();
                    if (!(await DB_Tables.IsTableExists(validMessage.tableId))) throw new Error();

                    connection.removeEventListener("message", onMessageHandler);
                    this.ConnectPlayerToTable(validMessage.tableId, new Player(userData, connection));
                } catch (e) {
                    if (!!e.message) logError(e.message);
                    console.log(e);
                    connection.close(1007, "invalid data model");
                }
            };

            connection.addEventListener("message", onMessageHandler);
        });
        if (!!cb) cb();
    }

    public async CreateNewTable(
        table: { usersId: Array<string> },
        cards: Array<Card>,
        heroes: { [heroWeight: number]: Hero }
    ): Promise<tableData> {
        const tableDataUpdated = await DB_Tables.CreateNewTable(table.usersId);

        this.tables[tableDataUpdated.id] = new GameTableManager(
            tableDataUpdated,
            cards,
            heroes,
            this.onGameEndCallback
        );

        return {
            "id": tableDataUpdated.id,
            "usersId": table.usersId
        }
    }

    public async ConnectPlayerToTable(tableId: string, player: Player): Promise<void> {
        this.tables[tableId].ConnectPlayer(player);
    }

    public async DropTable(tableId: string): Promise<void> {
        await DB_Tables.DeleteTable(tableId);
        delete this.tables[tableId];
    }
}