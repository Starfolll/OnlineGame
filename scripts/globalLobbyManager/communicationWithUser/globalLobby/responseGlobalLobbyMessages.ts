import {
   connectToPrivateRoom,
   globalLobbyChatMessage,
   newPrivateRoom,
   publicRoomSearch,
   sendInviteToRoom,
   userInitialConnection
} from "./responseGlobalLobbyMessages.types";
import Joi from "joi";


export default class IsLobbyMessageValid {
   public static GetValidUserInitialConnection(message: any): userInitialConnection | undefined {
      const validateSchema = Joi.object({
         messageType: "userInitialConnection",
         token: Joi.string().required(),
         id: Joi.string().required()
      });

      return !!validateSchema.validate(message)["error"] ? undefined : message as userInitialConnection;
   }

   public static GetValidChatMessage(message: any): globalLobbyChatMessage | undefined {
      const validateSchema = Joi.object({
         messageType: "globalLobbyChatMessage",
         message: Joi.string().required(),
      });

      return !!validateSchema.validate(message)["error"] ? undefined : message as globalLobbyChatMessage;
   }

   public static GetValidPublicRoomSearch(message: any): publicRoomSearch | undefined {
      const validateSchema = Joi.object({
         messageType: "publicRoomSearch",
      });

      return !!validateSchema.validate(message)["error"] ? undefined : message as publicRoomSearch;
   }

   public static GetValidCreateNewPrivateRoom(message: any): newPrivateRoom | undefined {
      const validateSchema = Joi.object({
         messageType: "createNewPrivateRoom",
      });

      return !!validateSchema.validate(message)["error"] ? undefined : message as newPrivateRoom;
   }

   public static GetValidConnectToPrivateRoom(message: any): connectToPrivateRoom | undefined {
      const validateSchema = Joi.object({
         messageType: "connectToPrivateRoom",
         roomId: Joi.string().required()
      });

      return !!validateSchema.validate(message)["error"] ? undefined : message as connectToPrivateRoom;
   }

   public static GetValidSendInviteToRoom(message: any): sendInviteToRoom | undefined {
      const validateSchema = Joi.object({
         messageType: "sendInviteToRoom",
         userId: Joi.string().required(),
         roomId: Joi.string().required()
      });

      return !!validateSchema.validate(message)["error"] ? undefined : message as sendInviteToRoom;
   }
}
