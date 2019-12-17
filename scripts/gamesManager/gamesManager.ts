import WebSocket from "ws";

import {GameTableManager} from "./gameTableManager/gameTableManager";
import {Player} from "./players/player";
import {Hero} from "./gameTableManager/heroesStacks/hero";
import {Card} from "./gameTableManager/deck/card";
import {IsMessageValid} from "./players/communicationWithPlayer/responseMessages";
import {playerInitialConnection} from "./players/communicationWithPlayer/responseMessagesTypes";

import logError from "../consoleLogs/logError";
import logGameInfo from "../consoleLogs/logGameInfo";

export class GamesManager {
    private readonly tables: { [id: number]: GameTableManager } = {};

    constructor(gameWSS: WebSocket.Server, cb?: Function) {
        gameWSS.on("connection", (connection: WebSocket) => {
            const onMessageHandler = (event: { data: any; type: string; target: WebSocket }): void => {
                try {
                    const messageBody: playerInitialConnection | undefined =
                        IsMessageValid.GetValidPlayerInitialConnection(JSON.parse(event.data));

                    if (messageBody === undefined) throw new Error();
                    if (!this.IsTableExists(messageBody.tableId)) throw new Error();

                    connection.removeEventListener("message", onMessageHandler);
                    this.ConnectPlayerToTable(new Player(
                        messageBody.id,
                        messageBody.name,
                        messageBody.token,
                        messageBody.tableId,
                        connection
                    ));
                } catch (e) {
                    if (!!e.message) logError(e.message);
                    connection.close(1007, "invalid data");
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
        tableId: number,
        playersId: Set<number>,
        cards: Array<Card>,
        heroes: { [heroWeight: number]: Hero }
    ): void {
        logGameInfo(`New table: ` + tableId);

        const onGameEnd = (tableId: number) => this.DropTable(tableId);

        this.tables[tableId] = new GameTableManager(
            tableId,
            playersId,
            cards,
            heroes,
            onGameEnd
        );
    }

    public IsTableExists(tableId: number): boolean {
        return !!this.tables[tableId];
    }

    public ConnectPlayerToTable(player: Player): void {
        this.tables[player.tableId].ConnectPlayer(player);
    }

    public DropTable(tableId: number): void {
        delete this.tables[tableId];
    }
}