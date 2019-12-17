import {Player} from "../player/player";
import {Players} from "../player/players";
import {Deck} from "./deck/deck";
import {Hero, heroInfo} from "./heroesStacks/hero";
import {HeroesStack} from "./heroesStacks/heroesStack";
import {Card} from "./deck/card";
import {initialHeroTurnOptions} from "../player/communicationWithPlayer/responseMessagesTypes";

type turnsType = "waitingForPlayers" | "gameStarted" | "heroPickTurn" | "initialTurn" | "buildTurn";

export type tableInfo = {
    isGameStarted: boolean;
    isGameEnd: boolean;

    heroes: Array<heroInfo>;
    shiftedHeroesWeight: Array<number>;

    currentTurnType: turnsType;

    cardsInDeck: number;
};

export class GameTable {
    private readonly tableId: number;
    private currentTurnType: turnsType = "waitingForPlayers";

    protected isGameStarted: boolean = false;
    protected isGameEnd: boolean = false;

    private readonly deck: Deck;
    private readonly players: Players;
    private readonly heroes: HeroesStack;

    private readonly onGameEndCallback: (tableId: number) => void;

    constructor(
        tableId: number,
        playersId: Set<number>,
        cards: Array<Card>,
        heroes: { [heroWeight: number]: Hero },
        onGameEndCallback: (tableId: number) => void
    ) {
        this.tableId = tableId;

        this.deck = new Deck(cards);
        this.players = new Players(playersId);
        this.heroes = new HeroesStack(heroes);

        this.onGameEndCallback = onGameEndCallback;
    }


    // player auth
    protected IsPlayerCanBeConnected(player: Player): boolean {
        if (!this.players.IsPlayerBelongToGame(player)) {
            this.DisconnectIllegalPlayer(player, 1000, "not in game");
            return false;
        } else if (this.players.IsPlayerClone(player)) {
            this.DisconnectIllegalPlayer(player, 1000, "clone");
            return false;
        }


        if (!this.players.IsPlayerCreated(player)) {
            this.players.AddPlayer(player);
            this.players.InformPlayersAboutInitialPlayerConnection(player.GetPreGameInfo());
        } else {
            this.players.ResetPlayerConnection(player);
            this.players.InformPlayersAboutPlayerConnected(player.playerId);
        }

        if (this.isGameStarted) this.players.InformPlayerAboutGameTable(player.playerId, this.GetTableInfo());
        else this.players.InformPlayerAboutPreGameInfo(player.playerId);

        return true;
    }

    protected IsAllPlayersConnected(): boolean {
        return this.players.IsAllPlayerConnected();
    }

    protected DisconnectIllegalPlayer(player: Player, errorCode: number, message: string): void {
        player.Connection.close(errorCode, message);
    }

    protected SetPlayerDisconnected(playerId: number): void {
        this.players.SetPlayerDisconnected(playerId);
        this.players.InformPlayersAboutPlayerDisconnected(playerId);
    }


    // initiate game
    protected InitiateGame(): void {
        this.deck.Shuffle();
        this.players.RollInitialPlayerTurn();
        this.GiveEachPlayerInitialCards(4);
        this.GiveEachPlayerInitialGold(2);
    }

    private GiveEachPlayerInitialCards(nCards: number): void {
        this.players.playersId.forEach(pId => {
            for (let i = 0; i < nCards; i++) {
                const card = this.deck.GetTopCard();
                if (!!card) this.players.GivePlayerCard(pId, card, false);
            }
        });
    }

    private GiveEachPlayerInitialGold(nGold: number): void {
        this.players.playersId.forEach(pId => {
            this.players.GivePlayerGold(pId, nGold, false);
        });
    }


    // start game
    protected StartGame(): void {
        this.isGameStarted = true;
        this.currentTurnType = "gameStarted";

        const tableInfo = this.GetTableInfo();
        this.players.InformPlayersAboutGameStart(tableInfo);

        this.BeginChoosingHeroSickle();
    }


    // player hero pick sickle
    protected BeginChoosingHeroSickle(): void {
        this.currentTurnType = "heroPickTurn";

        this.heroes.ResetBuffs();
        this.heroes.ResetDebuffs();
        this.heroes.ClearShiftedHeroes();
        this.heroes.RefillLeftHeroes();
        this.heroes.ShuffleLeftHeroes();
        this.heroes.ShiftHeroes(this.players.length);

        this.players.ResetTurns();
        this.players.RearrangePlayersTurn();
        this.players.SetNextPlayerPickHeroTurn();
        this.players.InformPlayersAboutHeroPickTurnStart(
            this.heroes.shiftedWeight,
            this.heroes.leftWeight
        );
    }

    protected IsPlayerCanPickHero(playerId: number, heroWeight: number): boolean {
        if (!this.heroes.IsLeftHeroesHasWeight(heroWeight)) return false;
        return this.players.IsPlayerHeroPickTurn(playerId, heroWeight);
    }

    protected AttachHeroToPlayer(playerId: number, heroWeight: number): void {
        this.heroes.RemoveLeftHero(heroWeight);
        this.players.AttachHeroWeightToPlayer(playerId, heroWeight);

        if (!this.players.IsAllPlayersPickedHero()) this.GiveNextPlayerPickHeroTurn();
        else this.BeginInitialHeroTurn();
    }

    protected GiveNextPlayerPickHeroTurn(): void {
        this.players.SetNextPlayerPickHeroTurn();
        this.players.InformPlayersAboutPlayerPickingHero(this.heroes.leftWeight);
    }


