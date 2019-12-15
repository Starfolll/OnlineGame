import {Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroDebuffsTypes} from "../heroDebuffsTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";

export class King extends Hero {
    public readonly id: number = 4;
    public readonly name: string = "King";
    public readonly weight: number = 4;
    public readonly description: string = "";

    public readonly abilityType: heroAbilityTypes | undefined = undefined;
    public buffs: Array<heroBuffsTypes> = ["goldForYellowDistricts"];
    public debuffs: Array<heroDebuffsTypes> = [];

    public ResetBuffs(): void {
        this.buffs = ["goldForYellowDistricts"];
    }

    public ResetDebuffs(): void {
        this.debuffs = [];
    }
}