import {extendedLobbyData} from "../../../models/lobby/lobby";
import {chatMessageInfo} from "../../../utils/chat/chatMessage";
import {extendedRoomData} from "../../../models/room/room";

export type redirectToGameTable = {
   messageType: string;
   tableId: string;
}

export type redirectToRoom = {
   messageType: string;
   roomData: extendedRoomData;
}

export type globalLobbyInfo = {
   messageType: string;
   lobbyData: extendedLobbyData;
}

export type newLobbyChatMessage = {
   messageType: string;
   message: chatMessageInfo;
}

export type friendConnectedToLobby = {
   messageType: string;
   friendId: string;
}

export type friendDisconnectedFromLobby = {
   messageType: string;
   friendId: string;
}

export type friendsConnectedToGame = {
   messageType: string;
   friendsId: Array<string>;
}

export type inviteToRoom = {
   messageType: string;
   userId: string;
   roomId: string;
}
