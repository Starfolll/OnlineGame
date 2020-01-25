import {Player, playerInfo, playerPreGameInfo} from "./player";
import {Card, cardClass, cardInfo} from "../gameTableManager/deck/card";
import {tableInfo} from "../gameTableManager/gameTable";
import {heroDebuffsTypes} from "../gameTableManager/heroesStacks/heroDebuffsTypes";
import {heroAbilityTypes} from "../gameTableManager/heroesStacks/heroAbilityTypes";
import {chatMessageInfo} from "../../utils/chat/chatMessage";


export type tableInfoWithPlayers = {
   tableInfo: tableInfo;
   players: Array<playerInfo>;
}

export class Players {
   private readonly players: { [id: string]: Player; } = {};

   private readonly playersIdInGame: Set<string>;
   private readonly playersIdCount: number;

   private playerPickHeroTurn: number = -1;
   private playerHeroWeightTurn: number = -1;

   constructor(playersIdInGame: Array<string>) {
      this.playersIdInGame = new Set(playersIdInGame);
      this.playersIdCount = this.playersIdInGame.size;
   }


   get playersId(): Set<string> {
      return new Set(Object.keys(this.players).map(id => id));
   }

   get length(): number {
      return this.playersIdCount;
   }


   public GetPlayerWithId(id: string): Player {
      return this.players[id];
   }


   public GivePlayerCard(playerId: string, card: Card, announce = true): void {
      this.players[playerId].hand.push(card);
      if (announce) this.InformPlayersAboutPlayerReceivedCard(playerId, card);
   }

   public GivePlayerGold(playerId: string, count: number, announce = true) {
      this.players[playerId].gold += count;
      if (announce) this.InformPlayersAboutPlayerReceivedGold(playerId, count);
   }

   public SetPlayerKing(playerId: string): void {
      Array.from(this.playersIdInGame).forEach(pId => {
         this.players[pId].isKing = playerId === pId;
      });
   }

   public AddBuildLimitToPlayer(playerId: string, additionLimit: number): void {
      this.players[playerId].additionalBuildLimit += additionLimit;
   }

   public AddGoldToPlayerForEachCardClass(playerId: string, cardClass: cardClass): void {
      const playerPlacedCards = this.GetPlayerWithId(playerId).placedCards;
      let additionGold = 0;
      playerPlacedCards.forEach(c => {
         if (c.cardClass === "all" || c.cardClass === cardClass) additionGold++;
      });
      if (additionGold > 0) this.GivePlayerGold(playerId, additionGold);
   }

   public SetPlayerHand(playerId: string, newHand: Array<Card>): void {
      this.players[playerId].hand = newHand;
      this.InformPlayersAboutPlayerHandChanged(playerId);
   }

   public AttachHeroWeightToPlayer(playerId: string, heroWeight: number): void {
      this.players[playerId].heroWeight = heroWeight;
      this.players[playerId].SetHeroPickTurnMade();
   }

   //------------//
   // pick hero sickle and start game
   private GetPlayerIdWithTurnNumber(turnNumber: number): string | undefined {
      const playersId = Array.from(this.playersIdInGame);

      for (let i = 0; i < playersId.length; i++) {
         const player = this.players[playersId[i]];
         if (player.heroPickTurnNumber === turnNumber)
            return player.id;
      }

      return undefined;
   }

   private GetPlayerIdWithHeroWeight(weight: number): string | undefined {
      const playersId = Array.from(this.playersIdInGame);

      for (let i = 0; i < playersId.length; i++) {
         const player = this.players[playersId[i]];
         if (player.heroWeight === weight)
            return player.id;
      }

      return undefined;
   }

   private GetKingPlayerId(): string | undefined {
      const playersId = Array.from(this.playersIdInGame.values());
      for (let i = 0; i < playersId.length; i++) {
         if (this.players[playersId[i]].isKing) return playersId[i];
      }
      return undefined;
   }


   public ResetTurns(): void {
      Array.from(this.playersIdInGame).forEach(pId => {
         this.players[pId].ResetTurns();
      });
   }

   public RollInitialPlayerTurn(): void {
      const playersTurns: Array<number> = [];

      for (let i = 0; i < this.playersIdCount; i++) playersTurns.push(i + 1);
      playersTurns.sort(() => Math.random() - 0.5);

      this.playersIdInGame.forEach(pId => {
         const turn = playersTurns.shift();
         this.players[pId].heroPickTurnNumber = !!turn ? turn : -1;
         this.players[pId].heroPickInitialTurnNumber = !!turn ? turn : -1;
         if (turn === 1) this.players[pId].isKing = true;
      });

      this.playerPickHeroTurn = 0;
   }

