import WebSocket from "ws";

import User, {userData, userPublicData} from "../models/user/user";
import GetGlobalLobbyMessage from "./communicationWithUser/globalLobby/informGlobalLobbyMessages";
import {extendedLobbyData} from "../models/lobby/lobby";
import {chatMessageInfo} from "../utils/chat/chatMessage";
import {extendedRoomData} from "../models/room/room";
import GetRoomMessage from "./communicationWithUser/room/informRoomMessages";
import GlobalLobbyManager from "./globalLobbyManager";
import user from "../models/user/user";


export default class LobbyUser extends User {
   private readonly connection: WebSocket;

   private readonly eventListeners: { [eventClass: string]: { [eventName: string]: { method: string, eventFunction: () => void } } } = {};

   constructor(data: userData, connection: WebSocket) {
      super(data);

      this.connection = connection;
   }


   private GetClassEventsName(eventClass: string): Array<string> {
      return Object.keys(this.eventListeners[eventClass]);
   }

   private GetClassesName(): Array<string> {
      return Object.keys(this.eventListeners);
   }


   // invent listeners
   public ConnectionAddEventListener(eventClass: string, eventName: string, method: "message" | "close", event: any): void {
      if (!this.eventListeners[eventClass]) this.eventListeners[eventClass] = {};
      this.connection.addEventListener(method, event);
      this.eventListeners[eventClass][eventName] = {
         method: method,
         eventFunction: event
      }
   }

   public ConnectionRemoveEventListener(eventClass: string, eventName: string): void {
      const listener = this.eventListeners[eventClass][eventName];
      this.connection.removeEventListener(listener.method, listener.eventFunction);

      delete this.eventListeners[eventClass][eventName];
   }

   public ConnectionClearClassListeners(eventClass: string): void {
      this.GetClassEventsName(eventClass).forEach(eName => {
         this.ConnectionRemoveEventListener(eventClass, eName);
      });
      delete this.eventListeners[eventClass];
   }

   public ConnectionRemoveAllListeners(): void {
      this.GetClassesName().forEach(cName => {
         this.ConnectionClearClassListeners(cName);
      })
   }

   public CloseConnection(code: number, message: string): void {
      this.connection.close(code, message);
   }


   // informatory
   // lobby
   public InformAboutLobby(lobbyData: extendedLobbyData): void {
      this.connection.send(JSON.stringify(GetGlobalLobbyMessage.LobbyInfo(lobbyData)));
   }

   public InformAboutGlobalLobbyChatMessage(message: chatMessageInfo): void {
      this.connection.send(JSON.stringify(GetGlobalLobbyMessage.GlobalLobbyChatMessage(message)));
   }

   public InformAboutConnectedToRoom(message: extendedRoomData): void {
      this.connection.send(JSON.stringify(GetGlobalLobbyMessage.RedirectToRoom(message)));
   }

   public InformAboutFriendConnectedToLobby(friendId: string): void {
      this.connection.send(JSON.stringify(GetGlobalLobbyMessage.FriendConnectedToLobby(friendId)));
   }

   public InformAboutFriendDisconnectedFormLobby(friendId: string): void {
      this.connection.send(JSON.stringify(GetGlobalLobbyMessage.FriendDisconnectedFromLobby(friendId)));
   }

   public InformAboutFriendsConnectedToGame(friendsId: Array<string>): void {
      this.connection.send(JSON.stringify(GetGlobalLobbyMessage.FriendsConnectedToGame(friendsId)));
   }

   public InformAboutInviteToRoom(userId: string, roomId: string): void {
      this.connection.send(JSON.stringify(GetGlobalLobbyMessage.InviteToRoom(userId, roomId)))
   }


   // room
   public InformAboutRoomChatMessage(message: chatMessageInfo): void {
      this.connection.send(JSON.stringify(GetRoomMessage.RoomChatMessage(message)));
   }

   public InformAboutRoomUserConnected(user: userPublicData): void {
      this.connection.send(JSON.stringify(GetRoomMessage.UserConnected(user)));
   }

   public InformAboutRoomUserRemoved(userId: string): void {
      this.connection.send(JSON.stringify(GetRoomMessage.UserRemoved(userId)));
   }

   public InformAboutGameStart(tableId: string): void {
      this.connection.send(JSON.stringify(GetRoomMessage.GameStart(tableId)))
   }

   public InformAboutPrivateRoomCreated(roomData: extendedRoomData): void {
      this.connection.send(JSON.stringify(GetRoomMessage.PrivateRoomCreated(roomData)));
   }

   public InformAboutNewRoomCreator(creatorId: string): void {
      this.connection.send(JSON.stringify(GetRoomMessage.NewRoomCreator(creatorId)));
   }
}
