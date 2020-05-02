import {
   accountActionSetConnectedFriend,
   accountActionSetConnectedFriends,
   accountActionSetDisconnectedFriends,
   accountActionSetInviteToRoom
} from "../../../../store/actions/account/account.actions";
import {userPublicData} from "../../../../store/actions/account/account.actions.types";
import {
   globalLobbyActionsAddGlobalLobbyMessage,
   globalLobbyActionsDeclareGlobalLobby
} from "../../../../store/actions/globalLobby/globalLobby.actions";
import {chatMessageInfo, lobbyDataWithActions} from "../../../../store/actions/globalLobby/globalLobby.actions.types";
import {
   roomActionsAddUserToRoom,
   roomActionsDeclareRoom,
   roomActionsRemoveUserFromRoom
} from "../../../../store/actions/room/room.actions";
import {extendedRoomData} from "../../../../store/actions/room/room.actions.types";


export default class GlobalLobbyResponse {
   public static LobbyInfo(dispatch: Function, lobbyDataWithActions: lobbyDataWithActions): void {
      dispatch(globalLobbyActionsDeclareGlobalLobby(lobbyDataWithActions));
   }

   public static AddMessage(dispatch: Function, chatMessageInfo: chatMessageInfo): void {
      dispatch(globalLobbyActionsAddGlobalLobbyMessage(chatMessageInfo));
   }

   public static RoomInfo(dispatch: Function, roomData: extendedRoomData): void {
      dispatch(roomActionsDeclareRoom(roomData));
   }

   public static RoomAddUser(dispatch: Function, user: userPublicData): void {
      dispatch(roomActionsAddUserToRoom(user));
   }

   public static RoomRemoveUser(dispatch: Function, userId: string): void {
      dispatch(roomActionsRemoveUserFromRoom(userId));
   }

   public static FriendsConnected(dispatch: Function, friendsId: Array<string>): void {
      dispatch(accountActionSetConnectedFriends(friendsId));
   }

   public static FriendConnected(dispatch: Function, friendId: string): void {
      dispatch(accountActionSetConnectedFriend(friendId));
   }

   public static FriendDisconnected(dispatch: Function, friendId: string): void {
      dispatch(accountActionSetDisconnectedFriends(friendId));
   }

   public static InviteToRoom(dispatch: Function, roomId: string, userId: string): void {
      dispatch(accountActionSetInviteToRoom(roomId, userId));
   }

   public static DeleteLobbyData(dispatch: Function): void{
      dispatch()
   }
}
