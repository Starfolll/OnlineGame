import DB_Lobbies from "./db_lobbies";
import {userData, userPublicData, userUniqueData} from "../user/user";
import WebSocket from "ws";
import LobbyUser from "../../globalLobbyManager/lobbyUser";
import lobbyUser from "../../globalLobbyManager/lobbyUser";
import Chat from "../../utils/chat/chat";
import ChatMessage, {chatMessageInfo} from "../../utils/chat/chatMessage";
import Room, {extendedRoomData} from "../room/room";
import DB_Rooms from "../room/db_rooms";
import DB_Users from "../user/db_users";
import dotenv from "dotenv";


export type extendedLobbyData = {
   lobbyData: lobbyData,
   chat: Array<chatMessageInfo>
}

export type lobbyData = {
   id: string;
   name?: string;
}

dotenv.config();
export default class Lobby {
   public readonly id: string;
   public readonly name?: string;

   private readonly usersInLobby: { [userId: string]: LobbyUser } = {};
   private readonly chat: Chat<ChatMessage>;

   private readonly publicRooms: { [id: string]: Room } = {};
   private readonly privateRooms: { [id: string]: Room } = {};

   private readonly maxUsersInPublicRoom: number = +process.env.PUBLIC_GLOBAL_LOBBY_MAX_USERS_IN_PUBLIC_ROOM!;
   private readonly maxUsersInPrivateRoom: number = +process.env.PUBLIC_GLOBAL_LOBBY_MAX_USERS_IN_PRIVATE_ROOM!;


   constructor(data: lobbyData, maxSavedMessages: number) {
      this.id = data.id;
      this.name = data.name;

      console.log(this.maxUsersInPrivateRoom);
      console.log(this.maxUsersInPublicRoom);

      this.chat = new Chat<ChatMessage>(maxSavedMessages, [
         new ChatMessage(
            {id: "server", publicName: "SERVER", lvl: Infinity},
            `Global lobby [ ${data.name} ]`,
            true
         )
      ]);
   }


   get lobbyData(): lobbyData {
      return {
         id: this.id,
         name: this.name
      }
   }


   protected AddNewChatMessage(message: string, user: userPublicData): void {
      const chatMessage = new ChatMessage(user, message);
      this.chat.AddMessage(chatMessage);
      this.InformUsersAboutGlobalLobbyChatMassage(chatMessage.GetMessageInfo());
   }


   // users connection
   protected async GetUserInLobbyInfo(userUniqueData: userUniqueData): Promise<userData | null> {
      return await DB_Users.GetUserData(userUniqueData);
   }

   protected async GetUsersIdInLobby(): Promise<Array<string>> {
      return await DB_Lobbies.GetUsersIdInLobby(this.id);
   }

   protected async ConnectUserToLobby(userUniqueData: userUniqueData, connection: WebSocket): Promise<LobbyUser | null> {
      await DB_Lobbies.ConnectUserToLobby(this.id, userUniqueData);
      const userData = await this.GetUserInLobbyInfo(userUniqueData);
      if (!!userData) {
         const lobbyUser = new LobbyUser(userData, connection);
         this.usersInLobby[lobbyUser.id] = (lobbyUser);
         return lobbyUser;
      }
      return null;
   }

   protected async DisconnectUserFromLobby(userId: string): Promise<void> {
      await DB_Lobbies.DisconnectUserFromLobby(this.id, {id: userId});
      delete this.usersInLobby[userId];
   }

   protected async InformUserFriendsAboutFriendConnected(lobbyUser: lobbyUser): Promise<void> {
      const friendsInGame: Array<string> = [];

      (await lobbyUser.GetUserFriends()).forEach(f => {
         const friend = this.usersInLobby[f.id];
         if (!friend) return;

         friendsInGame.push(f.id);
         friend.InformAboutFriendConnectedToLobby(lobbyUser.id);
      });

      lobbyUser.InformAboutFriendsConnectedToGame(friendsInGame);
   }

   protected async InformUserFriendsAboutFriendDisconnected(lobbyUser: lobbyUser): Promise<void> {
      (await lobbyUser.GetUserFriends()).forEach(f => {
         const friend = this.usersInLobby[f.id];
         if (!friend) return;

         friend.InformAboutFriendDisconnectedFormLobby(lobbyUser.id);
      })
   }


