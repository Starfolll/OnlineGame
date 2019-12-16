import {debuffWithMetadata, Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";
import {Players} from "../../../player/players";
import {HeroesStack} from "../heroesStack";
import {Deck} from "../../deck/deck";

export class Condottier extends Hero {
    public readonly id: number = 8;
    public readonly name: string = "Condottier";
    public readonly weight: number = 8;
    public readonly description: string = "";

    public readonly abilityType: heroAbilityTypes | undefined = "destroyDistrict";
    public buffs: Array<heroBuffsTypes> = ["goldForRedDistricts"];
    public debuffs: Array<debuffWithMetadata> = [];

    public ResetBuffs(): void {
        this.buffs = ["goldForRedDistricts"];
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