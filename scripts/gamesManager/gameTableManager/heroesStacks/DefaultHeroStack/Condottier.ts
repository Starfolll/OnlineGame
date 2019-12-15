import {Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroDebuffsTypes} from "../heroDebuffsTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";

export class Condottier extends Hero {
    public readonly id: number = 8;
    public readonly name: string = "Condottier";
    public readonly weight: number = 8;
    public readonly description: string = "";

    public readonly abilityType: heroAbilityTypes | undefined = "destroyDistrict";
    public buffs: Array<heroBuffsTypes> = ["goldForRedDistricts"];
    public debuffs: Array<heroDebuffsTypes> = [];

    public ResetBuffs(): void {
        this.buffs = ["goldForRedDistricts"];
    }

    public ResetDebuffs(): void {
        this.debuffs = [];
    }
}