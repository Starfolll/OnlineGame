"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameTableManager_1 = require("./gameTableManager/gameTableManager");
const player_1 = require("./player/player");
const responseMessages_1 = require("./player/communicationWithPlayer/responseMessages");
const logError_1 = __importDefault(require("../consoleLoger/logError"));
const logGameInfo_1 = __importDefault(require("../consoleLoger/logGameInfo"));
class GamesManager {
    constructor(gameWSS, cb) {
        this.tables = {};
        gameWSS.on("connection", (connection) => {
            const onMessageHandler = (event) => {
                try {
                    const messageBody = responseMessages_1.IsMessageValid.GetValidPlayerInitialConnection(JSON.parse(event.data));
                    if (messageBody === undefined)
                        throw new Error();
                    if (!this.IsTableExists(messageBody.tableId))
                        throw new Error();
                    connection.removeEventListener("message", onMessageHandler);
                    this.ConnectPlayerToTable(new player_1.Player(messageBody.id, messageBody.name, messageBody.token, messageBody.tableId, connection));
                }
                catch (e) {
                    if (!!e.message)
                        logError_1.default(e.message);
                    connection.close(1007, "invalid data");
                }
            };
            connection.addEventListener("message", onMessageHandler);
        });
        if (!!cb)
            cb();
    }
    get TablesCount() {
        return Object.keys(this.tables).length;
    }
    CreateNewTable(tableId, playersId, cards, heroes) {
        logGameInfo_1.default(`New table :` +
            ` [id : ${tableId}]` +
            ` [playersId : ${Array.from(playersId).join(", ")}]`);
        const onGameEnd = (tableId) => this.DropTable(tableId);
        this.tables[tableId] = new gameTableManager_1.GameTableManager(tableId, playersId, cards, heroes, onGameEnd);
    }
    IsTableExists(tableId) {
        return !!this.tables[tableId];
    }
    ConnectPlayerToTable(player) {
        this.tables[player.tableId].ConnectPlayer(player);
    }
    DropTable(tableId) {
        delete this.tables[tableId];
    }
}
exports.GamesManager = GamesManager;
