import {Player} from "../players/player";
import {Players} from "../players/players";
import {Deck} from "./deck/deck";
import {Hero, heroInfo} from "./heroesStacks/hero";
import {HeroesStack} from "./heroesStacks/heroesStack";
import {Card} from "./deck/card";
import {initialHeroTurnOptions} from "../players/communicationWithPlayer/responseGameMessages.types";
import Chat from "../../utils/chat/chat";
import Table, {tableData} from "../../models/table/table";
import ChatMessage, {chatMessageInfo} from "../../utils/chat/chatMessage";

type turnsType =
   "waitingForPlayers" |
   "gameStarted" |
   "heroPickTurn" |
   "initialTurn" |
   "heroAbilityTurn" |
   "buildTurn";

export type tableInfo = {
   isGameStarted: boolean;
   isGameEnd: boolean;

   heroes: Array<heroInfo>;
   shiftedHeroesWeight: Array<number>;

   currentTurnType: turnsType;

   cardsInDeck: number;

   chatMessages: Array<chatMessageInfo>;
};

export class GameTable extends Table {
   private currentTurnType: turnsType = "waitingForPlayers";

   protected isGameStarted: boolean = false;
   protected isGameEnd: boolean = false;

   private readonly deck: Deck;
   private readonly players: Players;
   private readonly heroes: HeroesStack;
   private readonly chat: Chat<ChatMessage>;

   private readonly onGameEndCallback: (tableId: string) => void;

   constructor(
      table: tableData,
      cards: Array<Card>,
      heroes: { [heroWeight: number]: Hero },
      onGameEndCallback: (tableId: string) => void
   ) {
      super(table);

      this.deck = new Deck(cards);
      this.players = new Players(table.usersId);
      this.heroes = new HeroesStack(heroes);
      this.chat = new Chat<ChatMessage>(30);

      this.onGameEndCallback = onGameEndCallback;
   }


   // players auth
   protected IsPlayerCanBeConnected(player: Player): boolean {
      if (!this.players.IsPlayerBelongToGame(player)) {
         this.DisconnectIllegalPlayer(player, 1000, "not in game");
         return false;
      } else if (this.players.IsPlayerClone(player)) {
         this.DisconnectIllegalPlayer(player, 1000, "clone");
         return false;
      }


      if (!this.players.IsPlayerCreated(player)) {
         this.players.AddPlayer(player);
         this.players.InformPlayersAboutInitialPlayerConnection(player.GetPreGameInfo());
      } else {
         this.players.ResetPlayerConnection(player);
         this.players.InformPlayersAboutPlayerConnected(player.id);
      }

      if (this.isGameStarted) this.players.InformPlayerAboutGameTable(player.id, this.GetTableInfo());
      else this.players.InformPlayerAboutPreGameInfo(player.id);

      return true;
   }

   protected IsAllPlayersConnected(): boolean {
      return this.players.IsAllPlayerConnected();
   }

   protected DisconnectIllegalPlayer(player: Player, errorCode: number, message: string): void {
      player.Connection.close(errorCode, message);
   }

   protected SetPlayerDisconnected(playerId: string): void {
      this.players.SetPlayerDisconnected(playerId);
      this.players.InformPlayersAboutPlayerDisconnected(playerId);
   }


   // initiate game
   protected InitiateGame(): void {
      this.deck.Shuffle();
      this.players.RollInitialPlayerTurn();
      this.GiveEachPlayerInitialCards(4);
      this.GiveEachPlayerInitialGold(2);
   }

   private GiveEachPlayerInitialCards(nCards: number): void {
      this.players.playersId.forEach(pId => {
         for (let i = 0; i < nCards; i++) {
            const card = this.deck.GetTopCard();
            if (!!card) this.players.GivePlayerCard(pId, card, false);
         }
      });
   }

   private GiveEachPlayerInitialGold(nGold: number): void {
      this.players.playersId.forEach(pId => {
         this.players.GivePlayerGold(pId, nGold, false);
      });
   }


   // start game
   protected StartGame(): void {
      this.isGameStarted = true;
      this.currentTurnType = "gameStarted";

      const tableInfo = this.GetTableInfo();
      this.players.InformPlayersAboutGameStart(tableInfo);

      this.BeginChoosingHeroSickle();
   }


