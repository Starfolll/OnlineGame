import {playerEndGameScoreTable, playerPreGameInfo} from "../player";
import {tableInfoWithPlayers} from "../players";
import {Card, cardInfo} from "../../gameTableManager/deck/card";
import {
    debuffAddedToHero,
    districtBuilt,
    districtDestroyed,
    gameEnd,
    gameMessage,
    gameTable,
    heroAbilityTurnStarted,
    heroBuildTurnStarted,
    heroInitialTurnStarted,
    heroPickTurnStart,
    pickOneOfProposedCards,
    playerConnected,
    playerDisconnected,
    playerHandChanged,
    playerInitialConnection,
    playerPickingHero,
    playerReceivedCard,
    playerReceivedGold,
    preGameInfo
} from "./informMassagesTypes";
import {heroDebuffsTypes} from "../../gameTableManager/heroesStacks/heroDebuffsTypes";
import {heroAbilityTypes} from "../../gameTableManager/heroesStacks/heroAbilityTypes";
import {gameChatMessageInfo} from "../../../chat/gameChatMessage";


export class GetMessage {
    static PreGameInfo(players: Array<playerPreGameInfo>, playersCount: number): preGameInfo {
        return {
            "messageType": "preGameInfo",
            "players": players,
            "playersCount": playersCount
        }
    }

    static PlayerDisconnected(playerId: string): playerDisconnected {
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

    static PlayerConnected(playerId: string): playerConnected {
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


    static HeroPickTurnStart(heroesShiftedWeight: Array<number>, heroesWeightLeft: Array<number> | undefined, playerIdTurn: string): heroPickTurnStart {
        return {
            "messageType": "heroPickTurnStart",
            "heroesShiftedWeight": heroesShiftedWeight,
            "heroesWeightLeft": heroesWeightLeft,
            "playerIdTurn": playerIdTurn
        }
    }

    static PrickHero(playerIdTurn: string, heroesWeightLeft: Array<number> | undefined): playerPickingHero {
        return {
            "messageType": "prickHero",
            "heroesWeightLeft": heroesWeightLeft,
            "playerIdTurn": playerIdTurn
        }
    }

    static HeroInitialTurnStarted(heroId: number, playerId: string, options: Array<string> | undefined): heroInitialTurnStarted {
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

    static HeroAbilityTurnStarted(abilityType: heroAbilityTypes, playerId: string): heroAbilityTurnStarted {
        return {
            "messageType": "heroAbilityTurnStarted",
            "heroAbilityType": abilityType,
            "playerId": playerId
        }
    }

    static HeroBuildTurnStarted(heroId: number, playerId: string): heroBuildTurnStarted {
        return {
            "messageType": "heroBuildTurnStarted",
            "heroId": heroId,
            "playerId": playerId
        }
    }

    static DistrictBuilt(playerId: string, cardInfo: cardInfo): districtBuilt {
        return {
            "messageType": "playerBuiltDistrict",
            "playerId": playerId,
            "card": cardInfo
        }
    }

    static DistrictDestroyed(playerId: string, cardInGameId: number): districtDestroyed {
        return {
            "messageType": "districtDestroyed",
            "cardInGameId": cardInGameId,
            "playerId": playerId
        }
    }

    static PlayerReceivedGold(playerId: string, count: number): playerReceivedGold {
        return {
            "messageType": "playerReceivedGold",
            "playerId": playerId,
            "count": count
        }
    }

    static PlayerReceivedCard(playerId: string, card: Card | undefined): playerReceivedCard {
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

    static DebuffAddedToHero(heroWeight: number, debuffType: heroDebuffsTypes, fromPlayerId?: string): debuffAddedToHero {
        return {
            "messageType": "debuffAddedToHero",
            "debuffType": debuffType,
            "heroWeight": heroWeight,
            "fromPlayerId": fromPlayerId
        }
    }

    static PlayerHandChanged(playerId: string, newHandLength: number, hand?: Array<Card>): playerHandChanged {
        return {
            "messageType": "playerHandChanged",
            "playerId": playerId,
            "handLength": newHandLength,
            "hand": hand,
        }
    }

    static ChatMessage(message: gameChatMessageInfo): gameMessage {
        return {
            "messageType": "informGameChatMessage",
            "message": message
        }
    }
}