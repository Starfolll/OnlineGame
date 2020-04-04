import {leaveRoom, removeUserFromRoom, roomChatMessage, startGameFromRoom} from "./responseRoomMessage.types";
import Joi from "joi";

export default class IsRoomMessageValid {
   public static GetValidChatMessage(message: any): roomChatMessage | undefined {
      const validateSchema = Joi.object({
         messageType: "roomChatMessage",
         message: Joi.string().required()
      });

      return !!validateSchema.validate(message)["error"] ? undefined : message as roomChatMessage;
   }

   public static GetValidStartGameMessage(message: any): startGameFromRoom | undefined {
      const validateSchema = Joi.object({
         messageType: "startGame",
      });

      return !!validateSchema.validate(message)["error"] ? undefined : message as startGameFromRoom;
   }

   public static GetValidLeaveRoom(message: any): leaveRoom | undefined {
      const validateSchema = Joi.object({
         messageType: "leaveRoom",
      });

      return !!validateSchema.validate(message)["error"] ? undefined : message as leaveRoom;
   }

   public static GetValidRemoveUser(message: any): removeUserFromRoom | undefined {
      const validateSchema = Joi.object({
         messageType: "removeUserFromRoom",
         userId: Joi.string().required()
      });

      return !!validateSchema.validate(message)["error"] ? undefined : message as removeUserFromRoom;
   }
}
