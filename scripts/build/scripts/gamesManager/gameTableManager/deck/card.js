"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Card {
    constructor(gameId) {
        this.gameId = gameId;
    }
    GetInfo() {
        return {
            "id": this.id,
            "name": this.name,
            "cost": this.cost,
            "cardClass": this.cardClass,
            "description": this.description,
            "gameId": this.gameId
        };
    }
}
exports.Card = Card;
