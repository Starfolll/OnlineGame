"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameTableManager_1 = require("./gameTableManager/gameTableManager");
const player_1 = require("./players/player");
const responseGameMessages_1 = require("./players/communicationWithPlayer/responseGameMessages");
const logError_1 = __importDefault(require("../utils/consoleLogs/logError"));
const db_users_1 = __importDefault(require("../models/user/db_users"));
const db_tables_1 = __importDefault(require("../models/table/db_tables"));
class GamesManager {
    constructor(gameWSS, cb) {
        this.tables = {};
        this.onGameEndCallback = (tableId) => __awaiter(this, void 0, void 0, function* () {
            yield this.DropTable(tableId);
        });
        gameWSS.on("connection", (connection) => {
            const onMessageHandler = (event) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const validMessage = responseGameMessages_1.IsGameMessageValid.GetValidPlayerInitialConnection(JSON.parse(event.data));
                    if (!validMessage)
                        throw new Error();
                    const userData = yield db_users_1.default.GetUserDataByIdAndToken(validMessage.id, validMessage.token);
                    if (!userData || !userData.isVerified)
                        throw new Error();
                    if (!(yield db_tables_1.default.IsTableExists(validMessage.tableId)))
                        throw new Error();
                    connection.removeEventListener("message", onMessageHandler);
                    this.ConnectPlayerToTable(validMessage.tableId, new player_1.Player(userData, connection));
                }
                catch (e) {
                    if (!!e.message)
                        logError_1.default(e.message);
                    console.log(e);
                    connection.close(1007, "invalid data model");
                }
            });
            connection.addEventListener("message", onMessageHandler);
        });
        if (!!cb)
            cb();
    }
    CreateNewTable(table, cards, heroes) {
        return __awaiter(this, void 0, void 0, function* () {
            const tableDataUpdated = yield db_tables_1.default.CreateNewTable(table.usersId);
            this.tables[tableDataUpdated.id] = new gameTableManager_1.GameTableManager(tableDataUpdated, cards, heroes, this.onGameEndCallback);
            return {
                "id": tableDataUpdated.id,
                "usersId": table.usersId
            };
        });
    }
    ConnectPlayerToTable(tableId, player) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tables[tableId].ConnectPlayer(player);
        });
    }
    DropTable(tableId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_tables_1.default.DeleteTable(tableId);
            delete this.tables[tableId];
        });
    }
}
exports.GamesManager = GamesManager;