   // players hero pick sickle
   protected BeginChoosingHeroSickle(): void {
      this.currentTurnType = "heroPickTurn";

      this.heroes.ResetBuffs();
      this.heroes.ResetDebuffs();
      this.heroes.ClearShiftedHeroes();
      this.heroes.RefillLeftHeroes();
      this.heroes.ShuffleLeftHeroes();
      this.heroes.ShiftHeroes(this.players.length);

      this.players.ResetTurns();
      this.players.RearrangePlayersTurn();
      this.players.SetNextPlayerPickHeroTurn();
      this.players.InformPlayersAboutHeroPickTurnStart(
         this.heroes.shiftedWeight,
         this.heroes.leftWeight
      );
   }

   protected IsPlayerCanPickHero(playerId: string, heroWeight: number): boolean {
      if (!this.heroes.IsLeftHeroesHasWeight(heroWeight)) return false;
      return this.players.IsPlayerHeroPickTurn(playerId, heroWeight);
   }

   protected AttachHeroToPlayer(playerId: string, heroWeight: number): void {
      this.heroes.RemoveLeftHero(heroWeight);
      this.players.AttachHeroWeightToPlayer(playerId, heroWeight);

      if (!this.players.IsAllPlayersPickedHero()) this.GiveNextPlayerPickHeroTurn();
      else this.BeginInitialHeroTurn();
   }

   protected GiveNextPlayerPickHeroTurn(): void {
      this.players.SetNextPlayerPickHeroTurn();
      this.players.InformPlayersAboutPlayerPickingHero(this.heroes.leftWeight);
   }


   // hero initial turn
   protected BeginInitialHeroTurn(): void {
      this.currentTurnType = "initialTurn";

      this.players.ResetCurrentHeroTurn();
      this.GiveNextPlayerPickInitialTurnOptions();
   }

   protected GiveNextPlayerPickInitialTurnOptions(): void {
      this.players.SetNextHeroTurn();
      if (!this.players.IsAllHeroesPlayedTurn()) {
         if (this.IsPlayerCanMakeInitialHeroTurn()) this.InvokeHeroBuffsAndBeginInitialTurn();
         else this.GiveNextPlayerPickInitialTurnOptions();
      } else {
         if (!this.players.IsMaxDistrictsWasBuilt()) {
            this.BeginChoosingHeroSickle();
         } else {
            this.EndGame();
         }
      }
   }

   protected IsPlayerCanMakeInitialHeroTurn(): boolean {
      return !this.heroes.IsHeroDead(this.players.GetCurrentHeroWeightTurn());
   }

   protected InvokeHeroBuffsAndBeginInitialTurn(): void {
      this.heroes.InvokeHeroDebuffs(
         this.players.GetCurrentHeroWeightTurn(),
         this.players.GetCurrentPlayerIdTurn(),
         this.players,
         this.heroes,
         this.deck
      );
      this.heroes.InvokeHeroBuffs(
         this.players.GetCurrentHeroWeightTurn(),
         this.players.GetCurrentPlayerIdTurn(),
         this.players,
         this.heroes,
         this.deck
      );

      this.players.SetHeroInitialTurnOptions(Array.from(initialHeroTurnOptions));
      this.players.InformPlayersAboutNextHeroInitialTurnStart();
   }

   protected IsPlayerCanPickHeroInitialOptions(playerId: string, option: string): boolean {
      return this.players.IsPlayerCanInitialPickOptionTurn(playerId, option);
   }

   protected HeroPickedInitialTurnOptionGold(playerId: string): void {
      this.players.GivePlayerGold(playerId, 2);
      this.players.SetPlayerInitialTurnMade(playerId);
      this.GivePlayerHeroAbilityTurn();
   }

   protected HeroPickedInitialTurnOptionCards(playerId: string): void {
      const cardsToChoseFrom: Array<Card> = [];
      const maxCardsToChoseFrom: number = 2;
      for (let i = 0; i < maxCardsToChoseFrom; i++) {
         const card = this.deck.GetTopCard();
         if (!!card) cardsToChoseFrom.push(card);
      }

      this.players.RemoveHeroInitialTurnOptionsInPlayer(playerId);
      this.players.GivePlayerInitialCardsToChoseFrom(playerId, cardsToChoseFrom);
   }

