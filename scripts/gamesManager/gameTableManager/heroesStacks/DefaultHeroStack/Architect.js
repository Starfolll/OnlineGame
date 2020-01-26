"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hero_1 = require("../hero");
class Architect extends hero_1.Hero {
    constructor() {
        super(...arguments);
        this.id = 7;
        this.name = "Architect";
        this.weight = 7;
        this.description = "";
        this.abilityType = undefined;
        this.buffs = ["overBuild"];
        this.debuffs = [];
    }
    ResetBuffs() {
        this.buffs = ["overBuild"];
    }
    ResetDebuffs() {
        this.debuffs = [];
    }
    IsPlayerCanMakeAbilityMove(message, playerId, players, heroes, deck) {
        return false;
    }
    CastPlayerAbility(message, playerId, players, heroes, deck) {
    }
}
exports.Architect = Architect;
