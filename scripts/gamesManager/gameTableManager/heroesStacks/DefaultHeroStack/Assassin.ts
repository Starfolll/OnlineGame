import {debuffWithMetadata, Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";
import {Players} from "../../../players/players";
import {HeroesStack} from "../heroesStack";
import {Deck} from "../../deck/deck";


type heroKilled = {
    messageType: string;
    killedHeroWeight: number;
}

const GetValidUserMassage = (message: any): heroKilled | undefined => {
    if (typeof message !== "object") return undefined;
    if (!message["messageType"] && message["messageType"] !== "heroKilled") return undefined;
    if (!message["killedHeroWeight"] && typeof message["killedHeroWeight"] !== "number") return undefined;
    return message as heroKilled;
};


export class Assassin extends Hero {
    public readonly id: number = 1;
    public readonly name: string = "Assassin";
    public readonly weight: number = 1;
    public readonly description: string = "";

    public readonly abilityType: heroAbilityTypes | undefined = "disableHero";
    public buffs: Array<heroBuffsTypes> = [];
    public debuffs: Array<debuffWithMetadata> = [];

    public ResetBuffs(): void {
        this.buffs = [];
    }

    public ResetDebuffs(): void {
        this.debuffs = [];
    }

    public IsPlayerCanMakeAbilityMove(message: any, playerId: string, players: Players, heroes: HeroesStack, deck: Deck): boolean {
        const validMessage = GetValidUserMassage(message);

        if (!validMessage) return false;
        if (!this.IsPlayerCanUseAbility(players.GetPlayerWithId(playerId))) return false;
        if (!heroes.allHeroes.some(h => h.weight === validMessage.killedHeroWeight)) return false;
        if (validMessage.killedHeroWeight <= this.weight) return false;
        return heroes.allHeroes.some(h => validMessage.killedHeroWeight === h.weight);
    }

    public CastPlayerAbility(message: any, playerId: string, players: Players, heroes: HeroesStack, deck: Deck): void {
        const validMessage = GetValidUserMassage(message)!;

        heroes.ApplyDebuffOnHero(validMessage.killedHeroWeight, "killed", playerId);
        players.InformAboutDebuffAddedToHero(validMessage.killedHeroWeight, "killed", playerId);
    }
}