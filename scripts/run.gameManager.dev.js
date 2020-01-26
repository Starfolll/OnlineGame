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
const ws_1 = __importDefault(require("ws"));
const express_1 = __importDefault(require("express"));
const logInfo_1 = __importDefault(require("./utils/consoleLogs/logInfo"));
const gamesManager_1 = require("./gamesManager/gamesManager");
const wrappedPrisma_1 = __importDefault(require("./models/wrappedPrisma"));
const gamesManager_api_1 = __importDefault(require("./api/gamesManager/gamesManager.api"));
class GameManagerServerDev extends gamesManager_api_1.default {
    constructor() {
        super();
        (() => __awaiter(this, void 0, void 0, function* () {
            logInfo_1.default("Mode: GAME MANAGER");
            logInfo_1.default(`Server version: ${process.env.npm_package_version}`);
            yield wrappedPrisma_1.default.deleteManyTables();
            this.privateApiPort = +process.env.PRIVATE_GAME_API_PORT;
            this.publicGameWSPort = +process.env.PUBLIC_GAME_WS_PORT;
            this.privateApiApp = express_1.default();
            this.gamesManager = new gamesManager_1.GamesManager(new ws_1.default.Server({
                port: this.publicGameWSPort
            }));
            this.privateApiApp.use(express_1.default.json());
            this.AppBindPostCreateNewGameTable("/api/create-new-game-table", this.privateApiApp, this.gamesManager);
            this.privateApiApp.listen(this.privateApiPort);
            logInfo_1.default(`Games manager API listening at port ${this.privateApiPort}`);
            logInfo_1.default(`Games manager WS listening at port ${this.publicGameWSPort}`);
        }))();
    }
}
exports.default = GameManagerServerDev;
