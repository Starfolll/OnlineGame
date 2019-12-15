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
        this.buffs = ["goldForYellowDistricts"];
        this.debuffs = [];
    }
    ResetBuffs() {
        this.buffs = ["goldForYellowDistricts"];
    }
    ResetDebuffs() {
        this.debuffs = [];
    }
}
exports.King = King;