   protected IsPlayerCanPickHeroInitialCard(playerId: string, cardInGameId: number): boolean {
      return this.players.IsPlayerCanPickHeroInitialCard(playerId, cardInGameId);
   }

   protected HeroPickedInitialTurnCard(playerId: string, cardInGameId: number): void {
      const card = this.players.GetPlayerChosenCard(playerId, cardInGameId);
      if (!!card) this.players.GivePlayerCard(playerId, card);
      this.players.SetPlayerInitialTurnMade(playerId);
      this.GivePlayerHeroAbilityTurn();
   }


   // hero ability turn
   protected GivePlayerHeroAbilityTurn(): void {
      this.currentTurnType = "heroAbilityTurn";

      if (false && this.heroes.IsHeroHasAbility(this.players.GetCurrentHeroWeightTurn())) {
         const abilityType = this.heroes.GetHeroAbilityType(this.players.GetCurrentHeroWeightTurn())!;
         this.players.SetHeroAbilityTurnStart(abilityType);
         this.players.InformPlayersAboutHeroAbilityTurnStart(abilityType);
      } else {
         this.players.SetHeroAbilityTurnMade();
         this.BeginBuildHeroTurn();
      }
   }

   protected IsPlayerCanUseHeroAbility(playerId: string, abilityData: any): boolean {
      return this.heroes.IsHeroCanUseAbility(
         this.players.GetCurrentHeroWeightTurn(),
         abilityData,
         playerId,
         this.players,
         this.heroes,
         this.deck
      );
   }

   protected UsePlayerHeroAbility(playerId: string, abilityData: any): void {
      this.heroes.UseHeroAbility(
         this.players.GetCurrentHeroWeightTurn(),
         abilityData,
         playerId,
         this.players,
         this.heroes,
         this.deck
      );

      this.players.SetHeroAbilityTurnMade();
      this.BeginBuildHeroTurn();
   }


   // hero build turn
   protected BeginBuildHeroTurn(): void {
      this.currentTurnType = "buildTurn";

      this.players.SetHeroBuildTurnStart(1);
      this.players.InformPlayersAboutHeroBuildTurnStart();
   }

   protected IsPlayerCanBuildDistrict(playerId: string, cardInGameId: number): boolean {
      return this.players.IsPlayerCanBuildDistrict(playerId, cardInGameId);
   }

   protected PlayerBuildDistrict(playerId: string, cardInGameId: number): void {
      this.players.SetPlayerCardBuilt(playerId, cardInGameId);
   }

   protected PlayerCanEndBuildTurn(playerId: string) {
      return this.players.IsPlayerCanEndBuildTurn(playerId);
   }

   protected EndPlayerBuildTurn(playerId: string): void {
      this.players.EndPlayerBuildTurn(playerId);
      this.GiveNextPlayerPickInitialTurnOptions();
   }

   // end game
   protected EndGame(): void {
      this.isGameEnd = true;

      this.players.InformPlayersAboutGameEnd();

      this.players.DisconnectAllPlayers();
      this.onGameEndCallback(this.id);
   }

   // chat message
   protected AddChatMessage(playerId: string, message: string): void {
      const chatMessage = new ChatMessage(
         this.players.GetPlayerWithId(playerId).GetUserPublicData(),
         message
      );

      this.chat.AddMessage(chatMessage);

      this.players.InformPlayersAboutChatMessage(chatMessage.GetMessageInfo());
   }

   // table info
   protected GetTableInfo(): tableInfo {
      return {
         "isGameStarted": this.isGameStarted,
         "isGameEnd": this.isGameEnd,

         "heroes": this.heroes.GetHeroesInfo(),
         "shiftedHeroesWeight": this.heroes.shiftedWeight,

         "cardsInDeck": this.deck.cardsLeft,

         "currentTurnType": this.currentTurnType,

         "chatMessages": this.chat.GetMessages().map(m => m.GetMessageInfo())
      }
   }
}
