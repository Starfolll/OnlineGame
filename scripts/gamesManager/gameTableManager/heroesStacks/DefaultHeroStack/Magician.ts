import {debuffWithMetadata, Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";
import {Players} from "../../../player/players";
import {HeroesStack} from "../heroesStack";
import {Deck} from "../../deck/deck";

export class Magician extends Hero {
    public readonly id: number = 3;
    public readonly name: string = "Magician";
    public readonly weight: number = 3;
    public readonly description: string = "";

    public readonly abilityType: heroAbilityTypes | undefined = "changeHand";
    public buffs: Array<heroBuffsTypes> = ["instanceCard", "overBuild"];
    public debuffs: Array<debuffWithMetadata> = [];

    public ResetBuffs(): void {
        this.buffs = ["instanceCard"];
    }

    public ResetDebuffs(): void {
        this.debuffs = [];
    }

    public IsPlayerCanMakeAbilityMove(message: any, playerId: number, players: Players, heroes: HeroesStack, deck: Deck): boolean {
        return false;
    }

    public CastPlayerAbility(message: any, playerId: number, players: Players, heroes: HeroesStack, deck: Deck): void {

    }
}