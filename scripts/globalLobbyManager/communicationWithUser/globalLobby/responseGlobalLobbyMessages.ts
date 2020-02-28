import {
   connectToPrivateRoom,
   globalLobbyChatMessage,
   newPrivateRoom,
   publicLobbySearch,
   sendInviteToRoom,
   userInitialConnection
} from "./responseGlobalLobbyMessages.types";

export default class IsLobbyMessageValid {
   public static GetValidUserInitialConnection(message: any): userInitialConnection | undefined {
      if (typeof message !== "object") return undefined;
      if (!message["messageType"] && message["messageType"] !== "userInitialConnection") return undefined;
      if (!message["token"] && typeof message["token"] !== "string") return undefined;
      if (!message["id"] && typeof message["id"] !== "string") return undefined;
      return message as userInitialConnection;
   }

   public static GetValidChatMessage(message: any): globalLobbyChatMessage | undefined {
      if (typeof message !== "object") return undefined;
      if (!message["messageType"] && message["messageType"] !== "globalLobbyChatMessage") return undefined;
      if (!message["message"] && typeof message["message"] !== "string") return undefined;
      return message as globalLobbyChatMessage;
   }

   public static GetValidPublicRoomSearch(message: any): publicLobbySearch | undefined {
      if (typeof message !== "object") return undefined;
      if (!message["messageType"] && message["messageType"] !== "publicRoomSearch") return undefined;
      return message as publicLobbySearch;
   }

   public static GetValidCreateNewPrivateRoom(message: any): newPrivateRoom | undefined {
      if (typeof message !== "object") return undefined;
      if (!message["messageType"] && message["messageType"] !== "createNewPrivateRoom") return undefined;
      return message as newPrivateRoom;
   }

   public static GetValidConnectToPrivateRoom(message: any): connectToPrivateRoom | undefined {
      if (typeof message !== "object") return undefined;
      if (!message["messageType"] && message["messageType"] !== "connectToPrivateRoom") return undefined;
      if (!message["roomId"] && typeof message["roomId"] !== "string") return undefined;
      return message as connectToPrivateRoom;
   }

   public static GetValidSendInviteToRoom(message: any): sendInviteToRoom | undefined {
      if (typeof message !== "object") return undefined;
      if (!message["messageType"] && message["messageType"] !== "sendInviteToRoom") return undefined;
      if (!message["userId"] && typeof message["userId"] !== "string") return undefined;
      if (!message["roomId"] && typeof message["roomId"] !== "string") return undefined;
      return message as sendInviteToRoom;
   }
}
