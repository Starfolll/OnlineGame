import {chatMessageInfo, extendedLobbyData} from "../../../../store/actions/globalLobby/globalLobby.actions.types";
import {extendedRoomData} from "../../../../store/actions/roomChat/room.actions.types";

export type redirectToGameTable = {
   messageType: "redirectToGameTable",
   tableId: string
}

export type redirectToRoom = {
   messageType: "redirectToRoom",
   room: extendedRoomData
}

export type lobbyInfo = {
   messageType: "lobbyInfo",
   lobbyData: extendedLobbyData,
}

export type globalLobbyChatMessage = {
   messageType: "globalLobbyChatMessage",
   message: chatMessageInfo
}
