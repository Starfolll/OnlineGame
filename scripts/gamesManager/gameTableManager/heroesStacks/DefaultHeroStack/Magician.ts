import {debuffWithMetadata, Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";
import {Players} from "../../../players/players";
import {HeroesStack} from "../heroesStack";
import {Deck} from "../../deck/deck";


type changeHand = {
   messageType: string;
   playerId: string;
}

const GetValidUserMassage = (message: any): changeHand | undefined => {
   if (typeof message !== "object") return undefined;
   if (!message["messageType"] && message["messageType"] !== "changeHand") return undefined;
   if (!message["playerId"] && typeof message["playerId"] !== "string") return undefined;
   return message as changeHand;
};


export class Magician extends Hero {
   public readonly id: number = 3;
   public readonly name: string = "Magician";
   public readonly weight: number = 3;
   public readonly description: string = "";

   public readonly abilityType: heroAbilityTypes | undefined = "changeHand";
   public buffs: Array<heroBuffsTypes> = [];
   public debuffs: Array<debuffWithMetadata> = [];

   public ResetBuffs(): void {
      this.buffs = [];
   }

   public ResetDebuffs(): void {
      this.debuffs = [];
   }

   public IsPlayerCanMakeAbilityMove(message: any, playerId: string, players: Players, heroes: HeroesStack, deck: Deck): boolean {
      const validMessage = GetValidUserMassage(message);
      if (!validMessage) return false;

      if (!this.IsPlayerCanUseAbility(players.GetPlayerWithId(playerId))) return false;
      return players.playersId.has(validMessage.playerId);
   }

   public CastPlayerAbility(message: any, playerId: string, players: Players, heroes: HeroesStack, deck: Deck): void {
      const validMessage = GetValidUserMassage(message)!;

      if (validMessage.playerId !== playerId) {
         const player1Hand = players.GetPlayerWithId(playerId).hand;
         const player2Hand = players.GetPlayerWithId(validMessage.playerId).hand;

         players.SetPlayerHand(playerId, player2Hand);
         players.SetPlayerHand(validMessage.playerId, player1Hand);
      } else {
         const card = deck.GetTopCard();
         if (!!card) players.GivePlayerCard(playerId, card);
      }
   }
}
