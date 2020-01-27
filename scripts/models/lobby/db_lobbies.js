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
const logError_1 = __importDefault(require("../../utils/consoleLogs/logError"));
const logInfo_1 = __importDefault(require("../../utils/consoleLogs/logInfo"));
const wrappedPrisma_1 = __importDefault(require("../wrappedPrisma"));
class DB_Lobbies {
    static GetLobbyData(lobbyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield wrappedPrisma_1.default.lobby({ id: lobbyId });
            if (!(res === null || res === void 0 ? void 0 : res.id))
                logError_1.default(res);
            if (!(res === null || res === void 0 ? void 0 : res.id))
                return undefined;
            return {
                name: res.name,
                id: res.id
            };
        });
    }
    static CreateNewLobby(lobby) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield wrappedPrisma_1.default.createLobby({
                id: lobby.id,
                name: lobby.name
            });
            if (!res.id)
                logError_1.default(res);
            logInfo_1.default(`New lobby: ${res.id}, ${res.name}`);
            return {
                id: res.id,
                name: res.name
            };
        });
    }
    static DeleteLobby(lobbyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield wrappedPrisma_1.default.deleteLobby({ id: lobbyId });
            if (!res.id)
                logError_1.default(res);
        });
    }
    static IsLobbyExists(lobbyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield wrappedPrisma_1.default.lobby({ id: lobbyId }));
        });
    }
    static GetUsersIdInLobby(lobbyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield wrappedPrisma_1.default.users({
                where: {
                    lobby: yield wrappedPrisma_1.default.lobby({
                        id: lobbyId
                    })
                }
            })).map(u => u.id);
        });
    }
    static IsUserInLobby(lobbyId, userUniqueData) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield wrappedPrisma_1.default.lobbies({ where: { usersInLobby_some: userUniqueData } })).length > 0;
        });
    }
    static ConnectUserToLobby(lobbyId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield wrappedPrisma_1.default.updateLobby({
                data: {
                    usersInLobby: {
                        connect: user
                    }
                },
                where: {
                    id: lobbyId
                }
            });
        });
    }
    static DisconnectUserFromLobby(lobbyId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield wrappedPrisma_1.default.updateLobby({
                data: {
                    usersInLobby: {
                        disconnect: user
                    }
                },
                where: {
                    id: lobbyId
                }
            });
        });
    }
}
exports.default = DB_Lobbies;
