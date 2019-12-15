"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const players_1 = require("../player/players");
const deck_1 = require("./deck/deck");
const heroesStack_1 = require("./heroesStacks/heroesStack");
const responseMessagesTypes_1 = require("../player/communicationWithPlayer/responseMessagesTypes");
class GameTable {
    constructor(tableId, playersId, cards, heroes, onGameEndCallback) {
        this.currentTurnType = "waitingForPlayers";
        this.isGameStarted = false;
        this.isGameEnd = false;
        this.tableId = tableId;
        this.deck = new deck_1.Deck(cards);
        this.players = new players_1.Players(playersId);
        this.heroes = new heroesStack_1.HeroesStack(heroes);
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
            this.players.InformPlayersAboutPlayerConnected(player.playerId);
        }
        if (this.isGameStarted)
            this.players.InformPlayerAboutGameTable(player.playerId, this.GetTableInfo());
        else
            this.players.InformPlayerAboutPreGameInfo(player.playerId);
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
        this.players.SetNextHeroTurn();
        this.InvokeHeroBuffsAndBeginInitialTurn();
    }
    InvokeHeroBuffsAndBeginInitialTurn() {
        if (!this.heroes.IsHeroDead(this.players.GetCurrentHeroWeightTurn())) {
            this.heroes.InvokeHeroDebuffs(this.players.GetCurrentHeroWeightTurn(), this.players.GetCurrentPlayerIdTurn(), this.players, this.heroes, this.deck);
            this.heroes.InvokeHeroBuffs(this.players.GetCurrentHeroWeightTurn(), this.players.GetCurrentPlayerIdTurn(), this.players, this.heroes, this.deck);
            this.players.SetHeroInitialTurnOptions(Array.from(responseMessagesTypes_1.initialHeroTurnOptions));
            this.players.InformPlayersAboutNextHeroInitialTurnStart();
        }
        else
            this.GiveNextPlayerPickInitialTurnOptions();
    }
    IsPlayerCanPickHeroInitialOptions(playerId, option) {
        return this.players.IsPlayerCanInitialPickOptionTurn(playerId, option);
    }
    HeroPickedInitialTurnOptionGold(playerId) {
        this.players.GivePlayerGold(playerId, 2);
        this.players.SetPlayerInitialTurnMade(playerId);
        this.BeginBuildHeroTurn();
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
    GiveNextPlayerPickInitialTurnOptions() {
        this.players.SetNextHeroTurn();
        if (!this.players.IsAllPlayersPickedInitialTurnOptions()) {
            this.InvokeHeroBuffsAndBeginInitialTurn();
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
    EndGame() {
        this.isGameEnd = true;
        this.players.InformPlayersAboutGameEnd();
        setTimeout(() => {
            this.players.DisconnectAllPlayers();
            this.onGameEndCallback(this.tableId);
        }, 6000);
    }
    GetTableInfo() {
        return {
            "cardsInDeck": this.deck.cardsLeft,
            "currentTurnType": this.currentTurnType,
            "heroes": this.heroes.GetHeroesInfo(),
            "isGameStarted": this.isGameStarted,
            "isGameEnd": this.isGameEnd,
            "shiftedHeroesWeight": this.heroes.shiftedWeight
        };
    }
}
exports.GameTable = GameTable;
