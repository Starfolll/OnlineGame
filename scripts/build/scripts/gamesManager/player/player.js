"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const informMassages_1 = require("./communicationWithPlayer/informMassages");
class Player {
    constructor(playerId, name, token, tableId, connection) {
        this.isPlayerDisconnected = false;
        this.isKing = false;
        this.isHeroPickTurnMade = false;
        this.isInitialHeroTurnMade = false;
        this.isBuildTurnMade = false;
        this.heroPickTurnNumber = undefined;
        this.heroPickInitialTurnNumber = undefined;
        this.heroesWeightToPickFrom = undefined;
        this.initialTurnOptionsToPickFrom = undefined;
        this.initialTurnCardsToPickFrom = undefined;
        this.buildLimit = undefined;
        this.hand = [];
        this.heroWeight = undefined;
        this.gold = 0;
        this.placedCards = [];
        this.maxSameCardsAmount = 10;
        this.playerId = playerId;
        this.name = name;
        this.token = token;
        this.tableId = tableId;
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
    SetBuildTurnMade() {
        this.buildLimit = undefined;
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
            this.initialTurnCardsToPickFrom.some(c => {
                return c.gameId === cardInGameId && this.HasEnoughGold(c.cost);
            });
    }
    IsDistrictBuildCanBeMade(cardInGameId) {
        return !!this.buildLimit &&
            this.hand.some(c => c.gameId === cardInGameId) &&
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
        this.hand.filter(c => {
            if (c.gameId === cardInGameId) {
                card = c;
                return true;
            }
            return false;
        });
        return card;
    }
    GetScore() {
        let score = 0;
        this.placedCards.forEach(c => score += c.cost);
        return {
            isWinner: false,
            place: 0,
            playerId: this.playerId,
            score: score
        };
    }
    Disconnect() {
        this.connection.close(1000, "game end");
    }
    GetPreGameInfo() {
        return {
            "id": this.playerId,
            "name": this.name,
            "isConnected": this.IsConnected
        };
    }
    GetInfo(privateInfo) {
        const info = {
            "id": this.playerId,
            "name": this.name,
            "isPlayerDisconnected": this.IsConnected,
            "isKing": this.isKing,
            "isHeroPickTurnMade": this.isHeroPickTurnMade,
            "isInitialHeroTurnMade": this.isInitialHeroTurnMade,
            "isBuildTurnMade": this.isBuildTurnMade,
            "isMyTurn": !!this.heroesWeightToPickFrom ||
                !!this.initialTurnOptionsToPickFrom ||
                !!this.initialTurnCardsToPickFrom ||
                !!this.buildLimit,
            "heroPickTurnNumber": this.heroPickTurnNumber,
            "heroPickInitialTurnNumber": this.heroPickInitialTurnNumber,
            "heroesWeightToPickFrom": this.heroesWeightToPickFrom,
            "initialTurnOptionsToPickFrom": this.initialTurnOptionsToPickFrom,
            "initialTurnCardsToPickFrom": this.initialTurnCardsToPickFrom,
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
            if (!!this.buildLimit)
                info["buildLimit"] = this.buildLimit;
        }
        return info;
    }
    InformAboutPlayerDisconnected(playerId) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informMassages_1.GetMessage.PlayerDisconnected(playerId)));
    }
    InformAboutPlayerInitialConnected(playerInfo) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informMassages_1.GetMessage.PlayerInitialConnection(playerInfo)));
    }
    InformAboutPlayerConnected(playerId) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informMassages_1.GetMessage.PlayerConnected(playerId)));
    }
    InformAboutPreGameInfo(playersInfo, playersCount) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informMassages_1.GetMessage.PreGameInfo(playersInfo, playersCount)));
    }
    InformAboutTable(gameTable) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informMassages_1.GetMessage.TableInfo(gameTable)));
    }
    InformAboutHeroPickTurnStart(heroesShiftedWeight, heroesWeightLeft, playerIdTurn) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informMassages_1.GetMessage.HeroPickTurnStart(heroesShiftedWeight, heroesWeightLeft, playerIdTurn)));
    }
    InformAboutPickHeroTurn(playerIdTurn, heroesWeightLeft) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informMassages_1.GetMessage.PrickHero(playerIdTurn, heroesWeightLeft)));
    }
    InformAboutInitialHeroTurn(heroWeight, playerId) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informMassages_1.GetMessage.HeroInitialTurnStarted(heroWeight, playerId, this.initialTurnOptionsToPickFrom)));
    }
    InformAboutBuildTurnStart(heroWeight, playerId) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informMassages_1.GetMessage.HeroBuildTurnStarted(heroWeight, playerId)));
    }
    InformAboutPlayerBuiltDistrict(playerId, cardInfo) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informMassages_1.GetMessage.PlayerBuiltDistrict(playerId, cardInfo)));
    }
    InformAboutPlayerReceivedGold(playerId, count) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informMassages_1.GetMessage.PlayerReceivedGold(playerId, count)));
    }
    InformAboutPlayerReceivedCard(playerId, card) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informMassages_1.GetMessage.PlayerReceivedCard(playerId, card)));
    }
    InformAboutMoveToPickOneOfProposedCards(cards) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informMassages_1.GetMessage.PickOneOfProposedCards(cards)));
    }
    InformAboutGameEnd(scoreTable) {
        if (this.IsConnected)
            this.connection.send(JSON.stringify(informMassages_1.GetMessage.GameEnd(scoreTable)));
    }
}
exports.Player = Player;
