"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Assassin_1 = require("./DefaultHeroStack/Assassin");
const Thief_1 = require("./DefaultHeroStack/Thief");
const Magician_1 = require("./DefaultHeroStack/Magician");
const King_1 = require("./DefaultHeroStack/King");
const Bishop_1 = require("./DefaultHeroStack/Bishop");
const Merchant_1 = require("./DefaultHeroStack/Merchant");
const Architect_1 = require("./DefaultHeroStack/Architect");
const Condottier_1 = require("./DefaultHeroStack/Condottier");
class HeroesStacks {
    static get defaultStack() {
        return {
            "1": new Assassin_1.Assassin(),
            "2": new Thief_1.Thief(),
            "3": new Magician_1.Magician(),
            "4": new King_1.King(),
            "5": new Bishop_1.Bishop(),
            "6": new Merchant_1.Merchant(),
            "7": new Architect_1.Architect(),
            "8": new Condottier_1.Condottier(),
        };
    }
}
exports.HeroesStacks = HeroesStacks;
