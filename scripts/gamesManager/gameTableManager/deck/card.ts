export type cardClass =
   "yellow" |
   "red" |
   "purple" |
   "blue" |
   "green" |
   "all";

export type cardInfo = {
   id: number;
   name: string;
   cost: number;
   cardClass: cardClass;
   description: string;
   gameId: number;
}

export abstract class Card {
   abstract readonly id: number;
   abstract readonly name: string;
   abstract readonly cost: number;
   abstract readonly cardClass: cardClass;
   abstract readonly description: string;

   public readonly gameId: number;

   constructor(gameId: number) {
      this.gameId = gameId;
   }

   public GetInfo(): cardInfo {
      return {
         "id": this.id,
         "name": this.name,
         "cost": this.cost,
         "cardClass": this.cardClass,
         "description": this.description,
         "gameId": this.gameId
      }
   }
}
