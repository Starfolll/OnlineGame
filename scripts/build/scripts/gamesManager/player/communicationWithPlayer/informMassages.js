"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GetMessage {
    static PreGameInfo(players, playersCount) {
        return {
            "messageType": "preGameInfo",
            "players": players,
            "playersCount": playersCount
        };
    }
    static PlayerDisconnected(playerId) {
        return {
            "messageType": "playerDisconnected",
            "playerId": playerId
        };
    }
    static PlayerInitialConnection(playerInfo) {
        return {
            "messageType": "playerInitialConnection",
            "playerInfo": playerInfo
        };
    }
    static PlayerConnected(playerId) {
        return {
            "messageType": "playerConnected",
            "playerId": playerId
        };
    }
    static TableInfo(gameTable) {
        return {
            "messageType": "tableInfo",
            "gameTable": gameTable
        };
    }
    static HeroPickTurnStart(heroesShiftedWeight, heroesWeightLeft, playerIdTurn) {
        return {
            "messageType": "heroPickTurnStart",
            "heroesShiftedWeight": heroesShiftedWeight,
            "heroesWeightLeft": heroesWeightLeft,
            "playerIdTurn": playerIdTurn
        };
    }
    static PrickHero(playerIdTurn, heroesWeightLeft) {
        return {
            "messageType": "prickHero",
            "heroesWeightLeft": heroesWeightLeft,
            "playerIdTurn": playerIdTurn
        };
    }
    static HeroInitialTurnStarted(heroId, playerId, options) {
        return {
            "messageType": "heroInitialTurnStarted",
            "heroId": heroId,
            "playerId": playerId,
            "options": options
        };
    }
    static PickOneOfProposedCards(cards) {
        return {
            "messageType": "pickOneOfProposedCards",
            "cards": cards
        };
    }
    static HeroBuildTurnStarted(heroId, playerId) {
        return {
            "messageType": "heroBuildTurnStarted",
            "heroId": heroId,
            "playerId": playerId
        };
    }
    static PlayerBuiltDistrict(playerId, cardInfo) {
        return {
            "messageType": "playerBuiltDistrict",
            "playerId": playerId,
            "card": cardInfo
        };
    }
    static PlayerReceivedGold(playerId, count) {
        return {
            "messageType": "playerReceivedGold",
            "playerId": playerId,
            "count": count
        };
    }
    static PlayerReceivedCard(playerId, card) {
        return {
            "messageType": "playerReceivedCard",
            "playerId": playerId,
            "card": card
        };
    }
    static GameEnd(scoreTable) {
        return {
            "messageType": "gameEnd",
            "scoreTable": scoreTable
        };
    }
}
exports.GetMessage = GetMessage;
