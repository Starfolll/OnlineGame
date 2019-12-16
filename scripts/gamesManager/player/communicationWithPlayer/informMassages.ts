import {playerEndGameScoreTable, playerPreGameInfo} from "../player";
import {tableInfoWithPlayers} from "../players";
import {Card, cardInfo} from "../../gameTableManager/deck/card";
import {
    debuffAddedToHero,
    gameEnd,
    gameTable,
    heroBuildTurnStarted,
    heroInitialTurnStarted,
    heroPickTurnStart,
    pickOneOfProposedCards,
    playerBuiltDistrict,
    playerConnected,
    playerDisconnected,
    playerInitialConnection,
    playerPickingHero,
    playerReceivedCard,
    playerReceivedGold,
    preGameInfo
} from "./informMassagesTypes";
import {heroDebuffsTypes} from "../../gameTableManager/heroesStacks/heroDebuffsTypes";


export class GetMessage {
    static PreGameInfo(players: Array<playerPreGameInfo>, playersCount: number): preGameInfo {
        return {
            "messageType": "preGameInfo",
            "players": players,
            "playersCount": playersCount
        }
    }

    static PlayerDisconnected(playerId: number): playerDisconnected {
        return {
            "messageType": "playerDisconnected",
            "playerId": playerId
        }
    }

    static PlayerInitialConnection(playerInfo: playerPreGameInfo): playerInitialConnection {
        return {
            "messageType": "playerInitialConnection",
            "playerInfo": playerInfo
        }
    }

    static PlayerConnected(playerId: number): playerConnected {
        return {
            "messageType": "playerConnected",
            "playerId": playerId
        }
    }

    static TableInfo(gameTable: tableInfoWithPlayers): gameTable {
        return {
            "messageType": "tableInfo",
            "gameTable": gameTable
        }
    }


    static HeroPickTurnStart(heroesShiftedWeight: Array<number>, heroesWeightLeft: Array<number> | undefined, playerIdTurn: number): heroPickTurnStart {
        return {
            "messageType": "heroPickTurnStart",
            "heroesShiftedWeight": heroesShiftedWeight,
            "heroesWeightLeft": heroesWeightLeft,
            "playerIdTurn": playerIdTurn
        }
    }

    static PrickHero(playerIdTurn: number, heroesWeightLeft: Array<number> | undefined): playerPickingHero {
        return {
            "messageType": "prickHero",
            "heroesWeightLeft": heroesWeightLeft,
            "playerIdTurn": playerIdTurn
        }
    }

    static HeroInitialTurnStarted(heroId: number, playerId: number, options: Array<string> | undefined): heroInitialTurnStarted {
        return {
            "messageType": "heroInitialTurnStarted",
            "heroId": heroId,
            "playerId": playerId,
            "options": options
        }
    }

    static PickOneOfProposedCards(cards: Array<cardInfo>): pickOneOfProposedCards {
        return {
            "messageType": "pickOneOfProposedCards",
            "cards": cards
        }
    }

    static HeroBuildTurnStarted(heroId: number, playerId: number): heroBuildTurnStarted {
        return {
            "messageType": "heroBuildTurnStarted",
            "heroId": heroId,
            "playerId": playerId
        }
    }

    static PlayerBuiltDistrict(playerId: number, cardInfo: cardInfo): playerBuiltDistrict {
        return {
            "messageType": "playerBuiltDistrict",
            "playerId": playerId,
            "card": cardInfo
        }
    }

    static PlayerReceivedGold(playerId: number, count: number): playerReceivedGold {
        return {
            "messageType": "playerReceivedGold",
            "playerId": playerId,
            "count": count
        }
    }

    static PlayerReceivedCard(playerId: number, card: Card | undefined): playerReceivedCard {
        return {
            "messageType": "playerReceivedCard",
            "playerId": playerId,
            "card": card
        }
    }

    static GameEnd(scoreTable: Array<playerEndGameScoreTable>): gameEnd {
        return {
            "messageType": "gameEnd",
            "scoreTable": scoreTable
        }
    }

    static DebuffAddedToHero(heroWeight: number, debuffType: heroDebuffsTypes, fromPlayerId?: number): debuffAddedToHero {
        return {
            "messageType": "debuffAddedToHero",
            "debuffType": debuffType,
            "heroWeight": heroWeight,
            "fromPlayerId": fromPlayerId
        }
    }
}