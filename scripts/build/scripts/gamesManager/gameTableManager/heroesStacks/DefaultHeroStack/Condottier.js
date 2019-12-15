"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hero_1 = require("../hero");
class Condottier extends hero_1.Hero {
    constructor() {
        super(...arguments);
        this.id = 8;
        this.name = "Condottier";
        this.weight = 8;
        this.description = "";
        this.abilityType = "destroyDistrict";
        this.buffs = ["goldForRedDistricts"];
        this.debuffs = [];
    }
    ResetBuffs() {
        this.buffs = ["goldForRedDistricts"];
    }
    ResetDebuffs() {
        this.debuffs = [];
    }
}
exports.Condottier = Condottier;
