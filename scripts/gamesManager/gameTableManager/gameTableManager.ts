import WebSocket from "ws";
import {GameTable} from "./gameTable";
import {Hero} from "./heroesStacks/hero";
import {Player} from "../players/player";
import {IsGameMessageValid} from "../players/communicationWithPlayer/responseGameMessages";
import {Card} from "./deck/card";
import {playerTurnResponse} from "../players/communicationWithPlayer/responseGameMessages.types";
import {tableData} from "../../models/table/table";


export class GameTableManager extends GameTable {
    constructor(
        table: tableData,
        cards: Array<Card>,
        heroes: { [heroWeight: number]: Hero },
        onGameEndCallback: (tableId: string) => void
    ) {
        super(table, cards, heroes, onGameEndCallback);
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
        const onMessageHandler = (event: { data: any; type: string; target: WebSocket }): void => {
            this.ReadPlayerResponse(player.id, event.data);
        };

        player.Connection.addEventListener("message", onMessageHandler);
    }

    private AttachPlayerOnDisconnected(player: Player): void {
        const onDisconnected = (event: { wasClean: boolean; code: number; reason: string; target: WebSocket }): void => {
            this.SetPlayerDisconnected(player.id);
        };

        player.Connection.addEventListener("close", onDisconnected);
    }


    private ReadPlayerResponse(playerId: string, message: string): void {
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

                case playerTurnResponse.chatMessage:
                    this.PlaySendChatMessage(playerId, messageBody);
                    break;
            }

        } catch (e) {

        }
    }


    private PlayHeroPickTurn(playerId: string, messageBody: any): void {
        const validMessage = IsGameMessageValid.GetValidHeroPickedMessage(messageBody);
        if (!validMessage) return;

        if (this.IsPlayerCanPickHero(playerId, validMessage.heroWeight))
            this.AttachHeroToPlayer(playerId, validMessage.heroWeight);
    }

    private PlayInitialHeroTurnOption(playerId: string, messageBody: any): void {
        const validMessage = IsGameMessageValid.GetValidInitialHeroTurnOptionPicked(messageBody);
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

    private PlayInitialHeroCard(playerId: string, messageBody: any): void {
        const validMessage = IsGameMessageValid.GetValidInitialHeroCardPicked(messageBody);
        if (!validMessage) return;

        if (this.IsPlayerCanPickHeroInitialCard(playerId, validMessage.cardInGameId))
            this.HeroPickedInitialTurnCard(playerId, validMessage.cardInGameId);
    }

    private PlayerHeroAbility(playerId: string, messageBody: any): void {
        const validMessage = IsGameMessageValid.GetValidHeroAbilityUsed(messageBody);
        if (!validMessage) return;

        if (this.IsPlayerCanUseHeroAbility(playerId, validMessage.abilityData))
            this.UsePlayerHeroAbility(playerId, validMessage.abilityData);
    }

    private PlayBuildDistrict(playerId: string, messageBody: any): void {
        const validMessage = IsGameMessageValid.GetValidBuiltDistrict(messageBody);
        if (!validMessage) return;

        if (this.IsPlayerCanBuildDistrict(playerId, validMessage.cardInGameId))
            this.PlayerBuildDistrict(playerId, validMessage.cardInGameId);
        else if (validMessage.cardInGameId === -1 && this.PlayerCanEndBuildTurn(playerId))
           this.EndPlayerBuildTurn(playerId);

    }

    private PlaySendChatMessage(playerId: string, messageBody: any): void {
        const validMessage = IsGameMessageValid.GetValidChatMessage(messageBody, 120);
        if (!validMessage) return;

        this.AddChatMessage(playerId, validMessage.message);
    }
}
