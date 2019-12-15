import {Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroDebuffsTypes} from "../heroDebuffsTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";

export class Assassin extends Hero {
    public readonly id: number = 1;
    public readonly name: string = "Assassin";
    public readonly weight: number = 1;
    public readonly description: string = "";

    public readonly abilityType: heroAbilityTypes | undefined = "disableHero";
    public buffs: Array<heroBuffsTypes> = [];
    public debuffs: Array<heroDebuffsTypes> = [];

    public ResetBuffs(): void {
        this.buffs = [];
    }

    public ResetDebuffs(): void {
        this.debuffs = [];
    }
}