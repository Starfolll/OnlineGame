import {playerEndGameScoreTable, playerPreGameInfo} from "../player";
import {tableInfoWithPlayers} from "../players";
import {Card, cardInfo} from "../../gameTableManager/deck/card";
import {heroDebuffsTypes} from "../../gameTableManager/heroesStacks/heroDebuffsTypes";

export type preGameInfo = {
    messageType: string;
    players: Array<playerPreGameInfo>;
    playersCount: number;
}

export type playerDisconnected = {
    messageType: string;
    playerId: number
};

export type playerInitialConnection = {
    messageType: string;
    playerInfo: playerPreGameInfo;
}

export type playerConnected = {
    messageType: string;
    playerId: number
};

export type gameTable = {
    messageType: string;
    gameTable: tableInfoWithPlayers;
}

export type heroPickTurnStart = {
    messageType: string;
    heroesShiftedWeight: Array<number>;
    heroesWeightLeft: Array<number> | undefined;
    playerIdTurn: number;
}

export type playerPickingHero = {
    messageType: string;
    heroesWeightLeft: Array<number> | undefined;
    playerIdTurn: number;
}

export type heroInitialTurnStarted = {
    messageType: string;
    heroId: number;
    playerId: number;
    options?: Array<string>
}

export type playerReceivedGold = {
    messageType: string;
    playerId: number;
    count: number;
}

export type playerReceivedCard = {
    messageType: string;
    playerId: number;
    card: Card | undefined;
}

export type pickOneOfProposedCards = {
    messageType: string;
    cards: Array<cardInfo>;
}

export type heroBuildTurnStarted = {
    messageType: string;
    playerId: number;
    heroId: number;
}

export type playerBuiltDistrict = {
    messageType: string;
    playerId: number;
    card: cardInfo;
}

export type gameEnd = {
    messageType: string;
    scoreTable: Array<playerEndGameScoreTable>;
}

export type debuffAddedToHero = {
    messageType: string;
    debuffType: heroDebuffsTypes;
    heroWeight: number;
    fromPlayerId?: number;
}