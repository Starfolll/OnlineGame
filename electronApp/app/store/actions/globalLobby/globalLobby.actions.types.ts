import {lobbyActions} from "../../../scripts/lobbyWs/communicationWithLobby/globalLobby/responeGlobalLobbyActions";
import {userPublicData} from "../account/account.actions.types";
import {extendedRoomData} from "../room/room.actions.types";


const SERVER_MESSAGE_LOBBY_INFO = "lobbyInfo";
const SERVER_MESSAGE_GLOBAL_LOBBY_CHAT_MESSAGE = "globalLobbyChatMessage";
const SERVER_MESSAGE_PRIVATE_ROOM_CREATED = "privateRoomCreated";
const SERVER_MESSAGE_REDIRECTED_TO_ROOM = "redirectToRoom";
const SERVER_MESSAGE_USER_REMOVED_FROM_ROOM = "userRemovedFromRoom";
const SERVER_MESSAGE_USER_CONNECTED_TO_ROOM = "userConnectedToRoom";
const SERVER_MESSAGE_FRIEND_CONNECTED_TO_GAME = "friendsConnectedToGame";
const SERVER_MESSAGE_FRIEND_CONNECTED_TO_LOBBY = "friendConnectedToLobby";
const SERVER_MESSAGE_FRIEND_DISCONNECTED_FROM_LOBBY = "friendDisconnectedFromLobby";
const SERVER_MESSAGE_INVITE_TO_ROOM = "inviteToRoom";
const SERVER_MESSAGE_GAME_START = "gameStart";
const SERVER_MESSAGE_REDIRECTED_TO_GAME_TABLE = "redirectToGameTable";


export interface ServerMessageLobbyInfo {
   messageType: typeof SERVER_MESSAGE_LOBBY_INFO;
   lobbyData: extendedLobbyData;
}

export interface ServerMessageGlobalLobbyChatMessage {
   messageType: typeof SERVER_MESSAGE_GLOBAL_LOBBY_CHAT_MESSAGE;
   message: chatMessageInfo
}

export interface ServerMessagePrivateRoomCreated {
   messageType: typeof SERVER_MESSAGE_PRIVATE_ROOM_CREATED;
   roomData: extendedRoomData;
}

export interface ServerMessageRedirectToRoom {
   messageType: typeof SERVER_MESSAGE_REDIRECTED_TO_ROOM;
   roomData: extendedRoomData;
}

export interface ServerMessageUserRemovedFromRoom {
   messageType: typeof SERVER_MESSAGE_USER_REMOVED_FROM_ROOM;
   userId: string;
}

export interface ServerMessageUserConnectedToRoom {
   messageType: typeof SERVER_MESSAGE_USER_CONNECTED_TO_ROOM;
   user: userPublicData;
}

export interface ServerMessageFriendsConnectedToGame {
   messageType: typeof SERVER_MESSAGE_FRIEND_CONNECTED_TO_GAME;
   friendsId: Array<string>;
}

export interface ServerMessageFriendConnectedToLobby {
   messageType: typeof SERVER_MESSAGE_FRIEND_CONNECTED_TO_LOBBY;
   friendId: string;
}

export interface ServerMessageFriendDisconnectedFromLobby {
   messageType: typeof SERVER_MESSAGE_FRIEND_DISCONNECTED_FROM_LOBBY;
   friendId: string;
}

export interface ServerMessageInviteToRoom {
   messageType: typeof SERVER_MESSAGE_INVITE_TO_ROOM;
   roomId: string;
   userId: string;
}

export interface ServerMessageGameStart {
   messageType: typeof SERVER_MESSAGE_GAME_START;
   tableId: string;
}

export interface ServerMessageRedirectToGameTable {
   messageType: typeof SERVER_MESSAGE_REDIRECTED_TO_GAME_TABLE;
   tableId: string;
}

export type globalLobbyMessagesResponse =
   ServerMessageLobbyInfo |
   ServerMessageGlobalLobbyChatMessage |
   ServerMessagePrivateRoomCreated |
   ServerMessageRedirectToRoom |
   ServerMessageUserRemovedFromRoom |
   ServerMessageUserConnectedToRoom |
   ServerMessageFriendsConnectedToGame |
   ServerMessageFriendConnectedToLobby |
   ServerMessageFriendDisconnectedFromLobby |
   ServerMessageInviteToRoom |
   ServerMessageGameStart |
   ServerMessageRedirectToGameTable;


export type chatMessageInfo = {
   user: userPublicData;
   date: number;
   message: string;
   isServerMessage: boolean;
}

export type lobbyDataWithActions = {
   lobbyData: extendedLobbyData,
   lobbyActions: lobbyActions
}

export type extendedLobbyData = {
   lobbyData: lobbyData,
   chat: Array<chatMessageInfo>,
}

export type lobbyData = {
   id: string;
   name?: string;
}


const DECLARE_GLOBAL_LOBBY = "DECLARE_GLOBAL_LOBBY";
const ADD_CHAT_MESSAGE = "ADD_CHAT_MESSAGE";
const DELETE_GLOBAL_LOBBY_DATA = "DELETE_GLOBAL_LOBBY_DATA";

export interface DeclareGlobalLobby {
   type: typeof DECLARE_GLOBAL_LOBBY;
   lobbyData: lobbyDataWithActions;
}

export interface AddChatMessage {
   type: typeof ADD_CHAT_MESSAGE;
   message: chatMessageInfo;
}

export interface DeleteGlobalLobbyData {
   type: typeof DELETE_GLOBAL_LOBBY_DATA;
}

export type globalLobbyActionsTypes =
   DeclareGlobalLobby |
   AddChatMessage |
   DeleteGlobalLobbyData;
