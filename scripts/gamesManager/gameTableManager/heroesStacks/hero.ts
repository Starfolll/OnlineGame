import {heroDebuffsTypes} from "./heroDebuffsTypes";
import {heroAbilityTypes} from "./heroAbilityTypes";
import {heroBuffsTypes} from "./heroBuffsTypes";
import {Players} from "../../players/players";
import {HeroesStack} from "./heroesStack";
import {Deck} from "../deck/deck";
import {Player} from "../../players/player";

export type heroInfo = {
   id: number;
   name: string;
   weight: number;
   description: string;
   ability: heroAbilityTypes | undefined;
   buffs: Array<heroBuffsTypes>;
   debuffs: Array<debuffWithMetadata>;
}

export type debuffWithMetadata = {
   debuffType: heroDebuffsTypes,
   fromPlayerId: string,
   additionData?: any
}

export abstract class Hero {
   public abstract readonly id: number;
   public abstract readonly name: string;
   public abstract readonly weight: number;
   public abstract readonly description: string;

   public abstract readonly abilityType: heroAbilityTypes | undefined;
   public abstract buffs: Array<heroBuffsTypes> = [];
   public abstract debuffs: Array<debuffWithMetadata> = [];


   get isDead(): boolean {
      return this.debuffs.some(d => d.debuffType === "killed");
   }

   public GetInfo(): heroInfo {
      return {
         id: this.id,
         name: this.name,
         weight: this.weight,
         description: this.description,
         ability: this.abilityType,
         buffs: this.buffs,
         debuffs: this.debuffs
      }
   }


   public abstract ResetBuffs(): void;

   public abstract ResetDebuffs(): void;


   public AddBuff(buff: heroBuffsTypes): void {
      this.buffs.push(buff);
   }

   public AddDebuff(debuff: heroDebuffsTypes, fromPlayerId: string, additionalData?: any): void {
      this.debuffs.push({
         "debuffType": debuff,
         "fromPlayerId": fromPlayerId,
         "additionData": additionalData
      });
   }


   public HasAbility(): boolean {
      console.log(this.abilityType);
      return !!this.abilityType;
   }

   public IsPlayerCanUseAbility(player: Player): boolean {
      return player.abilityTurnType === this.abilityType;
   }

   public abstract IsPlayerCanMakeAbilityMove(message: any, playerId: string, players: Players, heroes: HeroesStack, deck: Deck): boolean;

   public abstract CastPlayerAbility(message: any, playerId: string, players: Players, heroes: HeroesStack, deck: Deck): void;


   public InvokeDebuffs(playerId: string, players: Players, heroes: HeroesStack, deck: Deck): void {
      this.debuffs.forEach(debuff => {
         switch (debuff.debuffType) {
            case "robbed":
               const gold = players.GetPlayerWithId(playerId).gold;
               players.GivePlayerGold(playerId, -gold);
               players.GivePlayerGold(debuff.fromPlayerId, gold);
               break;

            case "killed":
               break;
         }
      });
   }

   public InvokeBuffs(playerId: string, players: Players, heroes: HeroesStack, deck: Deck): void {
      this.buffs.forEach(buff => {
         switch (buff) {
            case "instanceGold":
               players.GivePlayerGold(playerId, 1);
               break;

            case "goldForGreenDistricts":
               players.AddGoldToPlayerForEachCardClass(playerId, "green");
               break;

            case "goldForBlueDistricts":
               players.AddGoldToPlayerForEachCardClass(playerId, "blue");
               break;

            case "goldForRedDistricts":
               players.AddGoldToPlayerForEachCardClass(playerId, "red");
               break;

            case "goldForYellowDistricts":
               players.AddGoldToPlayerForEachCardClass(playerId, "yellow");
               break;

            case "instanceCard":
               const card = deck.GetTopCard();
               if (!!card) players.GivePlayerCard(playerId, card);
               break;

            case "king":
               players.SetPlayerKing(playerId);
               break;

            case "overBuild":
               players.AddBuildLimitToPlayer(playerId, 2);
               break;
         }
      });
   }
}
