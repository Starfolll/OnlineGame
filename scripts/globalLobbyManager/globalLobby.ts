import {userUniqueData} from "../models/user/user";
import WebSocket from "ws";
import Lobby, {lobbyData} from "../models/lobby/lobby";
import LobbyUser from "./lobbyUser";
import IsLobbyMessageValid from "./communicationWithUser/globalLobby/responseGlobalLobbyMessages";
import {userGlobalLobbyResponse} from "./communicationWithUser/globalLobby/responseGlobalLobbyMessages.types";
import Room from "../models/room/room";
import logError from "../utils/consoleLogs/logError";


export default class GlobalLobby extends Lobby {
   constructor(data: lobbyData, maxSavedMessages: number) {
      super(data, maxSavedMessages);
   }

   public async ConnectUser(user: userUniqueData, connection: WebSocket): Promise<void> {
      const lobbyUser = await this.ConnectUserToLobby(user, connection);
      if (!!lobbyUser) {
         this.AttachUserOnMessageSend(lobbyUser);
         this.AttachUserOnDisconnected(lobbyUser);

         lobbyUser.InformAboutLobby(await this.GetLobbyInfo());

         this.InformUserFriendsAboutFriendConnected(lobbyUser);
      }
   }


   protected AttachUserOnMessageSend(user: LobbyUser): void {
      user.ConnectionAddEventListener(
         "lobby",
         "onMessage",
         "message",
         (event: { data: any; type: string; target: WebSocket }): void => {
            this.ReadUserResponse(user, event.data);
         }
      );
   }

   protected AttachUserOnDisconnected(user: LobbyUser): void {
      user.ConnectionAddEventListener(
         "lobby",
         "onClose",
         "close",
         (event: { wasClean: boolean; code: number; reason: string; target: WebSocket }): void => {
            this.DisconnectUserFromLobby(user.id)
               .then(r => this.InformUserFriendsAboutFriendDisconnected(user));
         }
      );
   }


   private ReadUserResponse(user: LobbyUser, message: string): void {
      try {
         const messageBody = JSON.parse(message);

         if (!messageBody["messageType"]) return;
         const messageType = messageBody["messageType"];

         console.log(messageBody);

         switch (messageType) {
            case userGlobalLobbyResponse.globalLobbyChatMessage:
               this.UserResponseChatMessage(user, messageBody);
               break;

            case userGlobalLobbyResponse.publicRoomSearch:
               this.UserResponsePublicRoomSearch(user, messageBody);
               break;

            case userGlobalLobbyResponse.createNewPrivateRoom:
               this.UserResponseCreateNewPrivateRoom(user, messageBody);
               break;

            case userGlobalLobbyResponse.connectToPrivateRoom:
               this.UserResponseConnectToPrivateRoom(user, messageBody);
               break;

            case userGlobalLobbyResponse.sendInviteToRoom:
               this.UserResponseSendInviteToRoom(user, messageBody);
         }

      } catch (e) {
         logError(e);
      }
   }

   private UserResponseChatMessage(user: LobbyUser, messageBody: any): void {
      const validMessage = IsLobbyMessageValid.GetValidChatMessage(messageBody);
      if (!validMessage) return;

      this.AddNewChatMessage(
         validMessage.message,
         user.GetUserPublicData()
      );
   }

   private UserResponsePublicRoomSearch(user: LobbyUser, messageBody: any): void {
      const validMessage = IsLobbyMessageValid.GetValidPublicRoomSearch(messageBody);
      if (!validMessage) return;

      this.ConnectUserToPublicRoom(user).then(r => r)
         .catch(err => logError(err));
   }

   private UserResponseCreateNewPrivateRoom(user: LobbyUser, messageBody: any): void {
      const validMessage = IsLobbyMessageValid.GetValidCreateNewPrivateRoom(messageBody);
      if (!validMessage) return;

      this.CreateNewPrivateRoom(user)
         .then((room: Room | undefined) => {
            console.log(room?.GetRoomData());
            if (!!room) user.InformAboutPrivateRoomCreated(room.GetExtendedRoomData());
         })
         .catch(err => logError(err));
   }

   private UserResponseConnectToPrivateRoom(user: LobbyUser, messageBody: any): void {
      const validMessage = IsLobbyMessageValid.GetValidConnectToPrivateRoom(messageBody);
      console.log(validMessage);
      if (!validMessage) return;

      this.ConnectUserToPrivateRoom(user, validMessage.roomId)
         .catch(err => logError(err));
   }

   private UserResponseSendInviteToRoom(user: LobbyUser, messageBody: any): void {
      const validMessage = IsLobbyMessageValid.GetValidSendInviteToRoom(messageBody);
      if (!validMessage) return;

      this.SendUserLobbyInviteInfo(user, validMessage.userId, validMessage.roomId).then(r => r);
   }
}
