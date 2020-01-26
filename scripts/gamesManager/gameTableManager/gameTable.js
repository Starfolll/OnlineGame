"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const players_1 = require("../players/players");
const deck_1 = require("./deck/deck");
const heroesStack_1 = require("./heroesStacks/heroesStack");
const responseGameMessages_types_1 = require("../players/communicationWithPlayer/responseGameMessages.types");
const chat_1 = __importDefault(require("../../utils/chat/chat"));
const table_1 = __importDefault(require("../../models/table/table"));
const chatMessage_1 = __importDefault(require("../../utils/chat/chatMessage"));
class GameTable extends table_1.default {
    constructor(table, cards, heroes, onGameEndCallback) {
        super(table);
        this.currentTurnType = "waitingForPlayers";
        this.isGameStarted = false;
        this.isGameEnd = false;
        this.deck = new deck_1.Deck(cards);
        this.players = new players_1.Players(table.usersId);
        this.heroes = new heroesStack_1.HeroesStack(heroes);
        this.chat = new chat_1.default(30);
        this.onGameEndCallback = onGameEndCallback;
    }
    IsPlayerCanBeConnected(player) {
        if (!this.players.IsPlayerBelongToGame(player)) {
            this.DisconnectIllegalPlayer(player, 1000, "not in game");
            return false;
        }
        else if (this.players.IsPlayerClone(player)) {
            this.DisconnectIllegalPlayer(player, 1000, "clone");
            return false;
        }
        if (!this.players.IsPlayerCreated(player)) {
            this.players.AddPlayer(player);
            this.players.InformPlayersAboutInitialPlayerConnection(player.GetPreGameInfo());
        }
        else {
            this.players.ResetPlayerConnection(player);
            this.players.InformPlayersAboutPlayerConnected(player.id);
        }
        if (this.isGameStarted)
            this.players.InformPlayerAboutGameTable(player.id, this.GetTableInfo());
        else
            this.players.InformPlayerAboutPreGameInfo(player.id);
        return true;
    }
    IsAllPlayersConnected() {
        return this.players.IsAllPlayerConnected();
    }
    DisconnectIllegalPlayer(player, errorCode, message) {
        player.Connection.close(errorCode, message);
    }
    SetPlayerDisconnected(playerId) {
        this.players.SetPlayerDisconnected(playerId);
        this.players.InformPlayersAboutPlayerDisconnected(playerId);
    }
    InitiateGame() {
        this.deck.Shuffle();
        this.players.RollInitialPlayerTurn();
        this.GiveEachPlayerInitialCards(4);
        this.GiveEachPlayerInitialGold(2);
    }
    GiveEachPlayerInitialCards(nCards) {
        this.players.playersId.forEach(pId => {
            for (let i = 0; i < nCards; i++) {
                const card = this.deck.GetTopCard();
                if (!!card)
                    this.players.GivePlayerCard(pId, card, false);
            }
        });
    }
    GiveEachPlayerInitialGold(nGold) {
        this.players.playersId.forEach(pId => {
            this.players.GivePlayerGold(pId, nGold, false);
        });
    }
    StartGame() {
        this.isGameStarted = true;
        this.currentTurnType = "gameStarted";
        const tableInfo = this.GetTableInfo();
        this.players.InformPlayersAboutGameStart(tableInfo);
        this.BeginChoosingHeroSickle();
    }
    BeginChoosingHeroSickle() {
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
        this.players.InformPlayersAboutHeroPickTurnStart(this.heroes.shiftedWeight, this.heroes.leftWeight);
    }
    IsPlayerCanPickHero(playerId, heroWeight) {
        if (!this.heroes.IsLeftHeroesHasWeight(heroWeight))
            return false;
        return this.players.IsPlayerHeroPickTurn(playerId, heroWeight);
    }
    AttachHeroToPlayer(playerId, heroWeight) {
        this.heroes.RemoveLeftHero(heroWeight);
        this.players.AttachHeroWeightToPlayer(playerId, heroWeight);
        if (!this.players.IsAllPlayersPickedHero())
            this.GiveNextPlayerPickHeroTurn();
        else
            this.BeginInitialHeroTurn();
    }
    GiveNextPlayerPickHeroTurn() {
        this.players.SetNextPlayerPickHeroTurn();
        this.players.InformPlayersAboutPlayerPickingHero(this.heroes.leftWeight);
    }
    BeginInitialHeroTurn() {
        this.currentTurnType = "initialTurn";
        this.players.ResetCurrentHeroTurn();
        this.GiveNextPlayerPickInitialTurnOptions();
    }
    GiveNextPlayerPickInitialTurnOptions() {
        this.players.SetNextHeroTurn();
        if (!this.players.IsAllHeroesPlayedTurn()) {
            if (this.IsPlayerCanMakeInitialHeroTurn())
                this.InvokeHeroBuffsAndBeginInitialTurn();
            else
                this.GiveNextPlayerPickInitialTurnOptions();
        }
        else {
            if (!this.players.IsMaxDistrictsWasBuilt()) {
                this.BeginChoosingHeroSickle();
            }
            else {
                this.EndGame();
            }
        }
    }
    IsPlayerCanMakeInitialHeroTurn() {
        return !this.heroes.IsHeroDead(this.players.GetCurrentHeroWeightTurn());
    }
    InvokeHeroBuffsAndBeginInitialTurn() {
        this.heroes.InvokeHeroDebuffs(this.players.GetCurrentHeroWeightTurn(), this.players.GetCurrentPlayerIdTurn(), this.players, this.heroes, this.deck);
        this.heroes.InvokeHeroBuffs(this.players.GetCurrentHeroWeightTurn(), this.players.GetCurrentPlayerIdTurn(), this.players, this.heroes, this.deck);
        this.players.SetHeroInitialTurnOptions(Array.from(responseGameMessages_types_1.initialHeroTurnOptions));
        this.players.InformPlayersAboutNextHeroInitialTurnStart();
    }
    IsPlayerCanPickHeroInitialOptions(playerId, option) {
        return this.players.IsPlayerCanInitialPickOptionTurn(playerId, option);
    }
    HeroPickedInitialTurnOptionGold(playerId) {
        this.players.GivePlayerGold(playerId, 2);
        this.players.SetPlayerInitialTurnMade(playerId);
        this.GivePlayerHeroAbilityTurn();
    }
    HeroPickedInitialTurnOptionCards(playerId) {
        const cardsToChoseFrom = [];
        const maxCardsToChoseFrom = 2;
        for (let i = 0; i < maxCardsToChoseFrom; i++) {
            const card = this.deck.GetTopCard();
            if (!!card)
                cardsToChoseFrom.push(card);
        }
        this.players.RemoveHeroInitialTurnOptionsInPlayer(playerId);
        this.players.GivePlayerInitialCardsToChoseFrom(playerId, cardsToChoseFrom);
    }
    IsPlayerCanPickHeroInitialCard(playerId, cardInGameId) {
        return this.players.IsPlayerCanPickHeroInitialCard(playerId, cardInGameId);
    }
    HeroPickedInitialTurnCard(playerId, cardInGameId) {
        const card = this.players.GetPlayerChosenCard(playerId, cardInGameId);
        if (!!card)
            this.players.GivePlayerCard(playerId, card);
        this.players.SetPlayerInitialTurnMade(playerId);
        this.GivePlayerHeroAbilityTurn();
    }
    GivePlayerHeroAbilityTurn() {
        this.currentTurnType = "heroAbilityTurn";
        console.log(this.heroes.IsHeroHasAbility(this.players.GetCurrentHeroWeightTurn()));
        if (this.heroes.IsHeroHasAbility(this.players.GetCurrentHeroWeightTurn())) {
            const abilityType = this.heroes.GetHeroAbilityType(this.players.GetCurrentHeroWeightTurn());
            this.players.SetHeroAbilityTurnStart(abilityType);
            this.players.InformPlayersAboutHeroAbilityTurnStart(abilityType);
        }
        else {
            this.players.SetHeroAbilityTurnMade();
            this.BeginBuildHeroTurn();
        }
    }
    IsPlayerCanUseHeroAbility(playerId, abilityData) {
        return this.heroes.IsHeroCanUseAbility(this.players.GetCurrentHeroWeightTurn(), abilityData, playerId, this.players, this.heroes, this.deck);
    }
    UsePlayerHeroAbility(playerId, abilityData) {
        this.heroes.UseHeroAbility(this.players.GetCurrentHeroWeightTurn(), abilityData, playerId, this.players, this.heroes, this.deck);
        this.players.SetHeroAbilityTurnMade();
        this.BeginBuildHeroTurn();
    }
    BeginBuildHeroTurn() {
        this.currentTurnType = "buildTurn";
        this.players.SetHeroBuildTurnStart(1);
        this.players.InformPlayersAboutHeroBuildTurnStart();
    }
    IsPlayerCanBuildDistrict(playerId, cardInGameId) {
        return this.players.IsPlayerCanBuildDistrict(playerId, cardInGameId);
    }
    PlayerBuildDistrict(playerId, cardInGameId) {
        this.players.SetPlayerCardBuilt(playerId, cardInGameId);
    }
    PlayerCanEndBuildTurn(playerId) {
        return this.players.IsPlayerCanEndBuildTurn(playerId);
    }
    EndPlayerBuildTurn(playerId) {
        this.players.EndPlayerBuildTurn(playerId);
        this.GiveNextPlayerPickInitialTurnOptions();
    }
    EndGame() {
        this.isGameEnd = true;
        this.players.InformPlayersAboutGameEnd();
        setTimeout(() => {
            this.players.DisconnectAllPlayers();
            this.onGameEndCallback(this.id);
        }, 6000);
    }
    AddChatMessage(playerId, message) {
        const chatMessage = new chatMessage_1.default(this.players.GetPlayerWithId(playerId).GetUserPublicData(), message);
        this.chat.AddMessage(chatMessage);
        this.players.InformPlayersAboutChatMessage(chatMessage.GetMessageInfo());
    }
    GetTableInfo() {
        return {
            "isGameStarted": this.isGameStarted,
            "isGameEnd": this.isGameEnd,
            "heroes": this.heroes.GetHeroesInfo(),
            "shiftedHeroesWeight": this.heroes.shiftedWeight,
            "cardsInDeck": this.deck.cardsLeft,
            "currentTurnType": this.currentTurnType,
            "chatMessages": this.chat.GetMessages().map(m => m.GetMessageInfo())
        };
    }
}
exports.GameTable = GameTable;
