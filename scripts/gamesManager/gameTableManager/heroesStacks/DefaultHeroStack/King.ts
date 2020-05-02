import {debuffWithMetadata, Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";
import {Players} from "../../../players/players";
import {HeroesStack} from "../heroesStack";
import {Deck} from "../../deck/deck";

export class King extends Hero {
    public readonly id: number = 4;
    public readonly name: string = "King";
    public readonly weight: number = 4;
    public readonly description: string = "";

    public readonly abilityType: heroAbilityTypes | undefined = undefined;
    public buffs: Array<heroBuffsTypes> = ["goldForYellowDistricts", "king"];
    public debuffs: Array<debuffWithMetadata> = [];

    public ResetBuffs(): void {
        this.buffs = ["goldForYellowDistricts", "king"];
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