"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hero_1 = require("../hero");
class Bishop extends hero_1.Hero {
    constructor() {
        super(...arguments);
        this.id = 5;
        this.name = "Bishop";
        this.weight = 5;
        this.description = "";
        this.abilityType = undefined;
        this.buffs = ["goldForBlueDistricts", "untouchable"];
        this.debuffs = [];
    }
    ResetBuffs() {
        this.buffs = ["goldForBlueDistricts", "untouchable"];
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
exports.Bishop = Bishop;
