"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../card");
class Tavern extends card_1.Card {
    constructor() {
        super(...arguments);
        this.id = 0;
        this.cardClass = "orange";
        this.cost = 1;
        this.name = "Tavern";
        this.description = "";
    }
}
exports.Tavern = Tavern;
