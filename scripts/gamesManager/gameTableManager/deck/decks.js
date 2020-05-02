"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tavern_1 = require("./grayCards/Tavern");
class Decks {
    static get defaultDeck() {
        const cards = [];
        let cardGameId = 0;
        for (let i = 0; i < 1; i++)
            cards.push(new Tavern_1.Tavern(cardGameId++));
        return cards;
    }
}
exports.Decks = Decks;
