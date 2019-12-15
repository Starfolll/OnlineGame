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
    ResetBuffs() {
        Object.keys(this.heroes).forEach(hW => this.heroes[+hW].ResetBuffs());
    }
    ResetDebuffs() {
        Object.keys(this.heroes).forEach(hW => this.heroes[+hW].ResetDebuffs());
    }
    IsLeftHeroesHasWeight(heroWeight) {
        return this.leftWeight.filter(hw => hw === heroWeight).length > 0;
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
    RemoveLeftHero(heroWeight) {
        this.heroesLeft.filter(hW => hW !== heroWeight);
    }
    IsHeroDead(heroWeight) {
        var _a;
        return (_a = this.heroes[heroWeight]) === null || _a === void 0 ? void 0 : _a.isDead;
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
