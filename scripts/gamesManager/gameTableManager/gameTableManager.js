"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gameTable_1 = require("./gameTable");
const responseGameMessages_1 = require("../players/communicationWithPlayer/responseGameMessages");
const responseGameMessages_types_1 = require("../players/communicationWithPlayer/responseGameMessages.types");
class GameTableManager extends gameTable_1.GameTable {
    constructor(table, cards, heroes, onGameEndCallback) {
        super(table, cards, heroes, onGameEndCallback);
    }
    ConnectPlayer(player) {
        if (!this.IsPlayerCanBeConnected(player))
            return;
        this.AttachPlayerOnMessageSend(player);
        this.AttachPlayerOnDisconnected(player);
        if (this.IsAllPlayersConnected() && !this.isGameStarted) {
            this.InitiateGame();
            this.StartGame();
        }
    }
    AttachPlayerOnMessageSend(player) {
        const onMessageHandler = (event) => {
            this.ReadPlayerResponse(player.id, event.data);
        };
        player.Connection.addEventListener("message", onMessageHandler);
    }
    AttachPlayerOnDisconnected(player) {
        const onDisconnected = (event) => {
            this.SetPlayerDisconnected(player.id);
        };
        player.Connection.addEventListener("close", onDisconnected);
    }
    ReadPlayerResponse(playerId, message) {
        if (this.isGameEnd)
            return;
        try {
            let messageBody = JSON.parse(message);
            if (!messageBody["messageType"])
                return;
            const messageType = messageBody["messageType"];
            console.log(messageBody);
            switch (messageType) {
                case responseGameMessages_types_1.playerTurnResponse.heroPicked:
                    this.PlayHeroPickTurn(playerId, messageBody);
                    break;
                case responseGameMessages_types_1.playerTurnResponse.initialHeroTurnOptionPicked:
                    this.PlayInitialHeroTurnOption(playerId, messageBody);
                    break;
                case responseGameMessages_types_1.playerTurnResponse.initialHeroCardPicked:
                    this.PlayInitialHeroCard(playerId, messageBody);
                    break;
                case responseGameMessages_types_1.playerTurnResponse.heroAbilityUsed:
                    this.PlayerHeroAbility(playerId, messageBody);
                    break;
                case responseGameMessages_types_1.playerTurnResponse.buildDistrict:
                    this.PlayBuildDistrict(playerId, messageBody);
                    break;
                case responseGameMessages_types_1.playerTurnResponse.buildTurnMade:
                    this.PlayEndOfBuildTurn(playerId, messageBody);
                    break;
                case responseGameMessages_types_1.playerTurnResponse.chatMessage:
                    this.PlaySendChatMessage(playerId, messageBody);
                    break;
            }
        }
        catch (e) {
        }
    }
    PlayHeroPickTurn(playerId, messageBody) {
        const validMessage = responseGameMessages_1.IsGameMessageValid.GetValidHeroPickedMessage(messageBody);
        if (!validMessage)
            return;
        if (this.IsPlayerCanPickHero(playerId, validMessage.heroWeight))
            this.AttachHeroToPlayer(playerId, validMessage.heroWeight);
    }
    PlayInitialHeroTurnOption(playerId, messageBody) {
        const validMessage = responseGameMessages_1.IsGameMessageValid.GetValidInitialHeroTurnOptionPicked(messageBody);
        if (!validMessage)
            return;
        if (this.IsPlayerCanPickHeroInitialOptions(playerId, validMessage.pickedOption))
            switch (validMessage.pickedOption) {
                case "gold":
                    this.HeroPickedInitialTurnOptionGold(playerId);
                    break;
                case "cards":
                    this.HeroPickedInitialTurnOptionCards(playerId);
                    break;
            }
    }
    PlayInitialHeroCard(playerId, messageBody) {
        const validMessage = responseGameMessages_1.IsGameMessageValid.GetValidInitialHeroCardPicked(messageBody);
        if (!validMessage)
            return;
        if (this.IsPlayerCanPickHeroInitialCard(playerId, validMessage.cardInGameId))
            this.HeroPickedInitialTurnCard(playerId, validMessage.cardInGameId);
    }
    PlayerHeroAbility(playerId, messageBody) {
        const validMessage = responseGameMessages_1.IsGameMessageValid.GetValidHeroAbilityUsed(messageBody);
        if (!validMessage)
            return;
        if (this.IsPlayerCanUseHeroAbility(playerId, validMessage.abilityData))
            this.UsePlayerHeroAbility(playerId, validMessage.abilityData);
    }
    PlayBuildDistrict(playerId, messageBody) {
        const validMessage = responseGameMessages_1.IsGameMessageValid.GetValidBuiltDistrict(messageBody);
        if (!validMessage)
            return;
        if (this.IsPlayerCanBuildDistrict(playerId, validMessage.cardInGameId))
            this.PlayerBuildDistrict(playerId, validMessage.cardInGameId);
    }
    PlayEndOfBuildTurn(playerId, messageBody) {
        const validMessage = responseGameMessages_1.IsGameMessageValid.GetValidBuildTurnMade(messageBody);
        if (!validMessage)
            return;
        if (this.PlayerCanEndBuildTurn(playerId))
            this.EndPlayerBuildTurn(playerId);
    }
    PlaySendChatMessage(playerId, messageBody) {
        const validMessage = responseGameMessages_1.IsGameMessageValid.GetValidChatMessage(messageBody, 120);
        if (!validMessage)
            return;
        this.AddChatMessage(playerId, validMessage.message);
    }
}
exports.GameTableManager = GameTableManager;
