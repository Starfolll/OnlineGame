import {
   buildDistrict,
   gameChatMessage,
   heroAbilityUsed,
   heroPicked,
   initialHeroCardPicked,
   initialHeroTurnOptionPicked,
   initialHeroTurnOptions,
   playerInitialConnection
} from "./responseGameMessages.types";
import Joi from "joi";


export class IsGameMessageValid {
   public static GetValidPlayerInitialConnection(message: any): playerInitialConnection | undefined {
      const validateSchema = Joi.object({
         messageType: "playerInitialConnection",
         token: Joi.string().required(),
         id: Joi.string().required(),
         tableId: Joi.string().required()
      });

      return !!validateSchema.validate(message)["error"] ? undefined : message as playerInitialConnection;
   }

   public static GetValidHeroPickedMessage(message: any): heroPicked | undefined {
      const validateSchema = Joi.object({
         messageType: "heroPicked",
         heroWeight: Joi.number().required()
      });

      return !!validateSchema.validate(message)["error"] ? undefined : message as heroPicked;
   }

   public static GetValidInitialHeroTurnOptionPicked(message: any): initialHeroTurnOptionPicked | undefined {
      const validateSchema = Joi.object({
         messageType: "initialHeroTurnOptionPicked",
         pickedOption: Joi.string().required()
      });

      if (!!validateSchema.validate(message)["error"]) return undefined;
      if (!initialHeroTurnOptions.has(message["pickedOption"])) return undefined;
      return message as initialHeroTurnOptionPicked;
   }

   public static GetValidInitialHeroCardPicked(message: any): initialHeroCardPicked | undefined {
      const validateSchema = Joi.object({
         messageType: "initialHeroCardPicked",
         cardInGameId: Joi.number().required()
      });

      return !!validateSchema.validate(message)["error"] ? undefined : message as initialHeroCardPicked;
   }

   public static GetValidHeroAbilityUsed(message: any): heroAbilityUsed | undefined {
      const validateSchema = Joi.object({
         messageType: "heroAbilityUsed",
         abilityData: Joi.required()
      });

      return !!validateSchema.validate(message)["error"] ? undefined : message as heroAbilityUsed;
   }

   public static GetValidBuiltDistrict(message: any): buildDistrict | undefined {
      const validateSchema = Joi.object({
         messageType: "buildDistrict",
         cardInGameId: Joi.number().required()
      });

      return !!validateSchema.validate(message)["error"] ? undefined : message as buildDistrict;
   }

   public static GetValidChatMessage(message: any, messageLengthLimit: number): gameChatMessage | undefined {
      const validateSchema = Joi.object({
         messageType: "chatMessage",
         message: Joi.string().max(messageLengthLimit).required()
      });

      return !!validateSchema.validate(message)["error"] ? undefined : message as gameChatMessage;
   }
}
