import {debuffWithMetadata, Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";
import {Players} from "../../../players/players";
import {HeroesStack} from "../heroesStack";
import {Deck} from "../../deck/deck";

export class Bishop extends Hero {
    public readonly id: number = 5;
    public readonly name: string = "Bishop";
    public readonly weight: number = 5;
    public readonly description: string = "";

    public readonly abilityType: heroAbilityTypes | undefined = undefined;
    public buffs: Array<heroBuffsTypes> = ["goldForBlueDistricts", "untouchable"];
    public debuffs: Array<debuffWithMetadata> = [];

    public ResetBuffs(): void {
        this.buffs = ["goldForBlueDistricts", "untouchable"];
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