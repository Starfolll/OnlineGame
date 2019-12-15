import {Card, cardClass} from "../card";

export class Tavern extends Card {
    readonly id: number = 0;
    readonly cardClass: cardClass = "all";
    readonly cost: number = 1;
    readonly name: string = "Tavern";
    readonly description: string = "";
}