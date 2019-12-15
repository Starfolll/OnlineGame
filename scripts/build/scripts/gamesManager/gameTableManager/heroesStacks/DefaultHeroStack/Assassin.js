"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hero_1 = require("../hero");
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
}
exports.Assassin = Assassin;
