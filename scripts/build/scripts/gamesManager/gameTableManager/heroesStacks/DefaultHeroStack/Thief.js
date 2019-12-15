"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hero_1 = require("../hero");
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
}
exports.Thief = Thief;
