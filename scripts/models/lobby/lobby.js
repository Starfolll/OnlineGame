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
const db_lobbies_1 = __importDefault(require("./db_lobbies"));
const lobbyUser_1 = __importDefault(require("../../globalLobbyManager/lobbyUser"));
const chat_1 = __importDefault(require("../../utils/chat/chat"));
const chatMessage_1 = __importDefault(require("../../utils/chat/chatMessage"));
const room_1 = __importDefault(require("../room/room"));
const db_rooms_1 = __importDefault(require("../room/db_rooms"));
const db_users_1 = __importDefault(require("../user/db_users"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Lobby {
    constructor(data, maxSavedMessages) {
        this.usersInLobby = {};
        this.publicRooms = {};
        this.privateRooms = {};
        this.maxUsersInPublicRoom = +process.env.PUBLIC_GLOBAL_LOBBY_MAX_USERS_IN_PUBLIC_ROOM;
        this.maxUsersInPrivateRoom = +process.env.PUBLIC_GLOBAL_LOBBY_MAX_USERS_IN_PRIVATE_ROOM;
        this.id = data.id;
        this.name = data.name;
        this.chat = new chat_1.default(maxSavedMessages);
        this.chat.AddMessage(new chatMessage_1.default({
            id: "server",
            publicName: "SERVER",
            lvl: Infinity
        }, `Global lobby [ ${data.name} ]`, true));
    }
    get lobbyData() {
        return {
            id: this.id,
            name: this.name
        };
    }
    AddNewChatMessage(message, user) {
        const chatMessage = new chatMessage_1.default(user, message);
        this.chat.AddMessage(chatMessage);
        this.InformUsersAboutGlobalLobbyChatMassage(chatMessage.GetMessageInfo());
    }
    GetUserInLobbyInfo(userUniqueData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_users_1.default.GetUserData(userUniqueData);
        });
    }
    GetUsersIdInLobby() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_lobbies_1.default.GetUsersIdInLobby(this.id);
        });
    }
    ConnectUserToLobby(userUniqueData, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_lobbies_1.default.ConnectUserToLobby(this.id, userUniqueData);
            const userData = yield this.GetUserInLobbyInfo(userUniqueData);
            if (!!userData) {
                const lobbyUser = new lobbyUser_1.default(userData, connection);
                this.usersInLobby[lobbyUser.id] = (lobbyUser);
                return lobbyUser;
            }
            return null;
        });
    }
    DisconnectUserFromLobby(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_lobbies_1.default.DisconnectUserFromLobby(this.id, { id: userId });
            delete this.usersInLobby[userId];
        });
    }
    GetRoomData(roomId, isRoomPublic) {
        if (isRoomPublic) {
            if (!!this.publicRooms[roomId])
                return this.publicRooms[roomId].GetExtendedRoomData();
            else
                return undefined;
        }
        else {
            if (!!this.privateRooms[roomId])
                return this.privateRooms[roomId].GetExtendedRoomData();
            else
                return undefined;
        }
    }
    DeleteRoom(isRoomPublic, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_rooms_1.default.DeleteRoom(roomId);
            if (isRoomPublic)
                delete this.publicRooms[roomId];
            else
                delete this.privateRooms[roomId];
        });
    }
    ConnectUserToPublicRoom(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const freeRoomId = yield this.GetFreePublicRoomId();
            if (!(yield this.IsUserAlreadyInRoom(user))) {
                if (!freeRoomId) {
                    const newRoomId = yield this.CreateNewPublicRoom();
                    this.publicRooms[newRoomId].ConnectUserToRoom(user);
                }
                else {
                    this.publicRooms[freeRoomId].ConnectUserToRoom(user);
                }
            }
        });
    }
    GetFreePublicRoomId() {
        return __awaiter(this, void 0, void 0, function* () {
            let freeRoomId = undefined;
            const roomsId = Object.keys(this.publicRooms);
            while (typeof freeRoomId === "undefined" && roomsId.length > 0) {
                const roomId = roomsId.shift();
                if (!this.publicRooms[roomId].IsRoomFull())
                    freeRoomId = roomId;
            }
            return freeRoomId;
        });
    }
    CreateNewPublicRoom() {
        return __awaiter(this, void 0, void 0, function* () {
            const room = new room_1.default(this.id, yield db_rooms_1.default.CreateNewRoom({
                isPublic: true,
                lobbyId: this.id,
                maxUsersInRoom: this.maxUsersInPublicRoom,
            }), ((isRoomPublic, roomId) => this.DeleteRoom(isRoomPublic, roomId)));
            this.publicRooms[room.id] = room;
            return room.id;
        });
    }
    IsUserAlreadyInRoom(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return !!(yield db_rooms_1.default.GetUserRoomId({ id: user.id }));
        });
    }
    CreateNewPrivateRoom(userCreator) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.IsUserAlreadyInRoom(userCreator))
                return undefined;
            const room = new room_1.default(this.id, yield db_rooms_1.default.CreateNewRoom({
                lobbyId: this.id,
                creator: { id: userCreator.id },
                isPublic: false,
                maxUsersInRoom: this.maxUsersInPrivateRoom
            }), ((isRoomPublic, roomId) => this.DeleteRoom(isRoomPublic, roomId)), userCreator);
            this.privateRooms[room.id] = room;
            return room;
        });
    }
    ConnectUserToPrivateRoom(user, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!!this.privateRooms[roomId] && !(yield this.IsUserAlreadyInRoom(user))) {
                this.privateRooms[roomId].ConnectUserToRoom(user);
            }
        });
    }
    GetLobbyInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                lobbyData: this.lobbyData,
                chat: this.chat.GetMessages().map(m => m.GetMessageInfo()),
            };
        });
    }
    InformUsersAboutGlobalLobbyChatMassage(message) {
        Object.keys(this.usersInLobby).forEach(uId => this.usersInLobby[uId].InformAboutGlobalLobbyChatMessage(message));
    }
}
exports.default = Lobby;
