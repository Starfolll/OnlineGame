"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Players {
    constructor(playersIdInGame) {
        this.players = {};
        this.playerPickHeroTurn = -1;
        this.playerHeroWeightTurn = -1;
        this.playersIdInGame = playersIdInGame;
        this.playersIdCount = this.playersIdInGame.size;
    }
    get playersId() {
        return new Set(Object.keys(this.players).map(id => +id));
    }
    get length() {
        return this.playersIdCount;
    }
    GivePlayerCard(playerId, card, announce = true) {
        this.players[playerId].hand.push(card);
        if (announce)
            this.InformPlayersAboutPlayerReceivedCard(playerId, card);
    }
    GivePlayerGold(playerId, count, announce = true) {
        this.players[playerId].gold += count;
        if (announce)
            this.InformPlayersAboutPlayerReceivedGold(playerId, count);
    }
    AttachHeroWeightToPlayer(playerId, heroWeight) {
        this.players[playerId].heroWeight = heroWeight;
        this.players[playerId].SetHeroPickTurnMade();
    }
    ResetTurns() {
        Array.from(this.playersIdInGame).forEach(pId => {
            this.players[pId].ResetTurns();
        });
    }
    RollInitialPlayerTurn() {
        const playersTurns = [];
        for (let i = 0; i < this.playersIdCount; i++)
            playersTurns.push(i + 1);
        playersTurns.sort(() => Math.random() - 0.5);
        this.playersIdInGame.forEach(pId => {
            const turn = playersTurns.shift();
            this.players[pId].heroPickTurnNumber = !!turn ? turn : -1;
            this.players[pId].heroPickInitialTurnNumber = !!turn ? turn : -1;
            if (turn === 1)
                this.players[pId].isKing = true;
        });
        this.playerPickHeroTurn = 0;
    }
    GetKingPlayerId() {
        const playersId = Array.from(this.playersIdInGame.values());
        for (let i = 0; i < playersId.length; i++) {
            if (this.players[playersId[i]].isKing)
                return playersId[i];
        }
        return -1;
    }
    RearrangePlayersTurn() {
        const kingPlayerId = this.GetKingPlayerId();
        const kingPlayerInitialTurnNumber = this.players[kingPlayerId].heroPickInitialTurnNumber;
        const playersId = Array.from(this.playersIdInGame.values());
        for (let i = 0; i < playersId.length; i++) {
            const playerInitialTurnNumber = this.players[playersId[i]].heroPickInitialTurnNumber;
            if (!!playerInitialTurnNumber && !!kingPlayerInitialTurnNumber)
                if (playerInitialTurnNumber < kingPlayerInitialTurnNumber) {
                    this.players[playersId[i]].heroPickTurnNumber =
                        this.length - kingPlayerInitialTurnNumber + 1 + playerInitialTurnNumber;
                }
                else {
                    this.players[playersId[i]].heroPickTurnNumber =
                        playerInitialTurnNumber - kingPlayerInitialTurnNumber + 1;
                }
        }
        this.playerPickHeroTurn = 0;
    }
    SetNextPlayerPickHeroTurn() {
        this.playerPickHeroTurn++;
        if (!Array.from(this.playersIdInGame).some(pId => {
            return this.players[pId].heroPickTurnNumber === this.playerPickHeroTurn;
        }))
            this.playerPickHeroTurn = -1;
    }
    IsPlayerHeroPickTurn(playerId, heroWeight) {
        return this.players[playerId].IsHeroPickTurnCanBeMade(heroWeight);
    }
    GetPlayerIdWithTurnNumber(turnNumber) {
        const playersId = Array.from(this.playersIdInGame);
        for (let i = 0; i < playersId.length; i++) {
            const player = this.players[playersId[i]];
            if (player.heroPickTurnNumber === turnNumber)
                return player.playerId;
        }
        return -1;
    }
    GetPlayerIdWithHeroWeight(weight) {
        const playersId = Array.from(this.playersIdInGame);
        for (let i = 0; i < playersId.length; i++) {
            const player = this.players[playersId[i]];
            if (player.heroWeight === weight)
                return player.playerId;
        }
        return -1;
    }
    IsAllPlayersPickedHero() {
        return this.playerPickHeroTurn === this.playersIdCount;
    }
    GetCurrentHeroWeightTurn() {
        return this.playerHeroWeightTurn;
    }
    GetCurrentPlayerIdTurn() {
        return this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn);
    }
    ResetCurrentHeroTurn() {
        this.playerHeroWeightTurn = -1;
    }
    SetNextHeroTurn() {
        const heroesTurnsLeft = [];
        this.playersIdInGame.forEach(pId => {
            const heroWeight = this.players[pId].heroWeight;
            if (!!heroWeight && heroWeight > this.playerHeroWeightTurn)
                heroesTurnsLeft.push(heroWeight);
        });
        heroesTurnsLeft.sort();
        if (heroesTurnsLeft.length === 0)
            this.playerHeroWeightTurn = -1;
        else
            this.playerHeroWeightTurn = heroesTurnsLeft[0];
    }
    SetHeroInitialTurnOptions(options) {
        const playerIdWithHeroWeight = this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn);
        this.players[playerIdWithHeroWeight].initialTurnOptionsToPickFrom = options;
    }
    RemoveHeroInitialTurnOptionsInPlayer(playerId) {
        this.players[playerId].initialTurnOptionsToPickFrom = undefined;
    }
    IsPlayerCanInitialPickOptionTurn(playerId, option) {
        return this.players[playerId].IsInitialPickOptionTurnCanBeMade(option);
    }
    GivePlayerInitialCardsToChoseFrom(playerId, cards) {
        this.players[playerId].initialTurnCardsToPickFrom = cards;
        this.players[playerId].InformAboutMoveToPickOneOfProposedCards(cards.map(c => c.GetInfo()));
    }
    IsPlayerCanPickHeroInitialCard(playerId, cardInGameId) {
        return this.players[playerId].IsInitialPickCardTurnCanBeMade(cardInGameId);
    }
    GetPlayerChosenCard(playerId, cardInGameId) {
        return this.players[playerId].GetInitialTurnChosenCard(cardInGameId);
    }
    SetPlayerInitialTurnMade(playerId) {
        this.players[playerId].SetInitialTurnMade();
    }
    IsAllPlayersPickedInitialTurnOptions() {
        return Array.from(this.playersIdInGame).every(pId => {
            return this.players[pId].isBuildTurnMade && this.players[pId].isInitialHeroTurnMade;
        });
    }
    SetHeroBuildTurnStart(buildLimit) {
        const playerIdWithHero = this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn);
        this.players[playerIdWithHero].buildLimit = buildLimit;
    }
    IsPlayerCanBuildDistrict(playerId, cardInGameId) {
        return this.players[playerId].IsDistrictBuildCanBeMade(cardInGameId);
    }
    SetPlayerCardBuilt(playerId, cardInGameId) {
        const card = this.players[playerId].RemoveCardFromHand(cardInGameId);
        if (!!card) {
            this.players[playerId].gold -= card.cost;
            this.players[playerId].placedCards.push(card);
            const newBuildLimit = !!this.players[playerId].buildLimit ? this.players[playerId].buildLimit : undefined;
            if (!!newBuildLimit)
                this.players[playerId].buildLimit = newBuildLimit;
            this.InformPlayersAboutPlayerBuiltDistrict(playerId, card.GetInfo());
        }
    }
    IsPlayerCanEndBuildTurn(playerId) {
        return this.players[playerId].IsEndOfBuildTurnCanBeMade();
    }
    EndPlayerBuildTurn(playerId) {
        this.players[playerId].SetBuildTurnMade();
    }
    IsMaxDistrictsWasBuilt() {
        return Array.from(this.playersIdInGame).some(pId => {
            return this.players[pId].IsMaxDistrictsBuilt();
        });
    }
    DisconnectAllPlayers() {
        Object.keys(this.players).forEach(pId => {
            this.players[+pId].Disconnect();
        });
    }
    IsPlayerBelongToGame(player) {
        return this.playersIdInGame.has(player.playerId);
    }
    AddPlayer(player) {
        this.players[player.playerId] = player;
    }
    IsAllPlayerConnected() {
        return Object.keys(this.players).length === this.playersIdCount;
    }
    IsPlayerCreated(player) {
        return Object.keys(this.players).some(pId => {
            const p = this.players[+pId];
            return player.playerId === p.playerId && player.token === p.token && !p.IsConnected;
        });
    }
    ResetPlayerConnection(player) {
        Object.keys(this.players).forEach(pId => {
            const p = this.players[+pId];
            if (p.playerId === player.playerId && p.token === player.token) {
                this.players[+pId].Connection = player.Connection;
            }
        });
    }
    IsPlayerClone(player) {
        return Object.keys(this.players).some(pId => {
            const p = this.players[+pId];
            return (player.playerId === p.playerId && player.token === p.token && p.IsConnected);
        });
    }
    SetPlayerDisconnected(playerId) {
        Object.keys(this.players).forEach(pId => {
            if (this.players[+pId].playerId === playerId)
                this.players[+pId].SetDisconnected();
        });
    }
    InformPlayersAboutInitialPlayerConnection(playerInfo) {
        Object.keys(this.players).forEach(pId => {
            if (+pId !== playerInfo.id)
                this.players[+pId].InformAboutPlayerInitialConnected(playerInfo);
        });
    }
    InformPlayersAboutPlayerConnected(playerId) {
        Object.keys(this.players).forEach(pId => {
            if (+pId !== playerId)
                this.players[+pId].InformAboutPlayerConnected(playerId);
        });
    }
    InformPlayersAboutPlayerDisconnected(playerId) {
        Object.keys(this.players).forEach(pId => {
            if (+pId !== playerId)
                this.players[+pId].InformAboutPlayerDisconnected(playerId);
        });
    }
    InformPlayersAboutGameStart(tableInfo) {
        Array.from(this.playersIdInGame).forEach(pId => {
            this.InformPlayerAboutGameTable(pId, tableInfo);
        });
    }
    InformPlayersAboutHeroPickTurnStart(shiftedHeroesWeight, heroesWeightLeft) {
        const playerTurnId = this.GetPlayerIdWithTurnNumber(this.playerPickHeroTurn);
        Object.keys(this.players).forEach(pId => {
            if (this.players[+pId].playerId === playerTurnId)
                this.players[+pId].heroesWeightToPickFrom = heroesWeightLeft;
            this.players[+pId].InformAboutHeroPickTurnStart(shiftedHeroesWeight, +pId === playerTurnId ? heroesWeightLeft : undefined, playerTurnId);
        });
    }
    InformPlayersAboutPlayerPickingHero(heroesWeightLeft) {
        const playerTurnId = this.GetPlayerIdWithTurnNumber(this.playerPickHeroTurn);
        Object.keys(this.players).forEach(pId => {
            if (this.players[+pId].playerId === playerTurnId)
                this.players[+pId].heroesWeightToPickFrom = heroesWeightLeft;
            this.players[+pId].InformAboutPickHeroTurn(playerTurnId, +pId === playerTurnId ? heroesWeightLeft : undefined);
        });
    }
    InformPlayersAboutNextHeroInitialTurnStart() {
        const playerIdTurn = this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn);
        Array.from(this.playersIdInGame).forEach(pId => {
            this.players[pId].InformAboutInitialHeroTurn(this.playerHeroWeightTurn, playerIdTurn);
        });
    }
    InformPlayersAboutHeroBuildTurnStart() {
        const playerIdTurn = this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn);
        Array.from(this.playersIdInGame).forEach(pId => {
            this.players[pId].InformAboutBuildTurnStart(this.playerHeroWeightTurn, playerIdTurn);
        });
    }
    InformPlayersAboutPlayerBuiltDistrict(playerId, cardInfo) {
        Array.from(this.playersIdInGame).forEach(pId => {
            this.players[pId].InformAboutPlayerBuiltDistrict(playerId, cardInfo);
        });
    }
    InformPlayersAboutPlayerReceivedGold(playerId, count) {
        Array.from(this.playersIdInGame).forEach(pId => {
            this.players[pId].InformAboutPlayerReceivedGold(playerId, count);
        });
    }
    InformPlayersAboutPlayerReceivedCard(playerId, card) {
        Array.from(this.playersIdInGame).forEach(pId => {
            this.players[pId].InformAboutPlayerReceivedCard(playerId, playerId === pId ? card : undefined);
        });
    }
    InformPlayersAboutGameEnd() {
        const playersScore = Array.from(this.playersIdInGame).map(pId => {
            return this.players[pId].GetScore();
        });
        playersScore.sort((a, b) => b.score - a.score);
        for (let i = 0; i < playersScore.length; i++) {
            if (i === 0)
                playersScore[i].isWinner = true;
            playersScore[i].place = i + 1;
        }
        Array.from(this.playersIdInGame).forEach(pId => {
            this.players[pId].InformAboutGameEnd(playersScore);
        });
    }
    InformPlayerAboutPreGameInfo(playerId) {
        this.players[playerId].InformAboutPreGameInfo(Object.keys(this.players).map(pId => {
            return this.players[+pId].GetPreGameInfo();
        }), this.length);
    }
    InformPlayerAboutGameTable(playerId, tableInfo) {
        const player = this.players[playerId];
        const tableInfoWithPlayers = {
            "tableInfo": tableInfo,
            "players": Array.from(this.playersIdInGame).map(pId => {
                return this.players[pId].GetInfo(player.playerId === pId);
            })
        };
        player.InformAboutTable(tableInfoWithPlayers);
    }
}
exports.Players = Players;
