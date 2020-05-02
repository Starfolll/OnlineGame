import {heroAbilityTypes} from "../../../store/actions/table/table.actions.types";
import {
   buildDistrict, heroAbilityUsed,
   heroPicked,
   initialGameConnection,
   initialHeroCardPicked,
   initialHeroTurnOptionPicked,
   initialHeroTurnOptions
} from "./informGameMessages.types";

export default class GetGameMessage {
   public static InitialConnection(id: string, token: string, tableId: string): initialGameConnection {
      return {messageType: "playerInitialConnection", id, token, tableId};
   }

   public static HeroPicked(heroWeight: number): heroPicked {
      return {messageType: "heroPicked", heroWeight};
   }

   public static InitialHeroTurnOptionPicked(pickedOption: initialHeroTurnOptions): initialHeroTurnOptionPicked {
      return {messageType: "initialHeroTurnOptionPicked", pickedOption};
   }

   public static InitialHeroCardPicked(cardInGameId: number): initialHeroCardPicked {
      return {messageType: "initialHeroCardPicked", cardInGameId};
   }

   public static BuiltDistrict(cardInGameId: number): buildDistrict {
      return {messageType: "buildDistrict", cardInGameId};
   }

   public static HeroAbilityUsed(abilityType: heroAbilityTypes, abilityData: any): heroAbilityUsed{
      return {messageType: "heroAbilityUsed", abilityData}
   }
}
