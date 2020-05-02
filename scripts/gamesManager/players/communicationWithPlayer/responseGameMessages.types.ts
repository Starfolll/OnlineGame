export enum playerTurnResponse {
   heroPicked = "heroPicked",
   initialHeroTurnOptionPicked = "initialHeroTurnOptionPicked",
   initialHeroCardPicked = "initialHeroCardPicked",
   buildDistrict = "buildDistrict",
   chatMessage = "chatMessage",
   heroAbilityUsed = "heroAbilityUsed",
}


export type playerInitialConnection = {
   messageType: string;
   token: string;
   id: string;
   tableId: string;
}

export type heroPicked = {
   messageType: string;
   heroWeight: number;
}

export type initialHeroTurnOptions = "gold" | "cards";
export const initialHeroTurnOptions: Set<string> = new Set(["gold", "cards"]);
export type initialHeroTurnOptionPicked = {
   messageType: string;
   pickedOption: initialHeroTurnOptions;
}

export type initialHeroCardPicked = {
   messageType: string;
   cardInGameId: number;
}

export type heroAbilityUsed = {
   messageType: string;
   abilityData: any;
};

export type buildDistrict = {
   messageType: string;
   cardInGameId: number;
}

export type gameChatMessage = {
   messageType: string;
   playerId: string;
   message: string;
}
