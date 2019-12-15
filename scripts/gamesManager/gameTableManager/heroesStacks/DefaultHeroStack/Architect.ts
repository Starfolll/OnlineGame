import {Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroDebuffsTypes} from "../heroDebuffsTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";

export class Architect extends Hero {
    public readonly id: number = 7;
    public readonly name: string = "Architect";
    public readonly weight: number = 7;
    public readonly description: string = "";

    public readonly abilityType: heroAbilityTypes | undefined = undefined;
    public buffs: Array<heroBuffsTypes> = ["overBuild"];
    public debuffs: Array<heroDebuffsTypes> = [];

    public ResetBuffs(): void {
        this.buffs = ["overBuild"];
    }

    public ResetDebuffs(): void {
        this.debuffs = [];
    }
}