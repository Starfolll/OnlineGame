import WebSocket from "ws";

import {Card, cardInfo} from "../gameTableManager/deck/card";

import {GetGameMessage} from "./communicationWithPlayer/informGameMassages";
import {tableInfoWithPlayers} from "./players";
import {heroDebuffsTypes} from "../gameTableManager/heroesStacks/heroDebuffsTypes";
import {heroAbilityTypes} from "../gameTableManager/heroesStacks/heroAbilityTypes";
import User, {userData, userPublicData} from "../../models/user/user";
import {chatMessageInfo} from "../../utils/chat/chatMessage";


export type playerPreGameInfo = {
   id: string;
   name: string;
   isConnected: boolean;
}

export type playerEndGameScoreTable = {
   playerId: string;
   score: number;
   isWinner: boolean;
   place: number;
}

export type playerInfo = {
   user: userPublicData;

   connected: boolean;

   isKing: boolean;
   isHeroPickTurnMade: boolean;
   isInitialHeroTurnMade: boolean;
   isAbilityTurnMade: boolean;
   isBuildTurnMade: boolean;
   isMyTurn: boolean;

   heroPickTurnNumber: number | undefined;
   heroPickInitialTurnNumber: number | undefined;

   heroesWeightToPickFrom?: Array<number> | undefined;
   initialTurnOptionsToPickFrom?: Array<string> | undefined;
   initialTurnCardsToPickFrom?: Array<cardInfo> | undefined;
   abilityTurnType?: heroAbilityTypes | undefined;
   buildLimit?: number | undefined;

   hand?: Array<cardInfo>;
   pickedHeroWeight?: number | undefined;
   gold: number;
   placedCards: Array<cardInfo>;
   maxSameCardsAmount: number;
   cardsAmountInHand: number;
};

export class Player extends User {
   private isPlayerDisconnected: boolean = false;
   private connection: WebSocket;


   public isKing: boolean = false;
   public isHeroPickTurnMade: boolean = false;
   public isInitialHeroTurnMade: boolean = false;
   public isAbilityTurnMade: boolean = false;
   public isBuildTurnMade: boolean = false;

   public heroPickTurnNumber: number | undefined = undefined;
   public heroPickInitialTurnNumber: number | undefined = undefined;

   public heroesWeightToPickFrom: Array<number> | undefined = undefined;
   public initialTurnOptionsToPickFrom: Array<string> | undefined = undefined;
   public initialTurnCardsToPickFrom: Array<Card> | undefined = undefined;
   public abilityTurnType: heroAbilityTypes | undefined = undefined;
   public buildLimit: number | undefined = undefined;
   public additionalBuildLimit: number = 0;

   public hand: Array<Card> = [];
   public heroWeight: number | undefined = undefined;
   public gold: number = 0;
   public placedCards: Array<Card> = [];
   public maxSameCardsAmount: number = 10;


   constructor(userData: userData, connection: WebSocket) {
      super(userData);
      this.connection = connection;
   }


   get Connection(): WebSocket {
      return this.connection;
   }

   get IsConnected(): boolean {
      return !this.isPlayerDisconnected;
   }

   set Connection(connection: WebSocket) {
      this.isPlayerDisconnected = false;
      this.connection = connection;
   }

   public SetDisconnected(): void {
      this.isPlayerDisconnected = true;
   }


   public ResetTurns(): void {
      this.heroWeight = undefined;
      this.isHeroPickTurnMade = false;
      this.isInitialHeroTurnMade = false;
      this.isAbilityTurnMade = false;
      this.isBuildTurnMade = false;
   }


   public SetHeroPickTurnMade(): void {
      this.isHeroPickTurnMade = true;
      this.heroesWeightToPickFrom = undefined;
   }

   public SetInitialTurnMade(): void {
      this.isInitialHeroTurnMade = true;
      this.initialTurnOptionsToPickFrom = undefined;
      this.initialTurnCardsToPickFrom = undefined;
   }

   public SetAbilityTurnMade(): void {
      this.abilityTurnType = undefined;
      this.isAbilityTurnMade = true;
   }

   public SetBuildTurnMade(): void {
      this.buildLimit = undefined;
      this.additionalBuildLimit = 0;
      this.isBuildTurnMade = true;
   }


