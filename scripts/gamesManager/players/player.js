"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const informGameMassages_1 = require("./communicationWithPlayer/informGameMassages");
const user_1 = __importDefault(require("../../models/user/user"));
class Player extends user_1.default {
    constructor(userData, connection) {
        super(userData);
        this.isPlayerDisconnected = false;
        this.isKing = false;
        this.isHeroPickTurnMade = false;
        this.isInitialHeroTurnMade = false;
        this.isAbilityTurnMade = false;
        this.isBuildTurnMade = false;
        this.heroPickTurnNumber = undefined;
        this.heroPickInitialTurnNumber = undefined;
        this.heroesWeightToPickFrom = undefined;
        this.initialTurnOptionsToPickFrom = undefined;
        this.initialTurnCardsToPickFrom = undefined;
        this.abilityTurnType = undefined;
        this.buildLimit = undefined;
        this.additionalBuildLimit = 0;
        this.hand = [];
        this.heroWeight = undefined;
        this.gold = 0;
        this.placedCards = [];
        this.maxSameCardsAmount = 10;
        this.connection = connection;
    }
    get Connection() {
        return this.connection;
    }
    get IsConnected() {
        return !this.isPlayerDisconnected;
    }
    set Connection(connection) {
        this.isPlayerDisconnected = false;
        this.connection = connection;
    }
    SetDisconnected() {
        this.isPlayerDisconnected = true;
    }
    ResetTurns() {
        this.heroWeight = undefined;
        this.isHeroPickTurnMade = false;
        this.isInitialHeroTurnMade = false;
        this.isAbilityTurnMade = false;
        this.isBuildTurnMade = false;
    }
    SetHeroPickTurnMade() {
        this.isHeroPickTurnMade = true;
        this.heroesWeightToPickFrom = undefined;
    }
    SetInitialTurnMade() {
        this.isInitialHeroTurnMade = true;
        this.initialTurnOptionsToPickFrom = undefined;
        this.initialTurnCardsToPickFrom = undefined;
    }
    SetAbilityTurnMade() {
        this.abilityTurnType = undefined;
        this.isAbilityTurnMade = true;
    }
    SetBuildTurnMade() {
        this.buildLimit = undefined;
        this.additionalBuildLimit = 0;
        this.isBuildTurnMade = true;
    }
    IsHeroPickTurnCanBeMade(heroWeight) {
        return !!this.heroesWeightToPickFrom &&
            this.heroesWeightToPickFrom.some(h => h === heroWeight);
    }
    IsInitialPickOptionTurnCanBeMade(option) {
        return !!this.initialTurnOptionsToPickFrom &&
            this.initialTurnOptionsToPickFrom.some(o => o === option);
    }
    IsInitialPickCardTurnCanBeMade(cardInGameId) {
        return !!this.initialTurnCardsToPickFrom &&
            this.initialTurnCardsToPickFrom.some(c => c.gameId === cardInGameId);
    }
    IsDistrictBuildCanBeMade(cardInGameId) {
        return typeof this.buildLimit !== "undefined" &&
            this.buildLimit + this.additionalBuildLimit > 0 &&
            this.hand.some(c => c.gameId === cardInGameId && this.HasEnoughGold(c.cost)) &&
            !this.IsMaxDistrictsBuilt() &&
            this.IsDistrictCanBePlaced(cardInGameId);
    }
    IsDistrictCanBePlaced(cardInGameId) {
        let sameCardPlaced = 0;
        this.hand.forEach(c => {
            if (c.gameId === cardInGameId)
                this.placedCards.forEach(pC => {
                    if (pC.id === c.id)
                        sameCardPlaced++;
                });
        });
        return this.maxSameCardsAmount > sameCardPlaced;
    }
    IsEndOfBuildTurnCanBeMade() {
        return typeof this.buildLimit !== "undefined";
    }
    IsMaxDistrictsBuilt() {
        return this.placedCards.length === 3;
    }
    GetInitialTurnChosenCard(cardIdInGame) {
        var _a;
        return (_a = this.initialTurnCardsToPickFrom) === null || _a === void 0 ? void 0 : _a.filter(c => c.gameId === cardIdInGame)[0];
    }
    HasEnoughGold(sum) {
        return this.gold >= sum;
    }
    RemoveCardFromHand(cardInGameId) {
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
    RemovePlacedCard(cardInGameId) {
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
    GetScore() {
        let score = 0;
        this.placedCards.forEach(c => score += c.cost);
        return {
            isWinner: false,
            place: 0,
            playerId: this.id,
            score: score
        };
    }
    Disconnect() {
        this.connection.close(1000, "game end");
    }
    GetPreGameInfo() {
        return {
            "id": this.id,
            "name": this.name,
            "isConnected": this.IsConnected
        };
    }
    GetInfo(privateInfo) {
        const info = {
            "user": this.GetUserPublicData(),
            "isPlayerDisconnected": this.IsConnected,
            "isKing": this.isKing,
            "isHeroPickTurnMade": this.isHeroPickTurnMade,
            "isInitialHeroTurnMade": this.isInitialHeroTurnMade,
            "isBuildTurnMade": this.isBuildTurnMade,
            "isAbilityTurnMade": this.isAbilityTurnMade,
            "isMyTurn": !!this.heroesWeightToPickFrom ||
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
            if (!!this.heroWeight)
                info["pickedHeroWeight"] = this.heroWeight;
            if (!!this.heroesWeightToPickFrom)
                info["heroesWeightToPickFrom"] = this.heroesWeightToPickFrom;
            if (!!this.initialTurnOptionsToPickFrom)
                info["initialTurnOptionsToPickFrom"] = this.initialTurnOptionsToPickFrom;
            if (!!this.initialTurnCardsToPickFrom)
                info["initialTurnCardsToPickFrom"] = this.initialTurnCardsToPickFrom;
            if (typeof this.buildLimit !== "undefined")
                info["buildLimit"] = this.buildLimit + this.additionalBuildLimit;
        }
        if (this.isInitialHeroTurnMade)
            info["pickedHeroWeight"] = this.heroWeight;
        if (!!this.abilityTurnType)
            info["abilityTurnType"] = this.abilityTurnType;
        return info;
    }
    InformAboutPlayerDisconnected(playerId) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.PlayerDisconnected(playerId)));
    }
    InformAboutPlayerInitialConnected(playerInfo) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.PlayerInitialConnection(playerInfo)));
    }
    InformAboutPlayerConnected(playerId) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.PlayerConnected(playerId)));
    }
    InformAboutPreGameInfo(playersInfo, playersCount) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.PreGameInfo(playersInfo, playersCount)));
    }
    InformAboutTable(gameTable) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.TableInfo(gameTable)));
    }
    InformAboutHeroPickTurnStart(heroesShiftedWeight, heroesWeightLeft, playerIdTurn) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.HeroPickTurnStart(heroesShiftedWeight, heroesWeightLeft, playerIdTurn)));
    }
    InformAboutPickHeroTurn(playerIdTurn, heroesWeightLeft) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.PrickHero(playerIdTurn, heroesWeightLeft)));
    }
    InformAboutInitialHeroTurn(heroWeight, playerId) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.HeroInitialTurnStarted(heroWeight, playerId, this.initialTurnOptionsToPickFrom)));
    }
    InformAboutBuildTurnStart(heroWeight, playerId, buildLimit) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.HeroBuildTurnStarted(heroWeight, playerId, buildLimit)));
    }
    InformAboutHeroAbilityTurnStart(abilityType, playerId) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.HeroAbilityTurnStarted(abilityType, playerId)));
    }
    InformAboutPlayerBuiltDistrict(playerId, cardInfo) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.DistrictBuilt(playerId, cardInfo)));
    }
    InformAboutPlayerDistrictDestroyed(playerId, cardInGameId) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.DistrictDestroyed(playerId, cardInGameId)));
    }
    InformAboutPlayerReceivedGold(playerId, count) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.PlayerReceivedGold(playerId, count)));
    }
    InformAboutPlayerReceivedCard(playerId, card) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.PlayerReceivedCard(playerId, card)));
    }
    InformAboutPlayerHandChanged(playerId, newHandLength, hand) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.PlayerHandChanged(playerId, newHandLength, hand)));
    }
    InformAboutChatMessage(message) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.ChatMessage(message)));
    }
    InformAboutMoveToPickOneOfProposedCards(cards) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.PickOneOfProposedCards(cards)));
    }
    InformAboutGameEnd(scoreTable) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.GameEnd(scoreTable)));
    }
    InformAboutDebuffAddedToHero(heroWeight, debuffType, fromPlayerId) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informGameMassages_1.GetGameMessage.DebuffAddedToHero(heroWeight, debuffType, fromPlayerId)));
    }
}
exports.Player = Player;
