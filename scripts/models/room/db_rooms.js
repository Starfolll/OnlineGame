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
const db_users_1 = __importDefault(require("../user/db_users"));
const wrappedPrisma_1 = __importDefault(require("../wrappedPrisma"));
class DB_Rooms {
    static CreateNewRoom(room) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield wrappedPrisma_1.default.createRoom({
                id: room.id,
                isPublic: room.isPublic,
                creator: {
                    connect: room.creator
                },
                lobby: {
                    connect: {
                        id: room.lobbyId
                    }
                },
                usersInRoom: {
                    connect: (_a = room.creator, (_a !== null && _a !== void 0 ? _a : []))
                }
            });
            if (!res.id)
                logError_1.default(res);
            logInfo_1.default(`New room: ${res.id}, ${res.isPublic ? "public" : "private"}`);
            return {
                id: res.id,
                isPublic: res.isPublic,
                maxUsersInRoom: room.maxUsersInRoom,
                creator: !!room.creator ? (yield db_users_1.default.GetUserData(room.creator)) : undefined
            };
        });
    }
    static DeleteRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield wrappedPrisma_1.default.deleteRoom({ id: roomId });
        });
    }
    static IsRoomExists(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield wrappedPrisma_1.default.room({ id: roomId }));
        });
    }
    static IsRoomPublic(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            return ((yield wrappedPrisma_1.default.room({ id: roomId }))).isPublic;
        });
    }
    static ConnectUserToRoom(roomId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield wrappedPrisma_1.default.updateRoom({
                data: {
                    usersInRoom: {
                        connect: user
                    }
                },
                where: {
                    id: roomId
                }
            });
        });
    }
    static DisconnectUserFromRoom(roomId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield wrappedPrisma_1.default.updateRoom({
                data: {
                    usersInRoom: {
                        disconnect: user
                    }
                },
                where: {
                    id: roomId
                }
            });
        });
    }
    static ResetUserCreator(roomId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield wrappedPrisma_1.default.updateRoom({
                data: {
                    creator: {
                        connect: user
                    }
                },
                where: {
                    id: roomId
                }
            });
        });
    }
    static GetUserRoomId(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const tables = yield wrappedPrisma_1.default.rooms({
                where: {
                    usersInRoom_some: user
                }
            });
            if (tables.length > 0)
                return tables[0].id;
            return undefined;
        });
    }
}
exports.default = DB_Rooms;