   public IsHeroPickTurnCanBeMade(heroWeight: number): boolean {
      return !!this.heroesWeightToPickFrom &&
         this.heroesWeightToPickFrom.some(h => h === heroWeight);
   }

   public IsInitialPickOptionTurnCanBeMade(option: string): boolean {
      return !!this.initialTurnOptionsToPickFrom &&
         this.initialTurnOptionsToPickFrom.some(o => o === option);
   }

   public IsInitialPickCardTurnCanBeMade(cardInGameId: number): boolean {
      return !!this.initialTurnCardsToPickFrom &&
         this.initialTurnCardsToPickFrom.some(c => c.gameId === cardInGameId);
   }

   public IsDistrictBuildCanBeMade(cardInGameId: number): boolean {
      console.log(typeof this.buildLimit !== "undefined");
      console.log(typeof this.buildLimit !== "undefined" && this.buildLimit + this.additionalBuildLimit > 0);
      console.log(this.hand.some(c => c.gameId === cardInGameId && this.HasEnoughGold(c.cost)));
      console.log(!this.IsMaxDistrictsBuilt());
      console.log(this.IsDistrictCanBePlaced(cardInGameId));
      return typeof this.buildLimit !== "undefined" &&
         this.buildLimit + this.additionalBuildLimit > 0 &&
         this.hand.some(c => c.gameId === cardInGameId && this.HasEnoughGold(c.cost)) &&
         !this.IsMaxDistrictsBuilt() &&
         this.IsDistrictCanBePlaced(cardInGameId);
   }

   private IsDistrictCanBePlaced(cardInGameId: number): boolean {
      let sameCardPlaced = 0;

      this.hand.forEach(c => {
         if (c.gameId === cardInGameId)
            this.placedCards.forEach(pC => {
               if (pC.id === c.id) sameCardPlaced++;
            });
      });

      return this.maxSameCardsAmount > sameCardPlaced;
   }

   public IsEndOfBuildTurnCanBeMade(): boolean {
      return typeof this.buildLimit !== "undefined";
   }

   public IsMaxDistrictsBuilt(): boolean {
      return this.placedCards.length === 3;
   }


   public GetInitialTurnChosenCard(cardIdInGame: number): Card | undefined {
      return this.initialTurnCardsToPickFrom?.filter(c => c.gameId === cardIdInGame)[0];
   }


   public HasEnoughGold(sum: number): boolean {
      return this.gold >= sum;
   }


   public RemoveCardFromHand(cardInGameId: number): Card | undefined {
      let card = undefined;
      this.hand = this.hand.filter(c => {
         if (cardInGameId === c.gameId) {
            card = c;
            return false;
         }
         return true;
      });
      return card;
   }

   public RemovePlacedCard(cardInGameId: number): Card | undefined {
      let card = undefined;
      this.placedCards = this.placedCards.filter(c => {
         if (cardInGameId === c.gameId) {
            card = c;
            return false;
         }
         return true;
      });
      return card;
   }


   public GetScore(): playerEndGameScoreTable {
      let score = 0;
      this.placedCards.forEach(c => score += c.cost);

      return {
         isWinner: false,
         place: 0,
         playerId: this.id,
         score: score
      }
   }


   public Disconnect(): void {
      this.connection.close(1000, "game end");
   }


   public GetPreGameInfo(): playerPreGameInfo {
      return {
         "id": this.id,
         "name": this.name,
         "isConnected": this.IsConnected
      }
   }

