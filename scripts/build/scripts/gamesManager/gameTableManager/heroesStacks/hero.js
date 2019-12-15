"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Hero {
    constructor() {
        this.buffs = [];
        this.debuffs = [];
    }
    get isDead() {
        return this.debuffs.some(d => d === "killed");
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
    ApplyBuff(buff) {
        this.buffs.push(buff);
    }
    ApplyDebuff(debuff) {
        this.debuffs.push(debuff);
    }
    InvokeDebuffs(playerId, players, heroes, deck) {
    }
    InvokeBuffs(playerId, players, heroes, deck) {
        console.log(this.buffs);
        this.buffs.forEach(buff => {
            switch (buff) {
                case "instanceGold":
                    console.log("instanceGold");
                    players.GivePlayerGold(playerId, 1);
                    break;
            }
        });
    }
}
exports.Hero = Hero;
