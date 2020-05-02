import {playerEndGameScoreTable, playerPreGameInfo} from "../player";
import {tableInfoWithPlayers} from "../players";
import {Card, cardInfo} from "../../gameTableManager/deck/card";
import {heroDebuffsTypes} from "../../gameTableManager/heroesStacks/heroDebuffsTypes";
import {heroAbilityTypes} from "../../gameTableManager/heroesStacks/heroAbilityTypes";
import {chatMessageInfo} from "../../../utils/chat/chatMessage";

export type preGameInfo = {
   messageType: string;
   players: Array<playerPreGameInfo>;
   playersCount: number;
}

export type playerDisconnected = {
   messageType: string;
   playerId: string;
};

export type playerInitialConnection = {
   messageType: string;
   playerInfo: playerPreGameInfo;
}

export type playerConnected = {
   messageType: string;
   playerId: string;
};

export type gameTable = {
   messageType: string;
   gameTable: tableInfoWithPlayers;
}

export type heroPickTurnStart = {
   messageType: string;
   heroesShiftedWeight: Array<number>;
   heroesWeightLeft: Array<number> | undefined;
   playerIdTurn: string;
}

export type playerPickingHero = {
   messageType: string;
   heroesWeightLeft: Array<number> | undefined;
   playerIdTurn: string;
}

export type heroInitialTurnStarted = {
   messageType: string;
   heroId: number;
   playerId: string;
   options?: Array<string>
}

export type playerReceivedGold = {
   messageType: string;
   playerId: string;
   count: number;
}

export type playerReceivedCard = {
   messageType: string;
   playerId: string;
   card: Card | undefined;
}

export type pickOneOfProposedCards = {
   messageType: string;
   cards: Array<cardInfo>;
}

export type heroAbilityTurnStarted = {
   messageType: string;
   heroAbilityType: heroAbilityTypes;
   playerId: string;
}

export type heroBuildTurnStarted = {
   messageType: string;
   playerId: string;
   heroId: number;
   buildLimit?: number;
}

export type districtBuilt = {
   messageType: string;
   playerId: string;
   card: cardInfo;
}

export type districtDestroyed = {
   messageType: string;
   playerId: string;
   cardInGameId: number;
}

export type gameEnd = {
   messageType: string;
   scoreTable: Array<playerEndGameScoreTable>;
}

export type debuffAddedToHero = {
   messageType: string;
   debuffType: heroDebuffsTypes;
   heroWeight: number;
   fromPlayerId?: string;
}

export type playerHandChanged = {
   messageType: string;
   playerId: string;
   handLength: number;
   hand?: Array<Card>;
}

export type gameMessage = {
   messageType: string;
   message: chatMessageInfo;
}
