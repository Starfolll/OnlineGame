import {Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroDebuffsTypes} from "../heroDebuffsTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";

export class Magician extends Hero {
    public readonly id: number = 3;
    public readonly name: string = "Magician";
    public readonly weight: number = 3;
    public readonly description: string = "";

    public readonly abilityType: heroAbilityTypes | undefined = "changeHand";
    public buffs: Array<heroBuffsTypes> = ["instanceCard"];
    public debuffs: Array<heroDebuffsTypes> = [];

    public ResetBuffs(): void {
        this.buffs = ["instanceCard"];
    }

    public ResetDebuffs(): void {
        this.debuffs = [];
    }
}