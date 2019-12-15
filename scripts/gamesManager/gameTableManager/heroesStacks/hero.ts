import {heroDebuffsTypes} from "./heroDebuffsTypes";
import {heroAbilityTypes} from "./heroAbilityTypes";
import {heroBuffsTypes} from "./heroBuffsTypes";
import {Players} from "../../player/players";
import {HeroesStack} from "./heroesStack";
import {Deck} from "../deck/deck";

export type heroInfo = {
    id: number;
    name: string;
    weight: number;
    description: string;
    ability: heroAbilityTypes | undefined;
    buffs: Array<heroBuffsTypes>;
    debuffs: Array<heroDebuffsTypes>;
}

export abstract class Hero {
    public abstract readonly id: number;
    public abstract readonly name: string;
    public abstract readonly weight: number;
    public abstract readonly description: string;

    public abstract readonly abilityType: heroAbilityTypes | undefined;
    public abstract buffs: Array<heroBuffsTypes> = [];
    public abstract debuffs: Array<heroDebuffsTypes> = [];

    get isDead(): boolean {
        return this.debuffs.some(d => d === "killed");
    }

    public GetInfo(): heroInfo {
        return {
            id: this.id,
            name: this.name,
            weight: this.weight,
            description: this.description,
            ability: this.abilityType,
            buffs: this.buffs,
            debuffs: this.debuffs
        }
    }


    public abstract ResetBuffs(): void;

    public abstract ResetDebuffs(): void;


    public ApplyBuff(buff: heroBuffsTypes): void {
        this.buffs.push(buff);
    }

    public ApplyDebuff(debuff: heroDebuffsTypes): void {
        this.debuffs.push(debuff);
    }


    public InvokeDebuffs(playerId: number, players: Players, heroes: HeroesStack, deck: Deck): void {

    }

    public InvokeBuffs(playerId: number, players: Players, heroes: HeroesStack, deck: Deck): void {
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