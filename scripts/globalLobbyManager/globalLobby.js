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
const lobby_1 = __importDefault(require("../models/lobby/lobby"));
const responseGlobalLobbyMessages_1 = __importDefault(require("./communicationWithUser/globalLobby/responseGlobalLobbyMessages"));
const responseGlobalLobbyMessages_types_1 = require("./communicationWithUser/globalLobby/responseGlobalLobbyMessages.types");
const logError_1 = __importDefault(require("../utils/consoleLogs/logError"));
class GlobalLobby extends lobby_1.default {
    constructor(data, maxSavedMessages) {
        super(data, maxSavedMessages);
    }
    ConnectUser(user, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const lobbyUser = yield this.ConnectUserToLobby(user, connection);
            if (!!lobbyUser) {
                this.AttachUserOnMessageSend(lobbyUser);
                this.AttachUserOnDisconnected(lobbyUser);
                lobbyUser.InformAboutLobby(yield this.GetLobbyInfo());
                this.InformUserFriendsAboutFriendConnected(lobbyUser);
            }
        });
    }
    AttachUserOnMessageSend(user) {
        user.ConnectionAddEventListener("lobby", "onMessage", "message", (event) => {
            this.ReadUserResponse(user, event.data);
        });
    }
    AttachUserOnDisconnected(user) {
        user.ConnectionAddEventListener("lobby", "onClose", "close", (event) => {
            this.DisconnectUserFromLobby(user.id)
                .then(r => this.InformUserFriendsAboutFriendDisconnected(user));
        });
    }
    ReadUserResponse(user, message) {
        try {
            const messageBody = JSON.parse(message);
            if (!messageBody["messageType"])
                return;
            const messageType = messageBody["messageType"];
            console.log(messageBody);
            switch (messageType) {
                case responseGlobalLobbyMessages_types_1.userGlobalLobbyResponse.globalLobbyChatMessage:
                    this.UserResponseChatMessage(user, messageBody);
                    break;
                case responseGlobalLobbyMessages_types_1.userGlobalLobbyResponse.publicRoomSearch:
                    this.UserResponsePublicRoomSearch(user, messageBody);
                    break;
                case responseGlobalLobbyMessages_types_1.userGlobalLobbyResponse.createNewPrivateRoom:
                    this.UserResponseCreateNewPrivateRoom(user, messageBody);
                    break;
                case responseGlobalLobbyMessages_types_1.userGlobalLobbyResponse.connectToPrivateRoom:
                    this.UserResponseConnectToPrivateRoom(user, messageBody);
                    break;
                case responseGlobalLobbyMessages_types_1.userGlobalLobbyResponse.sendInviteToRoom:
                    this.UserResponseSendInviteToRoom(user, messageBody);
            }
        }
        catch (e) {
            logError_1.default(e);
        }
    }
    UserResponseChatMessage(user, messageBody) {
        const validMessage = responseGlobalLobbyMessages_1.default.GetValidChatMessage(messageBody);
        if (!validMessage)
            return;
        this.AddNewChatMessage(validMessage.message, user.GetUserPublicData());
    }
    UserResponsePublicRoomSearch(user, messageBody) {
        const validMessage = responseGlobalLobbyMessages_1.default.GetValidPublicRoomSearch(messageBody);
        if (!validMessage)
            return;
        this.ConnectUserToPublicRoom(user).then(r => r)
            .catch(err => logError_1.default(err));
    }
    UserResponseCreateNewPrivateRoom(user, messageBody) {
        const validMessage = responseGlobalLobbyMessages_1.default.GetValidCreateNewPrivateRoom(messageBody);
        if (!validMessage)
            return;
        this.CreateNewPrivateRoom(user)
            .then((room) => {
            var _a;
            console.log((_a = room) === null || _a === void 0 ? void 0 : _a.GetRoomData());
            if (!!room)
                user.InformAboutPrivateRoomCreated(room.GetExtendedRoomData());
        })
            .catch(err => logError_1.default(err));
    }
    UserResponseConnectToPrivateRoom(user, messageBody) {
        const validMessage = responseGlobalLobbyMessages_1.default.GetValidConnectToPrivateRoom(messageBody);
        console.log(validMessage);
        if (!validMessage)
            return;
        this.ConnectUserToPrivateRoom(user, validMessage.roomId)
            .catch(err => logError_1.default(err));
    }
    UserResponseSendInviteToRoom(user, messageBody) {
        const validMessage = responseGlobalLobbyMessages_1.default.GetValidSendInviteToRoom(messageBody);
        if (!validMessage)
            return;
        this.SendUserLobbyInviteInfo(user, validMessage.userId, validMessage.roomId).then(r => r);
    }
}
exports.default = GlobalLobby;