   public GetInfo(privateInfo: boolean): playerInfo {
      const info: playerInfo = {
         "user": this.GetUserPublicData(),

         "connected": this.IsConnected,

         "isKing": this.isKing,
         "isHeroPickTurnMade": this.isHeroPickTurnMade,
         "isInitialHeroTurnMade": this.isInitialHeroTurnMade,
         "isBuildTurnMade": this.isBuildTurnMade,
         "isAbilityTurnMade": this.isAbilityTurnMade,
         "isMyTurn":
            !!this.heroesWeightToPickFrom ||
            !!this.initialTurnOptionsToPickFrom ||
            !!this.initialTurnCardsToPickFrom ||
            !!this.abilityTurnType ||
            typeof this.buildLimit !== "undefined",

         "heroPickTurnNumber": this.heroPickTurnNumber,
         "heroPickInitialTurnNumber": this.heroPickInitialTurnNumber,

         "gold": this.gold,
         "placedCards": this.placedCards,
         "maxSameCardsAmount": this.maxSameCardsAmount,
         "cardsAmountInHand": this.hand.length,
      };

      if (privateInfo) {
         info["hand"] = this.hand.map(c => c.GetInfo());

         if (!!this.heroWeight) info["pickedHeroWeight"] = this.heroWeight;

         if (!!this.heroesWeightToPickFrom) info["heroesWeightToPickFrom"] = this.heroesWeightToPickFrom;
         if (!!this.initialTurnOptionsToPickFrom) info["initialTurnOptionsToPickFrom"] = this.initialTurnOptionsToPickFrom;
         if (!!this.initialTurnCardsToPickFrom) info["initialTurnCardsToPickFrom"] = this.initialTurnCardsToPickFrom;
         if (typeof this.buildLimit !== "undefined") info["buildLimit"] = this.buildLimit + this.additionalBuildLimit;
      }

      if (this.isInitialHeroTurnMade) info["pickedHeroWeight"] = this.heroWeight;
      if (!!this.abilityTurnType) info["abilityTurnType"] = this.abilityTurnType;

      return info;
   }


   // informatory
   public InformAboutPlayerDisconnected(playerId: string): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.PlayerDisconnected(playerId)));
   }

   public InformAboutPlayerInitialConnected(playerInfo: playerPreGameInfo): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.PlayerInitialConnection(playerInfo)));
   }

   public InformAboutPlayerConnected(playerId: string): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.PlayerConnected(playerId)));
   }

   public InformAboutPreGameInfo(playersInfo: Array<playerPreGameInfo>, playersCount: number): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.PreGameInfo(playersInfo, playersCount)));
   }

   public InformAboutTable(gameTable: tableInfoWithPlayers): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.TableInfo(gameTable)));
   }

   public InformAboutHeroPickTurnStart(heroesShiftedWeight: Array<number>, heroesWeightLeft: Array<number> | undefined, playerIdTurn: string): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.HeroPickTurnStart(heroesShiftedWeight, heroesWeightLeft, playerIdTurn)));
   }

   public InformAboutPickHeroTurn(playerIdTurn: string, heroesWeightLeft: Array<number> | undefined): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.PickHero(playerIdTurn, heroesWeightLeft)));
   }

   public InformAboutInitialHeroTurn(heroWeight: number, playerId: string): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.HeroInitialTurnStarted(
            heroWeight,
            playerId,
            this.initialTurnOptionsToPickFrom
         )));
   }

   public InformAboutBuildTurnStart(heroWeight: number, playerId: string, buildLimit: number | undefined): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.HeroBuildTurnStarted(heroWeight, playerId, buildLimit)));
   }


   public InformAboutHeroAbilityTurnStart(abilityType: heroAbilityTypes, playerId: string): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.HeroAbilityTurnStarted(abilityType, playerId)));
   }


   public InformAboutPlayerBuiltDistrict(playerId: string, cardInfo: cardInfo): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.DistrictBuilt(playerId, cardInfo)));
   }

   public InformAboutPlayerDistrictDestroyed(playerId: string, cardInGameId: number): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.DistrictDestroyed(playerId, cardInGameId)));
   }


   public InformAboutPlayerReceivedGold(playerId: string, count: number): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.PlayerReceivedGold(playerId, count)));
   }

   public InformAboutPlayerReceivedCard(playerId: string, card: Card | undefined): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.PlayerReceivedCard(playerId, card)));
   }

   public InformAboutPlayerHandChanged(playerId: string, newHandLength: number, hand?: Array<Card>): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.PlayerHandChanged(playerId, newHandLength, hand)));
   }


   public InformAboutChatMessage(message: chatMessageInfo): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.ChatMessage(message)));
   }


   public InformAboutMoveToPickOneOfProposedCards(cards: Array<cardInfo>): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.PickOneOfProposedCards(cards)));
   }

   public InformAboutGameEnd(scoreTable: Array<playerEndGameScoreTable>): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.GameEnd(scoreTable)));
   }

   public InformAboutDebuffAddedToHero(heroWeight: number, debuffType: heroDebuffsTypes, fromPlayerId?: string): void {
      if (this.IsConnected)
         this.connection.send(JSON.stringify(GetGameMessage.DebuffAddedToHero(heroWeight, debuffType, fromPlayerId)));
   }
}
