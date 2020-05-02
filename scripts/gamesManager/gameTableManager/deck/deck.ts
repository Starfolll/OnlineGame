import {Card} from "./card";

export class Deck {
    private readonly cards: Array<Card>;
    private readonly maxCardsInDeck: number;


    constructor(cards: Array<Card>) {
        this.cards = cards;
        this.maxCardsInDeck = cards.length;
    }


    public Shuffle(): void {
        this.cards.sort(c => Math.random() - 0.5);
    }


    get cardsLeft(): number {
        return this.cards.length;
    }


    public IsAnyCardsLeft(): boolean {
        return this.cards.length > 0;
    }

    public GetTopCard(): Card | undefined {
        return this.cards.shift();
    }

    public PushCard(card: Card): void {
        this.cards.push(card);
    }
}