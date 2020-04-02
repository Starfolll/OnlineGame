import {
   buildTurnMade,
   builtDistrict,
   gameChatMessage,
   heroAbilityUsed,
   heroPicked,
   initialHeroCardPicked,
   initialHeroTurnOptionPicked,
   initialHeroTurnOptions,
   playerInitialConnection
} from "./responseGameMessages.types";


export class IsGameMessageValid {
   public static GetValidPlayerInitialConnection(message: any): playerInitialConnection | undefined {
      if (typeof message !== "object") return undefined;
      if (!message["messageType"] && message["messageType"] !== "playerInitialConnection") return undefined;
      if (!message["token"] && typeof message["token"] !== "string") return undefined;
      if (!message["id"] && typeof message["id"] !== "string") return undefined;
      if (!message["tableId"] && typeof message["tableId"] !== "string") return undefined;
      return message as playerInitialConnection;
   }

   public static GetValidHeroPickedMessage(message: any): heroPicked | undefined {
      if (typeof message !== "object") return undefined;
      if (!message["messageType"] && message["messageType"] !== "heroPicked") return undefined;
      if (!message["heroWeight"] && typeof message["heroWeight"] !== "number") return undefined;
      return message as heroPicked;
   }

   public static GetValidInitialHeroTurnOptionPicked(message: any): initialHeroTurnOptionPicked | undefined {
      if (typeof message !== "object") return undefined;
      if (!message["messageType"] && message["messageType"] !== "initialHeroTurnOptionPicked") return undefined;
      if (!message["pickedOption"] && !initialHeroTurnOptions.has(message["pickedOption"])) return undefined;
      return message as initialHeroTurnOptionPicked;
   }

   public static GetValidInitialHeroCardPicked(message: any): initialHeroCardPicked | undefined {
      if (typeof message !== "object") return undefined;
      if (!message["messageType"] && message["messageType"] !== "initialHeroCardPicked") return undefined;
      if (!message["cardInGameId"] && typeof message["cardInGameId"] !== "number") return undefined;
      return message as initialHeroCardPicked;
   }

   public static GetValidHeroAbilityUsed(message: any): heroAbilityUsed | undefined {
      if (typeof message !== "object") return undefined;
      if (!message["messageType"] && message["messageType"] !== "heroAbilityUsed") return undefined;
      if (!message["abilityData"]) return undefined;
      return message as heroAbilityUsed;
   }

   public static GetValidBuiltDistrict(message: any): builtDistrict | undefined {
      if (typeof message !== "object") return undefined;
      if (!message["messageType"] && message["messageType"] !== "builtDistrict") return undefined;
      if (!message["cardInGameId"] && typeof message["cardInGameId"] !== "number") return undefined;
      return message as builtDistrict;
   }

   public static GetValidBuildTurnMade(message: any): buildTurnMade | undefined {
      if (typeof message !== "object") return undefined;
      if (!message["messageType"] && message["messageType"] !== "buildTurnMade") return undefined;
      return message as buildTurnMade;
   }

   public static GetValidChatMessage(message: any, messageLengthLimit: number): gameChatMessage | undefined {
      if (typeof message !== "object") return undefined;
      if (!message["messageType"] && message["messageType"] !== "chatMessage") return undefined;
      if (!message["message"] && typeof message["message"] !== "string") return undefined;
      if (message["message"].length > messageLengthLimit) return undefined;
      return message as gameChatMessage;
   }
}
