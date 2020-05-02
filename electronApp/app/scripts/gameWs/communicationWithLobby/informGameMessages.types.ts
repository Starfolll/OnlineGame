export type initialGameConnection = {
   messageType: string,
   tableId: string
   token: string,
   id: string,
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

export type buildTurnMade = {
   messageType: string;
}
