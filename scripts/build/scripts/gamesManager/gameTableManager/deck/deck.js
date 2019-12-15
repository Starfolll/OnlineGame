"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Deck {
    constructor(cards) {
        this.cards = cards;
        this.maxCardsInDeck = cards.length;
    }
    Shuffle() {
        this.cards.sort(c => Math.random() - 0.5);
    }
    get cardsLeft() {
        return this.cards.length;
    }
    IsAnyCardsLeft() {
        return this.cards.length > 0;
    }
    GetTopCard() {
        return this.cards.shift();
    }
    PushCard(card) {
        this.cards.push(card);
    }
}
exports.Deck = Deck;
