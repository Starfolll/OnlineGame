"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GetGameMessage {
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
    static PickHero(playerIdTurn, heroesWeightLeft) {
        return {
            "messageType": "pickHero",
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
    static HeroAbilityTurnStarted(abilityType, playerId) {
        return {
            "messageType": "heroAbilityTurnStarted",
            "heroAbilityType": abilityType,
            "playerId": playerId
        };
    }
    static HeroBuildTurnStarted(heroId, playerId, buildLimit) {
        return {
            "messageType": "heroBuildTurnStarted",
            "heroId": heroId,
            "playerId": playerId,
            "buildLimit": buildLimit
        };
    }
    static DistrictBuilt(playerId, cardInfo) {
        return {
            "messageType": "playerBuiltDistrict",
            "playerId": playerId,
            "card": cardInfo
        };
    }
    static DistrictDestroyed(playerId, cardInGameId) {
        return {
            "messageType": "districtDestroyed",
            "cardInGameId": cardInGameId,
            "playerId": playerId
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
    static DebuffAddedToHero(heroWeight, debuffType, fromPlayerId) {
        return {
            "messageType": "debuffAddedToHero",
            "debuffType": debuffType,
            "heroWeight": heroWeight,
            "fromPlayerId": fromPlayerId
        };
    }
    static PlayerHandChanged(playerId, newHandLength, hand) {
        return {
            "messageType": "playerHandChanged",
            "playerId": playerId,
            "handLength": newHandLength,
            "hand": hand,
        };
    }
    static ChatMessage(message) {
        return {
            "messageType": "informGameChatMessage",
            "message": message
        };
    }
}
exports.GetGameMessage = GetGameMessage;
