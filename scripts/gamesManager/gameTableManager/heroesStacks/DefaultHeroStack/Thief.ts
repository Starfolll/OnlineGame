import {Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroDebuffsTypes} from "../heroDebuffsTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";

export class Thief extends Hero {
    public readonly id: number = 2;
    public readonly name: string = "Thief";
    public readonly weight: number = 2;
    public readonly description: string = "";

    public readonly abilityType: heroAbilityTypes | undefined = "robbHero";
    public buffs: Array<heroBuffsTypes> = [];
    public debuffs: Array<heroDebuffsTypes> = [];

    public ResetBuffs(): void {
        this.buffs = [];
    }

    public ResetDebuffs(): void {
        this.debuffs = [];
    }
}