   public RearrangePlayersTurn(): void {
      const kingPlayerId = this.GetKingPlayerId()!;
      const kingPlayerInitialTurnNumber = this.players[kingPlayerId].heroPickInitialTurnNumber;

      const playersId = Array.from(this.playersIdInGame.values());
      for (let i = 0; i < playersId.length; i++) {
         const playerInitialTurnNumber = this.players[playersId[i]].heroPickInitialTurnNumber;

         if (!!playerInitialTurnNumber && !!kingPlayerInitialTurnNumber)
            if (playerInitialTurnNumber < kingPlayerInitialTurnNumber) {
               this.players[playersId[i]].heroPickTurnNumber =
                  this.length - kingPlayerInitialTurnNumber + 1 + playerInitialTurnNumber;
            } else {
               this.players[playersId[i]].heroPickTurnNumber =
                  playerInitialTurnNumber - kingPlayerInitialTurnNumber + 1;
            }
      }

      this.playerPickHeroTurn = 0;
   }

   public SetNextPlayerPickHeroTurn(): void {
      this.playerPickHeroTurn++;

      if (!Array.from(this.playersIdInGame).some(pId => {
         return this.players[pId].heroPickTurnNumber === this.playerPickHeroTurn;
      })) this.playerPickHeroTurn = -1;
   }

   public IsPlayerHeroPickTurn(playerId: string, heroWeight: number): boolean {
      return this.players[playerId].IsHeroPickTurnCanBeMade(heroWeight);
   }

   public IsAllPlayersPickedHero(): boolean {
      return this.playerPickHeroTurn === this.playersIdCount;
   }


   // initial hero turn
   public GetCurrentHeroWeightTurn(): number {
      return this.playerHeroWeightTurn;
   }

