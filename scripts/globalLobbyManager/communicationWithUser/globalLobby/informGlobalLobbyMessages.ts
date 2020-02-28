import {
   friendConnectedToLobby,
   friendDisconnectedFromLobby,
   friendsConnectedToGame,
   globalLobbyInfo,
   inviteToRoom,
   newLobbyChatMessage,
   redirectToGameTable,
   redirectToRoom
} from "./informGlobalLobbyMessages.types";
import {extendedLobbyData} from "../../../models/lobby/lobby";
import {chatMessageInfo} from "../../../utils/chat/chatMessage";
import {extendedRoomData} from "../../../models/room/room";

export default class GetGlobalLobbyMessage {
   public static RedirectToGameTable(tableId: string): redirectToGameTable {
      return {
         "messageType": "redirectToGameTable", tableId
      }
   }

   public static RedirectToRoom(roomData: extendedRoomData): redirectToRoom {
      return {
         "messageType": "redirectToRoom", roomData
      }
   }

   public static LobbyInfo(lobbyData: extendedLobbyData): globalLobbyInfo {
      return {
         "messageType": "lobbyInfo", lobbyData,
      }
   }

   public static GlobalLobbyChatMessage(message: chatMessageInfo): newLobbyChatMessage {
      return {
         "messageType": "globalLobbyChatMessage", message
      }
   }

   public static FriendConnectedToLobby(friendId: string): friendConnectedToLobby {
      return {
         "messageType": "friendConnectedToLobby", friendId
      }
   }

   public static FriendDisconnectedFromLobby(friendId: string): friendDisconnectedFromLobby {
      return {
         "messageType": "friendDisconnectedFromLobby", friendId
      }
   }

   public static FriendsConnectedToGame(friendsId: Array<string>): friendsConnectedToGame {
      return {
         "messageType": "friendsConnectedToGame", friendsId
      }
   }

   public static InviteToRoom(userId: string, roomId: string): inviteToRoom {
      return {
         "messageType": "inviteToRoom", userId, roomId
      }
   }
}