   // room
   public GetRoomData(roomId: string, isRoomPublic: boolean): extendedRoomData | undefined {
      if (isRoomPublic) {
         if (!!this.publicRooms[roomId]) return this.publicRooms[roomId].GetExtendedRoomData();
         else return undefined;
      } else {
         if (!!this.privateRooms[roomId]) return this.privateRooms[roomId].GetExtendedRoomData();
         else return undefined;
      }
   }

   private async DeleteRoom(isRoomPublic: boolean, roomId: string): Promise<void> {
      await DB_Rooms.DeleteRoom(roomId);

      if (isRoomPublic) delete this.publicRooms[roomId];
      else delete this.privateRooms[roomId];
   }


   // connect user to room (public)
   protected async ConnectUserToPublicRoom(user: LobbyUser): Promise<void> {
      const freeRoomId: string | undefined = await this.GetFreePublicRoomId();

      if (!(await this.IsUserAlreadyInRoom(user))) {
         if (!freeRoomId) {
            const newRoomId = await this.CreateNewPublicRoom();
            this.publicRooms[newRoomId].ConnectUserToRoom(user);
         } else {
            this.publicRooms[freeRoomId!].ConnectUserToRoom(user);
         }
      }
   }

   private async GetFreePublicRoomId(): Promise<string | undefined> {
      let freeRoomId: string | undefined = undefined;

      const roomsId = Object.keys(this.publicRooms);
      while (typeof freeRoomId === "undefined" && roomsId.length > 0) {
         const roomId = roomsId.shift()!;
         if (!this.publicRooms[roomId].IsRoomFull()) freeRoomId = roomId;
      }

      return freeRoomId;
   }

   private async CreateNewPublicRoom(): Promise<string> {
      const room = new Room(
         this.id,
         await DB_Rooms.CreateNewRoom({
            isPublic: true,
            lobbyId: this.id,
            maxUsersInRoom: this.maxUsersInPublicRoom,
         }),
         ((isRoomPublic: boolean, roomId: string) => this.DeleteRoom(isRoomPublic, roomId))
      );

      this.publicRooms[room.id] = room;

      return room.id;
   }


   // connect user to room (private)
   protected async IsUserAlreadyInRoom(user: LobbyUser | userUniqueData): Promise<boolean> {
      return !!(await DB_Rooms.GetUserRoomId({id: user.id}))
   }

   protected async CreateNewPrivateRoom(userCreator: LobbyUser): Promise<Room | undefined> {
      if (await this.IsUserAlreadyInRoom(userCreator)) return undefined;

      const room = new Room(
         this.id,
         await DB_Rooms.CreateNewRoom({
            lobbyId: this.id,
            creator: {id: userCreator.id} as userUniqueData,
            isPublic: false,
            maxUsersInRoom: this.maxUsersInPrivateRoom
         }),
         ((isRoomPublic: boolean, roomId: string) => this.DeleteRoom(isRoomPublic, roomId)),
         userCreator
      );

      this.privateRooms[room.id] = room;

      return room;
   }

   protected async ConnectUserToPrivateRoom(user: LobbyUser, roomId: string): Promise<void> {
      if (!!this.privateRooms[roomId] && !(await this.IsUserAlreadyInRoom(user))) {
         console.log(roomId);
         this.privateRooms[roomId].ConnectUserToRoom(user);
      }
   }

   protected async SendUserLobbyInviteInfo(user: LobbyUser, userId: string, roomId: string): Promise<void> {
      const userRoomId = await DB_Rooms.GetUserRoomId({id: user.id});
      if (roomId !== userRoomId) return;

      const userToInvite = this.usersInLobby[userId];
      if (!userToInvite) return;

      userToInvite.InformAboutInviteToRoom(user.id, roomId);
   }


   // lobby info
   protected async GetLobbyInfo(): Promise<extendedLobbyData> {
      return {
         lobbyData: this.lobbyData,
         chat: [
            ...this.chat.GetStartMessages().map(m => m.GetMessageInfo()),
            ...this.chat.GetMessages().map(m => m.GetMessageInfo())
         ]
      }
   }

   // informatory
   protected InformUsersAboutGlobalLobbyChatMassage(message: chatMessageInfo): void {
      Object.keys(this.usersInLobby).forEach(uId => this.usersInLobby[uId].InformAboutGlobalLobbyChatMessage(message));
   }
}
