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
const db_rooms_1 = __importDefault(require("./db_rooms"));
const chat_1 = __importDefault(require("../../utils/chat/chat"));
const chatMessage_1 = __importDefault(require("../../utils/chat/chatMessage"));
const responseRoomMessage_types_1 = require("../../globalLobbyManager/communicationWithUser/room/responseRoomMessage.types");
const responseRoomMessage_1 = __importDefault(require("../../globalLobbyManager/communicationWithUser/room/responseRoomMessage"));
const gamesManager_api_requests_1 = __importDefault(require("../../api/gamesManager/gamesManager.api.requests"));
const db_lobbies_1 = __importDefault(require("../lobby/db_lobbies"));
class Room {
    constructor(lobbyId, roomData, onRoomDeleteHandler, creator) {
        var _a;
        this.usersInRoom = {};
        this.id = roomData.id;
        this.isPublic = roomData.isPublic;
        this.maxUsersInRoom = roomData.maxUsersInRoom;
        this.lobbyId = lobbyId;
        this.usersInRoom = {};
        this.creatorId = (_a = creator) === null || _a === void 0 ? void 0 : _a.id;
        if (!!creator && this.creatorId) {
            this.usersInRoom[this.creatorId] = creator;
            this.AttachUserOnMessageSend(creator);
            this.AttachUserOnClose(creator);
        }
        this.onRoomDeleteHandler = onRoomDeleteHandler;
        this.chat = new chat_1.default(10);
    }
    get usersIdInRoom() {
        return Object.keys(this.usersInRoom);
    }
    IsRoomFull() {
        return Object.keys(this.usersInRoom).length >= this.maxUsersInRoom;
    }
    AttachUserOnMessageSend(user) {
        user.ConnectionAddEventListener("room", "onMessage", "message", this.GetOnMessageSentEventListener(user));
    }
    AttachUserOnClose(user) {
        user.ConnectionAddEventListener("room", "onClose", "close", this.GetOnCloseEventListener(user));
    }
    ConnectUserToRoom(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_rooms_1.default.ConnectUserToRoom(this.id, { id: user.id });
            this.usersInRoom[user.id] = user;
            this.AttachUserOnMessageSend(user);
            this.AttachUserOnClose(user);
            user.InformAboutConnectedToRoom(this.GetExtendedRoomData());
            this.InformUsersAboutUserConnected(user.GetUserPublicData());
            if (this.IsRoomFull() && this.isPublic)
                this.StartGame();
        });
    }
    RemoveUserFromRoom(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_rooms_1.default.DisconnectUserFromRoom(this.id, { id: userId });
            const user = this.usersInRoom[userId];
            user.ConnectionClearClassListeners("room");
            delete this.usersInRoom[userId];
            this.InformUsersAboutUserRemoved(userId);
            if (!this.isPublic && !!this.creatorId && userId === this.creatorId) {
                this.creatorId = this.usersIdInRoom.length > 0 ? this.usersInRoom[this.usersIdInRoom[0]].id : undefined;
                if (!!this.creatorId) {
                    console.log("asd");
                    yield db_rooms_1.default.ResetUserCreator(this.id, { id: this.creatorId });
                    this.InformUsersAboutNewCreator(this.creatorId);
                }
                else {
                    this.onRoomDeleteHandler(this.isPublic, this.id);
                }
            }
        });
    }
    StartGame() {
        return __awaiter(this, void 0, void 0, function* () {
            const tableData = (yield gamesManager_api_requests_1.default.CreateNewTable(this.usersIdInRoom));
            this.InformUsersAboutGameStart(tableData.id);
            yield this.CloseUsersConnection();
            this.onRoomDeleteHandler(this.isPublic, this.id);
        });
    }
    CloseUsersConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const usersId = this.usersInRoom;
            for (const userId in usersId) {
                yield db_lobbies_1.default.DisconnectUserFromLobby(this.lobbyId, { id: userId });
                this.usersInRoom[userId].ConnectionRemoveAllListeners();
                this.usersInRoom[userId].CloseConnection(1000, "redirect to game server");
            }
        });
    }
    GetOnMessageSentEventListener(user) {
        return (event) => {
            this.ReadUserResponse(user.id, event.data);
        };
    }
    GetOnCloseEventListener(user) {
        return (event) => {
            this.RemoveUserFromRoom(user.id).then(r => r);
        };
    }
    ReadUserResponse(userId, message) {
        try {
            const messageBody = JSON.parse(message);
            if (!messageBody["messageType"])
                return;
            const messageType = messageBody["messageType"];
            switch (messageType) {
                case responseRoomMessage_types_1.userRoomResponse.chatMessage:
                    this.UserResponseChatMessage(userId, messageBody);
                    break;
                case responseRoomMessage_types_1.userRoomResponse.removeUserFromRoom:
                    this.UserResponseRemoveUser(userId, messageBody);
                    break;
                case responseRoomMessage_types_1.userRoomResponse.startGame:
                    this.UserResponseStartGame(userId, messageBody);
                    break;
                case responseRoomMessage_types_1.userRoomResponse.leaveRoom:
                    this.UserResponseLeaveRoom(userId, messageBody);
                    break;
            }
        }
        catch (e) {
        }
    }
    UserResponseChatMessage(userId, messageBody) {
        const validMessage = responseRoomMessage_1.default.GetValidChatMessage(messageBody);
        if (!validMessage)
            return;
        const message = new chatMessage_1.default(this.usersInRoom[userId].GetUserPublicData(), validMessage.message);
        this.chat.AddMessage(message);
        this.InformUsersAboutRoomChatMessage(message.GetMessageInfo());
    }
    UserResponseRemoveUser(userId, messageBody) {
        const validMessage = responseRoomMessage_1.default.GetValidRemoveUser(messageBody);
        if (!validMessage)
            return;
        if (!this.isPublic && !!this.creatorId && userId === this.creatorId &&
            validMessage.userId !== this.creatorId &&
            this.usersIdInRoom.some(uId => uId === validMessage.userId)) {
            this.RemoveUserFromRoom(validMessage.userId).then(r => r);
        }
    }
    UserResponseStartGame(userId, messageBody) {
        const validMessage = responseRoomMessage_1.default.GetValidStartGameMessage(messageBody);
        if (!validMessage)
            return;
        if (!this.isPublic && !!this.creatorId && userId === this.creatorId && this.IsRoomFull())
            this.StartGame().then(r => r);
    }
    UserResponseLeaveRoom(userId, messageBody) {
        const validMessage = responseRoomMessage_1.default.GetValidLeaveRoom(messageBody);
        if (!validMessage)
            return;
        this.RemoveUserFromRoom(userId).then(r => r);
    }
    GetExtendedRoomData() {
        return {
            "roomData": this.GetRoomData(),
            "usersInRoom": Object.keys(this.usersInRoom).map(uId => {
                return this.usersInRoom[uId].GetUserPublicData();
            })
        };
    }
    GetRoomData() {
        return {
            "maxUsersInRoom": this.maxUsersInRoom,
            "creatorId": this.creatorId,
            "isPublic": this.isPublic,
            "id": this.id,
        };
    }
    InformUsersAboutRoomChatMessage(message) {
        this.usersIdInRoom.forEach(uId => {
            this.usersInRoom[uId].InformAboutRoomChatMessage(message);
        });
    }
    InformUsersAboutUserConnected(user) {
        this.usersIdInRoom.forEach(uId => {
            if (user.id !== uId)
                this.usersInRoom[uId].InformAboutRoomUserConnected(user);
        });
    }
    InformUsersAboutUserRemoved(userId) {
        this.usersIdInRoom.forEach(uId => {
            this.usersInRoom[uId].InformAboutRoomUserRemoved(userId);
        });
    }
    InformUsersAboutGameStart(tableId) {
        this.usersIdInRoom.forEach(uId => {
            this.usersInRoom[uId].InformAboutGameStart(tableId);
        });
    }
    InformUsersAboutNewCreator(creatorId) {
        this.usersIdInRoom.forEach(uId => {
            this.usersInRoom[uId].InformAboutNewRoomCreator(creatorId);
        });
    }
}
exports.default = Room;
