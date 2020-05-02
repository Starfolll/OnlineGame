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
const db_users_1 = __importDefault(require("../models/user/db_users"));
const db_tables_1 = __importDefault(require("../models/table/db_tables"));
const logError_1 = __importDefault(require("../utils/consoleLogs/logError"));
const responseGlobalLobbyMessages_1 = __importDefault(require("./communicationWithUser/globalLobby/responseGlobalLobbyMessages"));
const informGlobalLobbyMessages_1 = __importDefault(require("./communicationWithUser/globalLobby/informGlobalLobbyMessages"));
const db_lobbies_1 = __importDefault(require("../models/lobby/db_lobbies"));
class GlobalLobbyManager {
    constructor(gameWSS, globalLobby, cb) {
        this.globalLobby = globalLobby;
        gameWSS.on("connection", (connection) => {
            const onMessageHandler = (event) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const validMessage = responseGlobalLobbyMessages_1.default.GetValidUserInitialConnection(JSON.parse(event.data));
                    if (!validMessage)
                        throw new Error();
                    const userData = yield db_users_1.default.GetUserDataByIdAndToken(validMessage.id, validMessage.token);
                    if (!userData || !userData.isVerified)
                        throw new Error();
                    const lobbyId = yield db_lobbies_1.default.IsUserInLobby(this.globalLobby.id, { id: userData.id });
                    if (lobbyId) {
                        connection.close(1007, "clone");
                        return;
                    }
                    const tableId = yield db_tables_1.default.GetUserTableId({ id: userData.id });
                    if (!!tableId) {
                        connection.send(JSON.stringify(informGlobalLobbyMessages_1.default.RedirectToGameTable(tableId)));
                        throw new Error();
                    }
                    connection.removeEventListener("message", onMessageHandler);
                    yield this.globalLobby.ConnectUser({ id: userData.id }, connection);
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
}
exports.default = GlobalLobbyManager;
