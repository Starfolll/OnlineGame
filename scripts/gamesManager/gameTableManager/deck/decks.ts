import {Card} from "./card";
import {Tavern} from "./grayCards/Tavern";

export class Decks {
    static get defaultDeck(): Array<Card> {
        const cards: Array<Card> = [];

        let cardGameId = 0;

        for (let i = 0; i < 1; i++) cards.push(new Tavern(cardGameId++));

        return cards;
    }
}
