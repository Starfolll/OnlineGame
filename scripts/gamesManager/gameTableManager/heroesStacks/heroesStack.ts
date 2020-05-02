import {Hero, heroInfo} from "./hero";
import {Players} from "../../players/players";
import {Deck} from "../deck/deck";
import {heroDebuffsTypes} from "./heroDebuffsTypes";
import {heroAbilityTypes} from "./heroAbilityTypes";

export class HeroesStack {
    private readonly heroes: Readonly<{ [heroWeight: number]: Hero }>;
    private heroesLeft: Array<number> = [];
    private heroesShifted: Array<number> = [];


    constructor(heroes: { [heroWeight: number]: Hero }) {
        this.heroes = heroes;
    }


    get heroesStackSize(): number {
        return Object.keys(this.heroes).length;
    }


    get leftWeight(): Array<number> {
        return this.heroesLeft;
    }

    get shiftedWeight(): Array<number> {
        return this.heroesShifted;
    }

    get allHeroes(): Array<Hero> {
        return Object.keys(this.heroes).map(hW => this.heroes[+hW]);
    }


    public ResetBuffs(): void {
        Object.keys(this.heroes).forEach(hW => this.heroes[+hW].ResetBuffs());
    }

    public ResetDebuffs(): void {
        Object.keys(this.heroes).forEach(hW => this.heroes[+hW].ResetDebuffs());
    }


    public IsLeftHeroesHasWeight(heroWeight: number): boolean {
        return this.leftWeight.some(hw => hw === heroWeight);
    }

    public RefillLeftHeroes(): void {
        this.heroesLeft = [];
        Object.keys(this.heroes).forEach(hW => this.heroesLeft.push(+hW));
    }

    public ShuffleLeftHeroes(): void {
        this.heroesLeft.sort(() => Math.random() - 0.5);
    }


    public ClearShiftedHeroes(): void {
        this.heroesShifted = [];
    }

    private ShiftHeroSilent(): void {
        this.heroesLeft.shift();
    }

    private ShiftHeroAnnounced(): void {
        const heroW = this.heroesLeft.shift();
        if (!!heroW) this.heroesShifted.push(heroW);
    }

    public ShiftHeroes(playerLength: number): void {
        this.ClearShiftedHeroes();

        const droppedHeroesCardCount = this.heroesStackSize - (playerLength + 1);

        const announcedDropCount = Math.floor(droppedHeroesCardCount / 2);
        const silentDropCount = droppedHeroesCardCount - announcedDropCount;

        for (let i = 0; i < announcedDropCount; i++) this.ShiftHeroAnnounced();
        for (let i = 0; i < silentDropCount; i++) this.ShiftHeroSilent();
    }


    public GetHeroAbilityType(heroWeight: number): heroAbilityTypes | undefined {
        return this.heroes[heroWeight].abilityType;
    }

    public IsHeroHasAbility(heroWeight: number): boolean {
        return this.heroes[heroWeight].HasAbility();
    }

    public IsHeroCanUseAbility(heroWeight: number, message: any, playerId: string, players: Players, heroes: HeroesStack, deck: Deck): boolean {
        return this.heroes[heroWeight].IsPlayerCanMakeAbilityMove(message, playerId, players, heroes, deck);
    }

    public UseHeroAbility(heroWeight: number, message: any, playerId: string, players: Players, heroes: HeroesStack, deck: Deck): void {
        this.heroes[heroWeight].CastPlayerAbility(message, playerId, players, heroes, deck);
    }


    public RemoveLeftHero(heroWeight: number) {
        this.heroesLeft = this.heroesLeft.filter(hW => hW !== heroWeight);
    }


    public IsHeroDead(heroWeight: number): boolean {
        return this.heroes[heroWeight].isDead;
    }


    public ApplyDebuffOnHero(heroWeight: number, debuffType: heroDebuffsTypes, fromPlayerId: string): void {
        this.heroes[heroWeight].AddDebuff(debuffType, fromPlayerId);
    }


    public InvokeHeroDebuffs(
        heroWeight: number,
        playerIdWithThisHero: string,
        players: Players,
        heroes: HeroesStack,
        deck: Deck
    ): void {
        this.heroes[heroWeight].InvokeDebuffs(playerIdWithThisHero, players, heroes, deck);
    }

    public InvokeHeroBuffs(
        heroWeight: number,
        playerIdWithThisHero: string,
        players: Players,
        heroes: HeroesStack,
        deck: Deck
    ): void {
        this.heroes[heroWeight].InvokeBuffs(playerIdWithThisHero, players, heroes, deck);
    }

    // heroes info
    public GetHeroesInfo(): Array<heroInfo> {
        return Object.keys(this.heroes).map(hW => this.heroes[+hW].GetInfo());
    }
}