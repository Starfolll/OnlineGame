"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Hero {
    constructor() {
        this.buffs = [];
        this.debuffs = [];
    }
    get isDead() {
        return this.debuffs.some(d => d.debuffType === "killed");
    }
    GetInfo() {
        return {
            id: this.id,
            name: this.name,
            weight: this.weight,
            description: this.description,
            ability: this.abilityType,
            buffs: this.buffs,
            debuffs: this.debuffs
        };
    }
    AddBuff(buff) {
        this.buffs.push(buff);
    }
    AddDebuff(debuff, fromPlayerId, additionalData) {
        this.debuffs.push({
            "debuffType": debuff,
            "fromPlayerId": fromPlayerId,
            "additionData": additionalData
        });
    }
    HasAbility() {
        console.log(this.abilityType);
        return !!this.abilityType;
    }
    IsPlayerCanUseAbility(player) {
        return player.abilityTurnType === this.abilityType;
    }
    InvokeDebuffs(playerId, players, heroes, deck) {
        this.debuffs.forEach(debuff => {
            switch (debuff.debuffType) {
                case "robbed":
                    const gold = players.GetPlayerWithId(playerId).gold;
                    players.GivePlayerGold(playerId, -gold);
                    players.GivePlayerGold(debuff.fromPlayerId, gold);
                    break;
                case "killed":
                    break;
            }
        });
    }
    InvokeBuffs(playerId, players, heroes, deck) {
        this.buffs.forEach(buff => {
            switch (buff) {
                case "instanceGold":
                    players.GivePlayerGold(playerId, 1);
                    break;
                case "goldForGreenDistricts":
                    players.AddGoldToPlayerForEachCardClass(playerId, "green");
                    break;
                case "goldForBlueDistricts":
                    players.AddGoldToPlayerForEachCardClass(playerId, "blue");
                    break;
                case "goldForRedDistricts":
                    players.AddGoldToPlayerForEachCardClass(playerId, "red");
                    break;
                case "goldForYellowDistricts":
                    players.AddGoldToPlayerForEachCardClass(playerId, "yellow");
                    break;
                case "instanceCard":
                    const card = deck.GetTopCard();
                    if (!!card)
                        players.GivePlayerCard(playerId, card);
                    break;
                case "king":
                    players.SetPlayerKing(playerId);
                    break;
                case "overBuild":
                    players.AddBuildLimitToPlayer(playerId, 2);
                    break;
            }
        });
    }
}
exports.Hero = Hero;
