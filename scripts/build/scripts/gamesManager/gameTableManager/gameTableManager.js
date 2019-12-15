"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameTable_1 = require("./gameTable");
const responseMessages_1 = require("../player/communicationWithPlayer/responseMessages");
const logGameInfo_1 = __importDefault(require("../../consoleLoger/logGameInfo"));
const responseMessagesTypes_1 = require("../player/communicationWithPlayer/responseMessagesTypes");
class GameTableManager extends gameTable_1.GameTable {
    constructor(tableId, playersId, cards, heroes, onGameEndCallback) {
        super(tableId, playersId, cards, heroes, onGameEndCallback);
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
        const playerId = player.playerId;
        const onMessageHandler = (event) => {
            this.ReadPlayerResponse(playerId, event.data);
        };
        player.Connection.addEventListener("message", onMessageHandler);
    }
    AttachPlayerOnDisconnected(player) {
        const onDisconnected = (event) => {
            this.SetPlayerDisconnected(player.playerId);
            console.log(" | player disconnected : " + player.playerId);
        };
        player.Connection.addEventListener("close", onDisconnected);
    }
    ReadPlayerResponse(playerId, message) {
        try {
            let messageBody = JSON.parse(message);
            if (!messageBody["messageType"])
                return;
            const messageType = messageBody["messageType"];
            logGameInfo_1.default(JSON.stringify(messageBody, null, 2));
            switch (messageType) {
                case responseMessagesTypes_1.playerTurnResponse.heroPicked:
                    if (!this.isGameEnd)
                        this.PlayHeroPickTurn(playerId, messageBody);
                    break;
                case responseMessagesTypes_1.playerTurnResponse.initialHeroTurnOptionPicked:
                    if (!this.isGameEnd)
                        this.PlayInitialHeroTurnOption(playerId, messageBody);
                    break;
                case responseMessagesTypes_1.playerTurnResponse.initialHeroCardPicked:
                    if (!this.isGameEnd)
                        this.PlayInitialHeroCard(playerId, messageBody);
                    break;
                case responseMessagesTypes_1.playerTurnResponse.buildDistrict:
                    if (!this.isGameEnd)
                        this.PlayBuildDistrict(playerId, messageBody);
                    break;
                case responseMessagesTypes_1.playerTurnResponse.buildTurnMade:
                    if (!this.isGameEnd)
                        this.PlayEndOfBuildTurn(playerId, messageBody);
                    break;
                case responseMessagesTypes_1.playerTurnResponse.chatMessage:
                    break;
            }
        }
        catch (e) {
            console.log(e.message);
        }
    }
    PlayHeroPickTurn(playerId, messageBody) {
        const validMessage = responseMessages_1.IsMessageValid.GetValidHeroPickedMessage(messageBody);
        if (!validMessage)
            return;
        if (!this.IsPlayerCanPickHero(playerId, validMessage.heroWeight))
            return;
        this.AttachHeroToPlayer(playerId, validMessage.heroWeight);
    }
    PlayInitialHeroTurnOption(playerId, messageBody) {
        const validMessage = responseMessages_1.IsMessageValid.GetValidInitialHeroTurnOptionPicked(messageBody);
        if (!validMessage)
            return;
        if (!this.IsPlayerCanPickHeroInitialOptions(playerId, validMessage.pickedOption))
            return;
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
        const validMessage = responseMessages_1.IsMessageValid.GetValidInitialHeroCardPicked(messageBody);
        if (!validMessage)
            return;
        if (!this.IsPlayerCanPickHeroInitialCard(playerId, validMessage.cardInGameId))
            return;
        this.HeroPickedInitialTurnCard(playerId, validMessage.cardInGameId);
    }
    PlayBuildDistrict(playerId, messageBody) {
        const validMessage = responseMessages_1.IsMessageValid.GetValidBuiltDistrict(messageBody);
        if (!validMessage)
            return;
        if (!this.IsPlayerCanBuildDistrict(playerId, validMessage.cardInGameId))
            return;
        this.PlayerBuildDistrict(playerId, validMessage.cardInGameId);
    }
    PlayEndOfBuildTurn(playerId, messageBody) {
        const validMessage = responseMessages_1.IsMessageValid.GetValidBuildTurnMade(messageBody);
        if (!validMessage)
            return;
        if (!this.PlayerCanEndBuildTurn(playerId))
            return;
        this.EndPlayerBuildTurn(playerId);
    }
}
exports.GameTableManager = GameTableManager;
