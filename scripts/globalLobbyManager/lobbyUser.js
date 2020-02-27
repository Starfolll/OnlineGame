"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user/user"));
const informGlobalLobbyMessages_1 = __importDefault(require("./communicationWithUser/globalLobby/informGlobalLobbyMessages"));
const informRoomMessages_1 = __importDefault(require("./communicationWithUser/room/informRoomMessages"));
class LobbyUser extends user_1.default {
    constructor(data, connection) {
        super(data);
        this.eventListeners = {};
        this.connection = connection;
    }
    GetClassEventsName(eventClass) {
        return Object.keys(this.eventListeners[eventClass]);
    }
    GetClassesName() {
        return Object.keys(this.eventListeners);
    }
    ConnectionAddEventListener(eventClass, eventName, method, event) {
        if (!this.eventListeners[eventClass])
            this.eventListeners[eventClass] = {};
        this.connection.addEventListener(method, event);
        this.eventListeners[eventClass][eventName] = {
            method: method,
            eventFunction: event
        };
    }
    ConnectionRemoveEventListener(eventClass, eventName) {
        const listener = this.eventListeners[eventClass][eventName];
        this.connection.removeEventListener(listener.method, listener.eventFunction);
        delete this.eventListeners[eventClass][eventName];
    }
    ConnectionClearClassListeners(eventClass) {
        this.GetClassEventsName(eventClass).forEach(eName => {
            this.ConnectionRemoveEventListener(eventClass, eName);
        });
        delete this.eventListeners[eventClass];
    }
    ConnectionRemoveAllListeners() {
        this.GetClassesName().forEach(cName => {
            this.ConnectionClearClassListeners(cName);
        });
    }
    CloseConnection(code, message) {
        this.connection.close(code, message);
    }
    InformAboutLobby(lobbyData) {
        this.connection.send(JSON.stringify(informGlobalLobbyMessages_1.default.LobbyInfo(lobbyData)));
    }
    InformAboutGlobalLobbyChatMessage(message) {
        this.connection.send(JSON.stringify(informGlobalLobbyMessages_1.default.GlobalLobbyChatMessage(message)));
    }
    InformAboutConnectedToRoom(message) {
        this.connection.send(JSON.stringify(informGlobalLobbyMessages_1.default.RedirectToRoom(message)));
    }
    InformAboutFriendConnectedToLobby(friendId) {
        this.connection.send(JSON.stringify(informGlobalLobbyMessages_1.default.FriendConnectedToLobby(friendId)));
    }
    InformAboutFriendDisconnectedFormLobby(friendId) {
        this.connection.send(JSON.stringify(informGlobalLobbyMessages_1.default.FriendDisconnectedFromLobby(friendId)));
    }
    InformAboutFriendsConnectedToGame(friendsId) {
        this.connection.send(JSON.stringify(informGlobalLobbyMessages_1.default.FriendsConnectedToGame(friendsId)));
    }
    InformAboutRoomChatMessage(message) {
        this.connection.send(JSON.stringify(informRoomMessages_1.default.RoomChatMessage(message)));
    }
    InformAboutRoomUserConnected(user) {
        this.connection.send(JSON.stringify(informRoomMessages_1.default.UserConnected(user)));
    }
    InformAboutRoomUserRemoved(userId) {
        this.connection.send(JSON.stringify(informRoomMessages_1.default.UserRemoved(userId)));
    }
    InformAboutGameStart(tableId) {
        this.connection.send(JSON.stringify(informRoomMessages_1.default.GameStart(tableId)));
    }
    InformAboutPrivateRoomCreated(roomData) {
        this.connection.send(JSON.stringify(informRoomMessages_1.default.PrivateRoomCreated(roomData)));
    }
    InformAboutNewRoomCreator(creatorId) {
        this.connection.send(JSON.stringify(informRoomMessages_1.default.NewRoomCreator(creatorId)));
    }
}
exports.default = LobbyUser;
