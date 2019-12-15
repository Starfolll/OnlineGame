"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hero_1 = require("../hero");
class Merchant extends hero_1.Hero {
    constructor() {
        super(...arguments);
        this.id = 6;
        this.name = "Merchant";
        this.weight = 6;
        this.description = "";
        this.abilityType = undefined;
        this.buffs = ["goldForGreenDistricts", "instanceGold"];
        this.debuffs = [];
    }
    ResetBuffs() {
        this.buffs = ["goldForGreenDistricts", "instanceGold"];
    }
    ResetDebuffs() {
        this.debuffs = [];
    }
}
exports.Merchant = Merchant;
