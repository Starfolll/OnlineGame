"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hero_1 = require("../hero");
const GetValidUserMassage = (message) => {
    if (typeof message !== "object")
        return undefined;
    if (!message["messageType"] && message["messageType"] !== "robbHero")
        return undefined;
    if (!message["heroWeight"] && typeof message["heroWeight"] !== "number")
        return undefined;
    return message;
};
class Thief extends hero_1.Hero {
    constructor() {
        super(...arguments);
        this.id = 2;
        this.name = "Thief";
        this.weight = 2;
        this.description = "";
        this.abilityType = "robbHero";
        this.buffs = [];
        this.debuffs = [];
    }
    ResetBuffs() {
        this.buffs = [];
    }
    ResetDebuffs() {
        this.debuffs = [];
    }
    IsPlayerCanMakeAbilityMove(message, playerId, players, heroes, deck) {
        const validMessage = GetValidUserMassage(message);
        if (!validMessage)
            return false;
        if (!this.IsPlayerCanUseAbility(players.GetPlayerWithId(playerId)))
            return false;
        if (!heroes.allHeroes.some(h => h.weight === validMessage.heroWeight))
            return false;
        return validMessage.heroWeight > this.weight;
    }
    CastPlayerAbility(message, playerId, players, heroes, deck) {
        const validMessage = GetValidUserMassage(message);
        heroes.ApplyDebuffOnHero(validMessage.heroWeight, "robbed", playerId);
    }
}
exports.Thief = Thief;
