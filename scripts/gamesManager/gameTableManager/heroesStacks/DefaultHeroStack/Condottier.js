"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hero_1 = require("../hero");
const GetValidUserMassage = (message) => {
    if (typeof message !== "object")
        return undefined;
    if (!message["messageType"] && message["messageType"] !== "districtDestroyed")
        return undefined;
    if (!message["playerId"] && typeof message["playerId"] !== "number")
        return undefined;
    if (!message["districtInGameId"] && typeof message["districtInGameId"] !== "number")
        return undefined;
    return message;
};
class Condottier extends hero_1.Hero {
    constructor() {
        super(...arguments);
        this.id = 8;
        this.name = "Condottier";
        this.weight = 8;
        this.description = "";
        this.abilityType = "destroyDistrict";
        this.buffs = ["goldForRedDistricts"];
        this.debuffs = [];
    }
    ResetBuffs() {
        this.buffs = ["goldForRedDistricts"];
    }
    ResetDebuffs() {
        this.debuffs = [];
    }
    IsPlayerCanMakeAbilityMove(message, playerId, players, heroes, deck) {
        const validMessage = GetValidUserMassage(message);
        if (!validMessage)
            return false;
        if (validMessage.playerId === "null")
            return true;
        const player = players.GetPlayerWithId(playerId);
        const playerToDestroy = players.GetPlayerWithId(validMessage.playerId);
        if (!this.IsPlayerCanUseAbility(player))
            return false;
        if (!playerToDestroy)
            return false;
        if (!playerToDestroy.placedCards.some(c => c.gameId === validMessage.districtInGameId && player.HasEnoughGold(c.cost - 1)))
            return false;
        return playerToDestroy.placedCards.some(c => c.gameId === validMessage.districtInGameId);
    }
    CastPlayerAbility(message, playerId, players, heroes, deck) {
        const validMessage = GetValidUserMassage(message);
        if (validMessage.playerId === "null")
            return;
        players.GetPlayerWithId(validMessage.playerId).placedCards
            .forEach(c => {
            if (c.gameId === validMessage.districtInGameId)
                players.GivePlayerGold(playerId, -c.cost, false);
        });
        players.DestroyPlayerDistrict(validMessage.playerId, validMessage.districtInGameId);
        players.InformPlayersAboutDistrictDestroyed(validMessage.playerId, validMessage.districtInGameId);
    }
}
exports.Condottier = Condottier;