   public GetCurrentPlayerIdTurn(): string {
      return this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn)!;
   }

   public ResetCurrentHeroTurn(): void {
      this.playerHeroWeightTurn = -1;
   }

   public SetNextHeroTurn(): void {
      const heroesTurnsLeft: Array<number> = [];

      this.playersIdInGame.forEach(pId => {
         const heroWeight = this.players[pId].heroWeight;
         if (!!heroWeight && heroWeight > this.playerHeroWeightTurn) heroesTurnsLeft.push(heroWeight);
      });

      heroesTurnsLeft.sort();

      if (heroesTurnsLeft.length === 0) this.playerHeroWeightTurn = -1;
      else this.playerHeroWeightTurn = heroesTurnsLeft[0];
   }

   public SetHeroInitialTurnOptions(options: Array<string>): void {
      const playerIdWithHeroWeight = this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn)!;
      this.players[playerIdWithHeroWeight].initialTurnOptionsToPickFrom = options;
   }

   public RemoveHeroInitialTurnOptionsInPlayer(playerId: string) {
      this.players[playerId].initialTurnOptionsToPickFrom = undefined;
   }

   public IsPlayerCanInitialPickOptionTurn(playerId: string, option: string): boolean {
      return this.players[playerId].IsInitialPickOptionTurnCanBeMade(option);
   }

   public GivePlayerInitialCardsToChoseFrom(playerId: string, cards: Array<Card>): void {
      this.players[playerId].initialTurnCardsToPickFrom = cards;
      this.players[playerId].InformAboutMoveToPickOneOfProposedCards(cards.map(c => c.GetInfo()));
   }

   public IsPlayerCanPickHeroInitialCard(playerId: string, cardInGameId: number): boolean {
      return this.players[playerId].IsInitialPickCardTurnCanBeMade(cardInGameId);
   }

   public GetPlayerChosenCard(playerId: string, cardInGameId: number): Card | undefined {
      return this.players[playerId].GetInitialTurnChosenCard(cardInGameId);
   }

   public SetPlayerInitialTurnMade(playerId: string): void {
      this.players[playerId].SetInitialTurnMade();
   }

   public IsAllHeroesPlayedTurn(): boolean {
      return this.playerHeroWeightTurn === -1;
   }

   // hero ability
   public SetHeroAbilityTurnStart(heroAbilityType: heroAbilityTypes): void {
      this.players[this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn)!].abilityTurnType = heroAbilityType;
   }

   public SetHeroAbilityTurnMade() {
      this.players[this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn)!].SetAbilityTurnMade();
   }

   // players buildTurn
   public SetHeroBuildTurnStart(buildLimit: number): void {
      const playerIdWithHero = this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn)!;

      this.players[playerIdWithHero].buildLimit = buildLimit;
   }

   public IsPlayerCanBuildDistrict(playerId: string, cardInGameId: number): boolean {
      return this.players[playerId].IsDistrictBuildCanBeMade(cardInGameId);
   }

   public SetPlayerCardBuilt(playerId: string, cardInGameId: number): void {
      const card = this.players[playerId].RemoveCardFromHand(cardInGameId);
      if (!!card) {
         this.players[playerId].gold -= card.cost;
         this.players[playerId].placedCards.push(card);
         this.players[playerId].buildLimit! -= 1;

         this.InformPlayersAboutDistrictBuilt(playerId, card.GetInfo());
      }
   }

   public IsPlayerCanEndBuildTurn(playerId: string): boolean {
      return this.players[playerId].IsEndOfBuildTurnCanBeMade();
   }

   public EndPlayerBuildTurn(playerId: string): void {
      this.players[playerId].SetBuildTurnMade();
   }

   public DestroyPlayerDistrict(playerId: string, districtInGameId: number): void {
      this.players[playerId].RemovePlacedCard(districtInGameId);
   }

   // end game
   public IsMaxDistrictsWasBuilt(): boolean {
      return Array.from(this.playersIdInGame).some(pId => {
         return this.players[pId].IsMaxDistrictsBuilt();
      });
   }

   public DisconnectAllPlayers(): void {
      Object.keys(this.players).forEach(pId => {
         this.players[pId].Disconnect();
      });
   }

   //------------//
   // players connection
   public IsPlayerBelongToGame(player: Player): boolean {
      return this.playersIdInGame.has(player.id);
   }

   public AddPlayer(player: Player): void {
      this.players[player.id] = player;
   }

   public IsAllPlayerConnected(): boolean {
      return Object.keys(this.players).length === this.playersIdCount;
   }

   public IsPlayerCreated(player: Player): boolean {
      return Object.keys(this.players).some(pId => {
         const p = this.players[pId];
         return player.id === p.id && player.token === p.token && !p.IsConnected;
      });
   }

   public ResetPlayerConnection(player: Player) {
      Object.keys(this.players).forEach(pId => {
         const p = this.players[pId];
         if (p.id === player.id && p.token === player.token) {
            this.players[pId].Connection = player.Connection;
         }
      });
   }

   public IsPlayerClone(player: Player): boolean {
      return Object.keys(this.players).some(pId => {
         const p = this.players[pId];
         return (player.id === p.id && player.token === p.token && p.IsConnected);
      });
   }

   public SetPlayerDisconnected(playerId: string): void {
      Object.keys(this.players).forEach(pId => {
         if (this.players[pId].id === playerId)
            this.players[pId].SetDisconnected();
      });
   }

   // players informant
   public InformPlayersAboutInitialPlayerConnection(playerInfo: playerPreGameInfo): void {
      Object.keys(this.players).forEach(pId => {
         if (pId !== playerInfo.id) this.players[pId].InformAboutPlayerInitialConnected(playerInfo);
      });
   }

   public InformPlayersAboutPlayerConnected(playerId: string): void {
      Object.keys(this.players).forEach(pId => {
         if (pId !== playerId) this.players[pId].InformAboutPlayerConnected(playerId);
      });
   }

   public InformPlayersAboutPlayerDisconnected(playerId: string): void {
      Object.keys(this.players).forEach(pId => {
         if (pId !== playerId) this.players[pId].InformAboutPlayerDisconnected(playerId);
      });
   }


   public InformPlayersAboutGameStart(tableInfo: tableInfo): void {
      this.playersId.forEach(pId => {
         this.InformPlayerAboutGameTable(pId, tableInfo);
      });
   }


   public InformPlayersAboutHeroPickTurnStart(shiftedHeroesWeight: Array<number>, heroesWeightLeft: Array<number>): void {
      const playerTurnId = this.GetPlayerIdWithTurnNumber(this.playerPickHeroTurn)!;

      this.playersId.forEach(pId => {
         if (this.players[pId].id === playerTurnId)
            this.players[pId].heroesWeightToPickFrom = heroesWeightLeft;

         this.players[pId].InformAboutHeroPickTurnStart(
            shiftedHeroesWeight,
            pId === playerTurnId ? heroesWeightLeft : undefined,
            playerTurnId
         );
      });
   }

   public InformPlayersAboutPlayerPickingHero(heroesWeightLeft: Array<number>): void {
      const playerTurnId = this.GetPlayerIdWithTurnNumber(this.playerPickHeroTurn)!;

      this.playersId.forEach(pId => {
         if (this.players[pId].id === playerTurnId)
            this.players[pId].heroesWeightToPickFrom = heroesWeightLeft;

         this.players[pId].InformAboutPickHeroTurn(
            playerTurnId,
            pId === playerTurnId ? heroesWeightLeft : undefined
         );
      });
   }


   public InformPlayersAboutHeroAbilityTurnStart(heroAbilityType: heroAbilityTypes): void {
      const playerId = this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn)!;
      this.playersId.forEach(pId => {
         this.players[pId].InformAboutHeroAbilityTurnStart(heroAbilityType, playerId);
      });
   }


   public InformPlayersAboutPlayerHandChanged(playerId: string): void {
      const newHand = this.players[playerId].hand;
      const handLength = newHand.length;

      this.playersId.forEach(pId => {
         if (pId === playerId) this.players[pId].InformAboutPlayerHandChanged(playerId, handLength, newHand);
         else this.players[pId].InformAboutPlayerHandChanged(playerId, handLength);
      });
   }


   public InformPlayersAboutNextHeroInitialTurnStart(): void {
      const playerIdTurn = this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn)!;

      this.playersId.forEach(pId => {
         this.players[pId].InformAboutInitialHeroTurn(
            this.playerHeroWeightTurn,
            playerIdTurn
         );
      });
   }

   public InformPlayersAboutHeroBuildTurnStart(): void {
      const playerIdTurn = this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn)!;
      const playerBuildLimit = this.GetPlayerWithId(playerIdTurn).buildLimit;

      this.playersId.forEach(pId => {
         this.players[pId].InformAboutBuildTurnStart(
            this.playerHeroWeightTurn,
            playerIdTurn,
            playerIdTurn === pId ? playerBuildLimit : undefined
         );
      });
   }


   public InformPlayersAboutDistrictBuilt(playerId: string, cardInfo: cardInfo): void {
      this.playersId.forEach(pId => {
         this.players[pId].InformAboutPlayerBuiltDistrict(playerId, cardInfo);
      });
   }

   public InformPlayersAboutDistrictDestroyed(playerId: string, cardInGameId: number): void {
      this.playersId.forEach(pId => {
         this.players[pId].InformAboutPlayerDistrictDestroyed(playerId, cardInGameId);
      });
   }


   public InformPlayersAboutPlayerReceivedGold(playerId: string, count: number): void {
      this.playersId.forEach(pId => {
         this.players[pId].InformAboutPlayerReceivedGold(playerId, count);
      });
   }

   public InformPlayersAboutPlayerReceivedCard(playerId: string, card: Card): void {
      this.playersId.forEach(pId => {
         this.players[pId].InformAboutPlayerReceivedCard(playerId, playerId === pId ? card : undefined);
      });
   }

   public InformAboutDebuffAddedToHero(heroWeight: number, debuffType: heroDebuffsTypes, fromPlayerId?: string): void {
      this.playersId.forEach(pId => {
         this.players[pId].InformAboutDebuffAddedToHero(heroWeight, debuffType, fromPlayerId);
      });
   }


   public InformPlayersAboutGameEnd(): void {
      const playersScore = Array.from(this.playersIdInGame).map(pId => {
         return this.players[pId].GetScore();
      });

      playersScore.sort((a, b) => b.score - a.score);

      for (let i = 0; i < playersScore.length; i++) {
         if (i === 0) playersScore[i].isWinner = true;
         playersScore[i].place = i + 1;
      }

      Array.from(this.playersIdInGame).forEach(pId => {
         this.players[pId].InformAboutGameEnd(playersScore)
      });
   }


   public InformPlayersAboutChatMessage(message: chatMessageInfo): void {
      this.playersId.forEach(pId => {
         this.players[pId].InformAboutChatMessage(message);
      });
   }


   public InformPlayerAboutPreGameInfo(playerId: string): void {
      this.players[playerId].InformAboutPreGameInfo(
         Object.keys(this.players).map(pId => {
            return this.players[pId].GetPreGameInfo();
         }),
         this.length
      );
   }

   public InformPlayerAboutGameTable(playerId: string, tableInfo: tableInfo): void {
      const player = this.players[playerId];

      const tableInfoWithPlayers: tableInfoWithPlayers = {
         "tableInfo": tableInfo,
         "players": Array.from(this.playersIdInGame).map(pId => {
            return this.players[pId].GetInfo(player.id === pId);
         })
      };

      player.InformAboutTable(tableInfoWithPlayers);
   }
}