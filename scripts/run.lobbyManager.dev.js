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
const logInfo_1 = __importDefault(require("./utils/consoleLogs/logInfo"));
const globalLobbyManager_1 = __importDefault(require("./globalLobbyManager/globalLobbyManager"));
const ws_1 = __importDefault(require("ws"));
const globalLobby_1 = __importDefault(require("./globalLobbyManager/globalLobby"));
const db_lobbies_1 = __importDefault(require("./models/lobby/db_lobbies"));
const wrappedPrisma_1 = __importDefault(require("./models/wrappedPrisma"));
class GlobalLobbyManagerServerDev {
    constructor() {
        this.lobbyManagerWSPort = +process.env.PUBLIC_GLOBAL_LOBBY_WS_PORT;
        const r = () => __awaiter(this, void 0, void 0, function* () {
            logInfo_1.default("Mode: LOBBY MANAGER");
            logInfo_1.default(`Server version: ${process.env.npm_package_version}`);
            yield wrappedPrisma_1.default.deleteManyRooms();
            yield wrappedPrisma_1.default.deleteManyLobbies();
            this.lobbyManager = new globalLobbyManager_1.default(new ws_1.default.Server({
                port: this.lobbyManagerWSPort
            }), new globalLobby_1.default(yield db_lobbies_1.default.CreateNewLobby({ name: "global 1" }), 10));
        });
        r().then(r => r);
    }
}
exports.default = GlobalLobbyManagerServerDev;
