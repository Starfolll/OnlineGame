import WebSocket from "ws";

import {GameTableManager} from "./gameTableManager/gameTableManager";
import {Player} from "./players/player";
import {Hero} from "./gameTableManager/heroesStacks/hero";
import {Card} from "./gameTableManager/deck/card";
import {IsMessageValid} from "./players/communicationWithPlayer/responseMessages";

import logError from "../consoleLogs/logError";
import logGameInfo from "../consoleLogs/logGameInfo";
import DB_Users from "../models/user/db_users";

export class GamesManager {
    private readonly tables: { [id: string]: GameTableManager } = {};

    constructor(gameWSS: WebSocket.Server, cb?: Function) {
        gameWSS.on("connection", (connection: WebSocket) => {
            const onMessageHandler = async (event: { data: any; type: string; target: WebSocket }) => {
                try {
                    const validMessage = IsMessageValid.GetValidPlayerInitialConnection(JSON.parse(event.data));

                    if (!validMessage) throw new Error();
                    const userData = await DB_Users.GetUserDataByNameAndToken(validMessage.name, validMessage.token);

                    if (!userData) throw new Error();
                    if (!this.IsTableExists(validMessage.tableId)) throw new Error();

                    connection.removeEventListener("message", onMessageHandler);
                    this.ConnectPlayerToTable(new Player(userData, connection));
                } catch (e) {
                    if (!!e.message) logError(e.message);
                    connection.close(1007, "invalid data model");
                }
            };

            connection.addEventListener("message", onMessageHandler);
        });
        if (!!cb) cb();
    }


    get TablesCount(): number {
        return Object.keys(this.tables).length
    }


    public CreateNewTable(
        tableId: string,
        playersId: Set<string>,
        cards: Array<Card>,
        heroes: { [heroWeight: number]: Hero }
    ): void {
        logGameInfo(`New table: ` + tableId);

        const onGameEnd = (tableId: string) => this.DropTable(tableId);

        this.tables[tableId] = new GameTableManager(
            tableId,
            playersId,
            cards,
            heroes,
            onGameEnd
        );
    }

    public IsTableExists(tableId: string): boolean {
        return !!this.tables[tableId];
    }

    public ConnectPlayerToTable(player: Player): void {
        this.tables[player.tableId].ConnectPlayer(player);
    }

    public DropTable(tableId: string): void {
        delete this.tables[tableId];
    }
}