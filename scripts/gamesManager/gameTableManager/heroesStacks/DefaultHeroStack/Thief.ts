import {debuffWithMetadata, Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";
import {Players} from "../../../player/players";
import {HeroesStack} from "../heroesStack";
import {Deck} from "../../deck/deck";

export class Thief extends Hero {
    public readonly id: number = 2;
    public readonly name: string = "Thief";
    public readonly weight: number = 2;
    public readonly description: string = "";

    public readonly abilityType: heroAbilityTypes | undefined = "robbHero";
    public buffs: Array<heroBuffsTypes> = [];
    public debuffs: Array<debuffWithMetadata> = [];

    public ResetBuffs(): void {
        this.buffs = [];
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