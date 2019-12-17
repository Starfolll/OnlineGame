import {debuffWithMetadata, Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";
import {Players} from "../../../player/players";
import {HeroesStack} from "../heroesStack";
import {Deck} from "../../deck/deck";


type robbedHero = {
    messageType: string;
    heroWeight: number;
}

const GetValidUserMassage = (message: any): robbedHero | undefined => {
    if (typeof message !== "object") return undefined;
    if (!message["messageType"] && message["messageType"] !== "robbedHero") return undefined;
    if (!message["heroWeight"] && typeof message["heroWeight"] !== "number") return undefined;
    return message as robbedHero;
};


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
        const validMessage = GetValidUserMassage(message);
        if (!validMessage) return false;

        if (!heroes.allHeroes.some(h => h.weight === validMessage.heroWeight)) return false;
        return validMessage.heroWeight > this.weight;
    }

    public CastPlayerAbility(message: any, playerId: number, players: Players, heroes: HeroesStack, deck: Deck): void {
        const validMessage = GetValidUserMassage(message)!;

        heroes.ApplyDebuffOnHero(validMessage.heroWeight, "robbed", playerId);
    }
}