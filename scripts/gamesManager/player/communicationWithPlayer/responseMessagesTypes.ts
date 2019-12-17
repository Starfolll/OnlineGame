export enum playerTurnResponse {
    heroPicked = "heroPicked",
    initialHeroTurnOptionPicked = "initialHeroTurnOptionPicked",
    initialHeroCardPicked = "initialHeroCardPicked",
    buildDistrict = "buildDistrict",
    buildTurnMade = "buildTurnMade",
    chatMessage = "chatMessage",
    heroAbilityUsed = "heroAbilityUsed",
}


export type playerInitialConnection = {
    messageType: string;
    name: string;
    token: string;
    id: number;
    tableId: number;
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

export type builtDistrict = {
    messageType: string;
    cardInGameId: number;
}

export type buildTurnMade = {
    messageType: string;
}