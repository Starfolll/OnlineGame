"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hero_1 = require("../hero");
class King extends hero_1.Hero {
    constructor() {
        super(...arguments);
        this.id = 4;
        this.name = "King";
        this.weight = 4;
        this.description = "";
        this.abilityType = undefined;
        this.buffs = ["goldForYellowDistricts", "king"];
        this.debuffs = [];
    }
    ResetBuffs() {
        this.buffs = ["goldForYellowDistricts", "king"];
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
exports.King = King;
