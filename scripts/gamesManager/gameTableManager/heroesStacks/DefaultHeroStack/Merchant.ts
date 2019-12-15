import {Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroDebuffsTypes} from "../heroDebuffsTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";

export class Merchant extends Hero {
    public readonly id: number = 6;
    public readonly name: string = "Merchant";
    public readonly weight: number = 6;
    public readonly description: string = "";

    public readonly abilityType: heroAbilityTypes | undefined = undefined;
    public buffs: Array<heroBuffsTypes> = ["goldForGreenDistricts", "instanceGold"];
    public debuffs: Array<heroDebuffsTypes> = [];

    public ResetBuffs(): void {
        this.buffs = ["goldForGreenDistricts", "instanceGold"];
    }

    public ResetDebuffs(): void {
        this.debuffs = [];
    }
}