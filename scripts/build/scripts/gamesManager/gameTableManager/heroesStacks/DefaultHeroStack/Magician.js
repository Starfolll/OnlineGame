"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hero_1 = require("../hero");
class Magician extends hero_1.Hero {
    constructor() {
        super(...arguments);
        this.id = 3;
        this.name = "Magician";
        this.weight = 3;
        this.description = "";
        this.abilityType = "changeHand";
        this.buffs = ["instanceCard"];
        this.debuffs = [];
    }
    ResetBuffs() {
        this.buffs = ["instanceCard"];
    }
    ResetDebuffs() {
        this.debuffs = [];
    }
}
exports.Magician = Magician;
