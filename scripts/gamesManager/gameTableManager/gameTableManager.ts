import WebSocket from "ws";
import {GameTable} from "./gameTable";
import {Hero} from "./heroesStacks/hero";
import {Player} from "../player/player";
import {IsMessageValid} from "../player/communicationWithPlayer/responseMessages";
import {Card} from "./deck/card";
import {playerTurnResponse} from "../player/communicationWithPlayer/responseMessagesTypes";


export class GameTableManager extends GameTable {
    constructor(
        tableId: number,
        playersId: Set<number>,
        cards: Array<Card>,
        heroes: { [heroWeight: number]: Hero },
        onGameEndCallback: (tableId: number) => void
    ) {
        super(tableId, playersId, cards, heroes, onGameEndCallback);
    }


    public ConnectPlayer(player: Player): void {
        if (!this.IsPlayerCanBeConnected(player)) return;

        this.AttachPlayerOnMessageSend(player);
        this.AttachPlayerOnDisconnected(player);

        if (this.IsAllPlayersConnected() && !this.isGameStarted) {
            this.InitiateGame();
            this.StartGame();
        }
    }


    private AttachPlayerOnMessageSend(player: Player): void {
        const playerId = player.playerId;
        const onMessageHandler = (event: { data: any; type: string; target: WebSocket }): void => {
            this.ReadPlayerResponse(playerId, event.data);
        };

        player.Connection.addEventListener("message", onMessageHandler);
    }

    private AttachPlayerOnDisconnected(player: Player): void {
        const onDisconnected = (event: { wasClean: boolean; code: number; reason: string; target: WebSocket }): void => {
            this.SetPlayerDisconnected(player.playerId);
        };

        player.Connection.addEventListener("close", onDisconnected);
    }


    private ReadPlayerResponse(playerId: number, message: string): void {
        if (this.isGameEnd) return;

        try {
            let messageBody = JSON.parse(message);

            if (!messageBody["messageType"]) return;
            const messageType = messageBody["messageType"];

            console.log(messageBody);

            switch (messageType) {
                case playerTurnResponse.heroPicked:
                    this.PlayHeroPickTurn(playerId, messageBody);
                    break;

                case playerTurnResponse.initialHeroTurnOptionPicked:
                    this.PlayInitialHeroTurnOption(playerId, messageBody);
                    break;

                case playerTurnResponse.initialHeroCardPicked:
                    this.PlayInitialHeroCard(playerId, messageBody);
                    break;

                case playerTurnResponse.heroAbilityUsed:
                    this.PlayerHeroAbility(playerId, messageBody);
                    break;

                case playerTurnResponse.buildDistrict:
                    this.PlayBuildDistrict(playerId, messageBody);
                    break;

                case playerTurnResponse.buildTurnMade:
                    this.PlayEndOfBuildTurn(playerId, messageBody);
                    break;

                case playerTurnResponse.chatMessage:
                    break;
            }

        } catch (e) {

        }
    }


    private PlayHeroPickTurn(playerId: number, messageBody: any): void {
        const validMessage = IsMessageValid.GetValidHeroPickedMessage(messageBody);
        if (!validMessage) return;

        if (this.IsPlayerCanPickHero(playerId, validMessage.heroWeight))
            this.AttachHeroToPlayer(playerId, validMessage.heroWeight);
    }

    private PlayInitialHeroTurnOption(playerId: number, messageBody: any): void {
        const validMessage = IsMessageValid.GetValidInitialHeroTurnOptionPicked(messageBody);
        if (!validMessage) return;

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

    private PlayInitialHeroCard(playerId: number, messageBody: any): void {
        const validMessage = IsMessageValid.GetValidInitialHeroCardPicked(messageBody);
        if (!validMessage) return;

        if (this.IsPlayerCanPickHeroInitialCard(playerId, validMessage.cardInGameId))
            this.HeroPickedInitialTurnCard(playerId, validMessage.cardInGameId);
    }

    private PlayerHeroAbility(playerId: number, messageBody: any): void {
        const validMessage = IsMessageValid.GetValidHeroAbilityUsed(messageBody);
        if (!validMessage) return;

        if (this.IsPlayerCanUseHeroAbility(playerId, validMessage.abilityData))
            this.UsePlayerHeroAbility(playerId, validMessage.abilityData);
    }

    private PlayBuildDistrict(playerId: number, messageBody: any): void {
        const validMessage = IsMessageValid.GetValidBuiltDistrict(messageBody);
        if (!validMessage) return;

        if (this.IsPlayerCanBuildDistrict(playerId, validMessage.cardInGameId))
            this.PlayerBuildDistrict(playerId, validMessage.cardInGameId);
    }

    private PlayEndOfBuildTurn(playerId: number, messageBody: any): void {
        const validMessage = IsMessageValid.GetValidBuildTurnMade(messageBody);
        if (!validMessage) return;

        if (this.PlayerCanEndBuildTurn(playerId))
            this.EndPlayerBuildTurn(playerId);
    }
}