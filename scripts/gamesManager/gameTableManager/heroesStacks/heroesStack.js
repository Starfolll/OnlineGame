"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HeroesStack {
    constructor(heroes) {
        this.heroesLeft = [];
        this.heroesShifted = [];
        this.heroes = heroes;
    }
    get heroesStackSize() {
        return Object.keys(this.heroes).length;
    }
    get leftWeight() {
        return this.heroesLeft;
    }
    get shiftedWeight() {
        return this.heroesShifted;
    }
    get allHeroes() {
        return Object.keys(this.heroes).map(hW => this.heroes[+hW]);
    }
    ResetBuffs() {
        Object.keys(this.heroes).forEach(hW => this.heroes[+hW].ResetBuffs());
    }
    ResetDebuffs() {
        Object.keys(this.heroes).forEach(hW => this.heroes[+hW].ResetDebuffs());
    }
    IsLeftHeroesHasWeight(heroWeight) {
        return this.leftWeight.some(hw => hw === heroWeight);
    }
    RefillLeftHeroes() {
        this.heroesLeft = [];
        Object.keys(this.heroes).forEach(hW => this.heroesLeft.push(+hW));
    }
    ShuffleLeftHeroes() {
        this.heroesLeft.sort(() => Math.random() - 0.5);
    }
    ClearShiftedHeroes() {
        this.heroesShifted = [];
    }
    ShiftHeroSilent() {
        this.heroesLeft.shift();
    }
    ShiftHeroAnnounced() {
        const heroW = this.heroesLeft.shift();
        if (!!heroW)
            this.heroesShifted.push(heroW);
    }
    ShiftHeroes(playerLength) {
        this.ClearShiftedHeroes();
        const droppedHeroesCardCount = this.heroesStackSize - (playerLength + 1);
        const announcedDropCount = Math.floor(droppedHeroesCardCount / 2);
        const silentDropCount = droppedHeroesCardCount - announcedDropCount;
        for (let i = 0; i < announcedDropCount; i++)
            this.ShiftHeroAnnounced();
        for (let i = 0; i < silentDropCount; i++)
            this.ShiftHeroSilent();
    }
    GetHeroAbilityType(heroWeight) {
        return this.heroes[heroWeight].abilityType;
    }
    IsHeroHasAbility(heroWeight) {
        return this.heroes[heroWeight].HasAbility();
    }
    IsHeroCanUseAbility(heroWeight, message, playerId, players, heroes, deck) {
        return this.heroes[heroWeight].IsPlayerCanMakeAbilityMove(message, playerId, players, heroes, deck);
    }
    UseHeroAbility(heroWeight, message, playerId, players, heroes, deck) {
        this.heroes[heroWeight].CastPlayerAbility(message, playerId, players, heroes, deck);
    }
    RemoveLeftHero(heroWeight) {
        this.heroesLeft = this.heroesLeft.filter(hW => hW !== heroWeight);
    }
    IsHeroDead(heroWeight) {
        return this.heroes[heroWeight].isDead;
    }
    ApplyDebuffOnHero(heroWeight, debuffType, fromPlayerId) {
        this.heroes[heroWeight].AddDebuff(debuffType, fromPlayerId);
    }
    InvokeHeroDebuffs(heroWeight, playerIdWithThisHero, players, heroes, deck) {
        this.heroes[heroWeight].InvokeDebuffs(playerIdWithThisHero, players, heroes, deck);
    }
    InvokeHeroBuffs(heroWeight, playerIdWithThisHero, players, heroes, deck) {
        this.heroes[heroWeight].InvokeBuffs(playerIdWithThisHero, players, heroes, deck);
    }
    GetHeroesInfo() {
        return Object.keys(this.heroes).map(hW => this.heroes[+hW].GetInfo());
    }
}
exports.HeroesStack = HeroesStack;