    // hero initial turn
    protected BeginInitialHeroTurn(): void {
        this.currentTurnType = "initialTurn";

        this.players.ResetCurrentHeroTurn();
        this.players.SetNextHeroTurn();

        this.InvokeHeroBuffsAndBeginInitialTurn();
    }

    protected InvokeHeroBuffsAndBeginInitialTurn(): void {
        if (!this.heroes.IsHeroDead(this.players.GetCurrentHeroWeightTurn())) {
            this.heroes.InvokeHeroDebuffs(
                this.players.GetCurrentHeroWeightTurn(),
                this.players.GetCurrentPlayerIdTurn(),
                this.players,
                this.heroes,
                this.deck
            );
            this.heroes.InvokeHeroBuffs(
                this.players.GetCurrentHeroWeightTurn(),
                this.players.GetCurrentPlayerIdTurn(),
                this.players,
                this.heroes,
                this.deck
            );

            this.players.SetHeroInitialTurnOptions(Array.from(initialHeroTurnOptions));
            this.players.InformPlayersAboutNextHeroInitialTurnStart();
        } else this.GiveNextPlayerPickInitialTurnOptions();
    }

    protected IsPlayerCanPickHeroInitialOptions(playerId: number, option: string): boolean {
        return this.players.IsPlayerCanInitialPickOptionTurn(playerId, option);
    }

    protected HeroPickedInitialTurnOptionGold(playerId: number): void {
        this.players.GivePlayerGold(playerId, 2);
        this.players.SetPlayerInitialTurnMade(playerId);
        this.BeginBuildHeroTurn();
    }

    protected HeroPickedInitialTurnOptionCards(playerId: number): void {
        const cardsToChoseFrom: Array<Card> = [];
        const maxCardsToChoseFrom: number = 2;
        for (let i = 0; i < maxCardsToChoseFrom; i++) {
            const card = this.deck.GetTopCard();
            if (!!card) cardsToChoseFrom.push(card);
        }

        this.players.RemoveHeroInitialTurnOptionsInPlayer(playerId);
        this.players.GivePlayerInitialCardsToChoseFrom(playerId, cardsToChoseFrom);
    }

    protected IsPlayerCanPickHeroInitialCard(playerId: number, cardInGameId: number): boolean {
        return this.players.IsPlayerCanPickHeroInitialCard(playerId, cardInGameId);
    }

    protected HeroPickedInitialTurnCard(playerId: number, cardInGameId: number): void {
        const card = this.players.GetPlayerChosenCard(playerId, cardInGameId);
        if (!!card) this.players.GivePlayerCard(playerId, card);
        this.players.SetPlayerInitialTurnMade(playerId);
        this.BeginBuildHeroTurn();
    }

    // hero ability turn
    protected IsPlayerCanUseHeroAbility(playerId: number, abilityData: any): boolean {
        return this.heroes.IsHeroCanUseAbility(
            this.players.GetCurrentHeroWeightTurn(),
            abilityData,
            playerId,
            this.players,
            this.heroes,
            this.deck
        );
    }

    protected UsePlayerHeroAbility(playerId: number, abilityData: any): void {
        this.heroes.UseHeroAbility(
            this.players.GetCurrentHeroWeightTurn(),
            abilityData,
            playerId,
            this.players,
            this.heroes,
            this.deck
        );
    }

    // hero build turn
    protected BeginBuildHeroTurn(): void {
        this.currentTurnType = "buildTurn";

        this.players.SetHeroBuildTurnStart(1);
        this.players.InformPlayersAboutHeroBuildTurnStart();
    }

    protected IsPlayerCanBuildDistrict(playerId: number, cardInGameId: number): boolean {
        return this.players.IsPlayerCanBuildDistrict(playerId, cardInGameId);
    }

    protected PlayerBuildDistrict(playerId: number, cardInGameId: number): void {
        this.players.SetPlayerCardBuilt(playerId, cardInGameId);
    }

    protected PlayerCanEndBuildTurn(playerId: number) {
        return this.players.IsPlayerCanEndBuildTurn(playerId);
    }

    protected EndPlayerBuildTurn(playerId: number): void {
        this.players.EndPlayerBuildTurn(playerId);
        this.GiveNextPlayerPickInitialTurnOptions();
    }

    protected GiveNextPlayerPickInitialTurnOptions(): void {
        this.players.SetNextHeroTurn();
        if (!this.players.IsAllPlayersPickedInitialTurnOptions()) {
            this.InvokeHeroBuffsAndBeginInitialTurn();
        } else {
            if (!this.players.IsMaxDistrictsWasBuilt()) {
                this.BeginChoosingHeroSickle();
            } else {
                this.EndGame();
            }
        }
    }


    // end game
    protected EndGame(): void {
        this.isGameEnd = true;

        this.players.InformPlayersAboutGameEnd();

        setTimeout(() => {
            this.players.DisconnectAllPlayers();
            this.onGameEndCallback(this.tableId);
        }, 6000);
    }


    // table info
    protected GetTableInfo(): tableInfo {
        return {
            "cardsInDeck": this.deck.cardsLeft,
            "currentTurnType": this.currentTurnType,
            "heroes": this.heroes.GetHeroesInfo(),
            "isGameStarted": this.isGameStarted,
            "isGameEnd": this.isGameEnd,
            "shiftedHeroesWeight": this.heroes.shiftedWeight
        }
    }
}