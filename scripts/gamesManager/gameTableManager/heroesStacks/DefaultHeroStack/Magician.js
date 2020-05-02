"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hero_1 = require("../hero");
const GetValidUserMassage = (message) => {
    if (typeof message !== "object")
        return undefined;
    if (!message["messageType"] && message["messageType"] !== "changeHand")
        return undefined;
    if (!message["playerId"] && typeof message["playerId"] !== "string")
        return undefined;
    return message;
};
class Magician extends hero_1.Hero {
    constructor() {
        super(...arguments);
        this.id = 3;
        this.name = "Magician";
        this.weight = 3;
        this.description = "";
        this.abilityType = "changeHand";
        this.buffs = [];
        this.debuffs = [];
    }
    ResetBuffs() {
        this.buffs = [];
    }
    ResetDebuffs() {
        this.debuffs = [];
    }
    IsPlayerCanMakeAbilityMove(message, playerId, players, heroes, deck) {
        const validMessage = GetValidUserMassage(message);
        if (!validMessage)
            return false;
        if (!this.IsPlayerCanUseAbility(players.GetPlayerWithId(playerId)))
            return false;
        return players.playersId.has(validMessage.playerId);
    }
    CastPlayerAbility(message, playerId, players, heroes, deck) {
        const validMessage = GetValidUserMassage(message);
        if (validMessage.playerId !== playerId) {
            const player1Hand = players.GetPlayerWithId(playerId).hand;
            const player2Hand = players.GetPlayerWithId(validMessage.playerId).hand;
            players.SetPlayerHand(playerId, player2Hand);
            players.SetPlayerHand(validMessage.playerId, player1Hand);
        }
        else {
            const card = deck.GetTopCard();
            if (!!card)
                players.GivePlayerCard(playerId, card);
        }
    }
}
exports.Magician = Magician;
