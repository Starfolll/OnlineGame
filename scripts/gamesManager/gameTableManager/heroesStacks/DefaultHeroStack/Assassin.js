"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hero_1 = require("../hero");
const GetValidUserMassage = (message) => {
    if (typeof message !== "object")
        return undefined;
    if (!message["messageType"] && message["messageType"] !== "heroKilled")
        return undefined;
    if (!message["killedHeroWeight"] && typeof message["killedHeroWeight"] !== "number")
        return undefined;
    return message;
};
class Assassin extends hero_1.Hero {
    constructor() {
        super(...arguments);
        this.id = 1;
        this.name = "Assassin";
        this.weight = 1;
        this.description = "";
        this.abilityType = "disableHero";
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
        if (!heroes.allHeroes.some(h => h.weight === validMessage.killedHeroWeight))
            return false;
        if (validMessage.killedHeroWeight <= this.weight)
            return false;
        return heroes.allHeroes.some(h => validMessage.killedHeroWeight === h.weight);
    }
    CastPlayerAbility(message, playerId, players, heroes, deck) {
        const validMessage = GetValidUserMassage(message);
        heroes.ApplyDebuffOnHero(validMessage.killedHeroWeight, "killed", playerId);
        players.InformAboutDebuffAddedToHero(validMessage.killedHeroWeight, "killed", playerId);
    }
}
exports.Assassin = Assassin;
