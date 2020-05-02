import {debuffWithMetadata, Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroDebuffsTypes} from "../heroDebuffsTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";
import {Players} from "../../../players/players";
import {HeroesStack} from "../heroesStack";
import {Deck} from "../../deck/deck";

export class Merchant extends Hero {
    public readonly id: number = 6;
    public readonly name: string = "Merchant";
    public readonly weight: number = 6;
    public readonly description: string = "";

    public readonly abilityType: heroAbilityTypes | undefined = undefined;
    public buffs: Array<heroBuffsTypes> = ["goldForGreenDistricts", "instanceGold"];
    public debuffs: Array<debuffWithMetadata> = [];

    public ResetBuffs(): void {
        this.buffs = ["goldForGreenDistricts", "instanceGold"];
    }

    public ResetDebuffs(): void {
        this.debuffs = [];
    }

    public IsPlayerCanMakeAbilityMove(message: any, playerId: string, players: Players, heroes: HeroesStack, deck: Deck): boolean {
        return false;
    }

    public CastPlayerAbility(message: any, playerId: string, players: Players, heroes: HeroesStack, deck: Deck): void {

    }
}