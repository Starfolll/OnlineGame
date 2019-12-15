import {Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroDebuffsTypes} from "../heroDebuffsTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";

export class Bishop extends Hero {
    public readonly id: number = 5;
    public readonly name: string = "Bishop";
    public readonly weight: number = 5;
    public readonly description: string = "";

    public readonly abilityType: heroAbilityTypes | undefined = undefined;
    public buffs: Array<heroBuffsTypes> = ["goldForBlueDistricts", "untouchable"];
    public debuffs: Array<heroDebuffsTypes> = [];

    public ResetBuffs(): void {
        this.buffs = ["goldForBlueDistricts", "untouchable"];
    }

    public ResetDebuffs(): void {
        this.debuffs = [];
    }
}