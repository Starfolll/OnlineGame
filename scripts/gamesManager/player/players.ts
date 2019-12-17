import {Player, playerInfo, playerPreGameInfo} from "./player";
import {Card, cardClass, cardInfo} from "../gameTableManager/deck/card";
import {tableInfo} from "../gameTableManager/gameTable";
import {heroDebuffsTypes} from "../gameTableManager/heroesStacks/heroDebuffsTypes";


export type tableInfoWithPlayers = {
    tableInfo: tableInfo;
    players: Array<playerInfo>;
}

export class Players {
    private readonly players: { [id: number]: Player; } = {};

    private readonly playersIdInGame: Set<number>;
    private readonly playersIdCount: number;

    private playerPickHeroTurn: number = -1;
    private playerHeroWeightTurn: number = -1;

    constructor(playersIdInGame: Set<number>) {
        this.playersIdInGame = playersIdInGame;
        this.playersIdCount = this.playersIdInGame.size;
    }


    get playersId(): Set<number> {
        return new Set(Object.keys(this.players).map(id => +id));
    }

    get length(): number {
        return this.playersIdCount;
    }


    public GetPlayerWithId(id: number): Player {
        return this.players[id];
    }


    public GivePlayerCard(playerId: number, card: Card, announce = true): void {
        this.players[playerId].hand.push(card);
        if (announce) this.InformPlayersAboutPlayerReceivedCard(playerId, card);
    }

    public GivePlayerGold(playerId: number, count: number, announce = true) {
        this.players[playerId].gold += count;
        if (announce) this.InformPlayersAboutPlayerReceivedGold(playerId, count);
    }

    public SetPlayerKing(playerId: number): void {
        Array.from(this.playersIdInGame).forEach(pId => {
            this.players[pId].isKing = playerId === pId;
        });
    }

    public AddBuildLimitToPlayer(playerId: number, additionLimit: number): void {
        this.players[playerId].buildLimit += additionLimit;
    }

    public AddGoldToPlayerForEachCardClass(playerId: number, cardClass: cardClass): void {
        const playerPlacedCards = this.GetPlayerWithId(playerId).placedCards;
        let additionGold = 0;
        playerPlacedCards.forEach(c => {
            if (c.cardClass === "all" || c.cardClass === cardClass) additionGold++;
        });
        if (additionGold > 0) this.GivePlayerGold(playerId, additionGold);
    }

    public AttachHeroWeightToPlayer(playerId: number, heroWeight: number): void {
        this.players[playerId].heroWeight = heroWeight;
        this.players[playerId].SetHeroPickTurnMade();
    }

    //------------//
    // pick hero sickle and start game
    private GetPlayerIdWithTurnNumber(turnNumber: number): number {
        const playersId = Array.from(this.playersIdInGame);

        for (let i = 0; i < playersId.length; i++) {
            const player = this.players[playersId[i]];
            if (player.heroPickTurnNumber === turnNumber)
                return player.playerId;
        }

        return -1;
    }

    private GetPlayerIdWithHeroWeight(weight: number): number {
        const playersId = Array.from(this.playersIdInGame);

        for (let i = 0; i < playersId.length; i++) {
            const player = this.players[playersId[i]];
            if (player.heroWeight === weight)
                return player.playerId;
        }

        return -1;
    }

    private GetKingPlayerId(): number {
        const playersId = Array.from(this.playersIdInGame.values());
        for (let i = 0; i < playersId.length; i++) {
            if (this.players[playersId[i]].isKing) return playersId[i];
        }
        return -1;
    }


    public ResetTurns(): void {
        Array.from(this.playersIdInGame).forEach(pId => {
            this.players[pId].ResetTurns();
        });
    }

    public RollInitialPlayerTurn(): void {
        const playersTurns: Array<number> = [];

        for (let i = 0; i < this.playersIdCount; i++) playersTurns.push(i + 1);
        playersTurns.sort(() => Math.random() - 0.5);

        this.playersIdInGame.forEach(pId => {
            const turn = playersTurns.shift();
            this.players[pId].heroPickTurnNumber = !!turn ? turn : -1;
            this.players[pId].heroPickInitialTurnNumber = !!turn ? turn : -1;
            if (turn === 1) this.players[pId].isKing = true;
        });

        this.playerPickHeroTurn = 0;
    }

    public RearrangePlayersTurn(): void {
        const kingPlayerId = this.GetKingPlayerId();
        const kingPlayerInitialTurnNumber = this.players[kingPlayerId].heroPickInitialTurnNumber;

        const playersId = Array.from(this.playersIdInGame.values());
        for (let i = 0; i < playersId.length; i++) {
            const playerInitialTurnNumber = this.players[playersId[i]].heroPickInitialTurnNumber;

            if (!!playerInitialTurnNumber && !!kingPlayerInitialTurnNumber)
                if (playerInitialTurnNumber < kingPlayerInitialTurnNumber) {
                    this.players[playersId[i]].heroPickTurnNumber =
                        this.length - kingPlayerInitialTurnNumber + 1 + playerInitialTurnNumber;
                } else {
                    this.players[playersId[i]].heroPickTurnNumber =
                        playerInitialTurnNumber - kingPlayerInitialTurnNumber + 1;
                }
        }

        this.playerPickHeroTurn = 0;
    }

    public SetNextPlayerPickHeroTurn(): void {
        this.playerPickHeroTurn++;

        if (!Array.from(this.playersIdInGame).some(pId => {
            return this.players[pId].heroPickTurnNumber === this.playerPickHeroTurn;
        })) this.playerPickHeroTurn = -1;
    }

    public IsPlayerHeroPickTurn(playerId: number, heroWeight: number): boolean {
        return this.players[playerId].IsHeroPickTurnCanBeMade(heroWeight);
    }

    public IsAllPlayersPickedHero(): boolean {
        return this.playerPickHeroTurn === this.playersIdCount;
    }


    // initial hero turn
    public GetCurrentHeroWeightTurn(): number {
        return this.playerHeroWeightTurn;
    }

    public GetCurrentPlayerIdTurn(): number {
        return this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn);
    }

    public ResetCurrentHeroTurn(): void {
        this.playerHeroWeightTurn = -1;
    }

    public SetNextHeroTurn(): void {
        const heroesTurnsLeft: Array<number> = [];

        this.playersIdInGame.forEach(pId => {
            const heroWeight = this.players[pId].heroWeight;
            if (!!heroWeight && heroWeight > this.playerHeroWeightTurn) heroesTurnsLeft.push(heroWeight);
        });

        heroesTurnsLeft.sort();

        if (heroesTurnsLeft.length === 0) this.playerHeroWeightTurn = -1;
        else this.playerHeroWeightTurn = heroesTurnsLeft[0];
    }

    public SetHeroInitialTurnOptions(options: Array<string>): void {
        const playerIdWithHeroWeight = this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn);
        this.players[playerIdWithHeroWeight].initialTurnOptionsToPickFrom = options;
    }

    public RemoveHeroInitialTurnOptionsInPlayer(playerId: number) {
        this.players[playerId].initialTurnOptionsToPickFrom = undefined;
    }

    public IsPlayerCanInitialPickOptionTurn(playerId: number, option: string): boolean {
        return this.players[playerId].IsInitialPickOptionTurnCanBeMade(option);
    }

    public GivePlayerInitialCardsToChoseFrom(playerId: number, cards: Array<Card>): void {
        this.players[playerId].initialTurnCardsToPickFrom = cards;
        this.players[playerId].InformAboutMoveToPickOneOfProposedCards(cards.map(c => c.GetInfo()));
    }

    public IsPlayerCanPickHeroInitialCard(playerId: number, cardInGameId: number): boolean {
        return this.players[playerId].IsInitialPickCardTurnCanBeMade(cardInGameId);
    }

    public GetPlayerChosenCard(playerId: number, cardInGameId: number): Card | undefined {
        return this.players[playerId].GetInitialTurnChosenCard(cardInGameId);
    }

    public SetPlayerInitialTurnMade(playerId: number): void {
        this.players[playerId].SetInitialTurnMade();
    }

    public IsAllPlayersPickedInitialTurnOptions(): boolean {
        return Array.from(this.playersIdInGame).every(pId => {
            return this.players[pId].isBuildTurnMade && this.players[pId].isInitialHeroTurnMade;
        });
    }

    // hero ability
    public SetPlayerHand(playerId: number, newHand: Array<Card>): void {
        this.players[playerId].hand = newHand;
        this.InformPlayersAboutPlayerHandChanged(playerId);
    }

    // player buildTurn
    public SetHeroBuildTurnStart(buildLimit: number): void {
        const playerIdWithHero = this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn);

        this.players[playerIdWithHero].buildLimit = buildLimit;
    }

    public IsPlayerCanBuildDistrict(playerId: number, cardInGameId: number): boolean {
        return this.players[playerId].IsDistrictBuildCanBeMade(cardInGameId);
    }

    public SetPlayerCardBuilt(playerId: number, cardInGameId: number): void {
        const card = this.players[playerId].RemoveCardFromHand(cardInGameId);
        if (!!card) {
            this.players[playerId].gold -= card.cost;
            this.players[playerId].placedCards.push(card);

            const newBuildLimit = !!this.players[playerId].buildLimit ? this.players[playerId].buildLimit - 1 : undefined;
            if (!!newBuildLimit) this.players[playerId].buildLimit = newBuildLimit;

            this.InformPlayersAboutDistrictBuilt(playerId, card.GetInfo());
        }
    }

    public IsPlayerCanEndBuildTurn(playerId: number): boolean {
        return this.players[playerId].IsEndOfBuildTurnCanBeMade();
    }

    public EndPlayerBuildTurn(playerId: number): void {
        this.players[playerId].SetBuildTurnMade();
    }

    public DestroyPlayerDistrict(playerId: number, districtInGameId: number): void {
        this.players[playerId].RemovePlacedCard(districtInGameId);
    }

    // end game
    public IsMaxDistrictsWasBuilt(): boolean {
        return Array.from(this.playersIdInGame).some(pId => {
            return this.players[pId].IsMaxDistrictsBuilt();
        });
    }

    public DisconnectAllPlayers(): void {
        Object.keys(this.players).forEach(pId => {
            this.players[+pId].Disconnect();
        });
    }

    //------------//
    // player connection
    public IsPlayerBelongToGame(player: Player): boolean {
        return this.playersIdInGame.has(player.playerId);
    }

    public AddPlayer(player: Player): void {
        this.players[player.playerId] = player;
    }

    public IsAllPlayerConnected(): boolean {
        return Object.keys(this.players).length === this.playersIdCount;
    }

    public IsPlayerCreated(player: Player): boolean {
        return Object.keys(this.players).some(pId => {
            const p = this.players[+pId];
            return player.playerId === p.playerId && player.token === p.token && !p.IsConnected;
        });
    }

    public ResetPlayerConnection(player: Player) {
        Object.keys(this.players).forEach(pId => {
            const p = this.players[+pId];
            if (p.playerId === player.playerId && p.token === player.token) {
                this.players[+pId].Connection = player.Connection;
            }
        });
    }

    public IsPlayerClone(player: Player): boolean {
        return Object.keys(this.players).some(pId => {
            const p = this.players[+pId];
            return (player.playerId === p.playerId && player.token === p.token && p.IsConnected);
        });
    }

    public SetPlayerDisconnected(playerId: number): void {
        Object.keys(this.players).forEach(pId => {
            if (this.players[+pId].playerId === playerId)
                this.players[+pId].SetDisconnected();
        });
    }

    // players informant
    public InformPlayersAboutInitialPlayerConnection(playerInfo: playerPreGameInfo): void {
        Object.keys(this.players).forEach(pId => {
            if (+pId !== playerInfo.id) this.players[+pId].InformAboutPlayerInitialConnected(playerInfo);
        });
    }

    public InformPlayersAboutPlayerConnected(playerId: number): void {
        Object.keys(this.players).forEach(pId => {
            if (+pId !== playerId) this.players[+pId].InformAboutPlayerConnected(playerId);
        });
    }

    public InformPlayersAboutPlayerDisconnected(playerId: number): void {
        Object.keys(this.players).forEach(pId => {
            if (+pId !== playerId) this.players[+pId].InformAboutPlayerDisconnected(playerId);
        });
    }


    public InformPlayersAboutGameStart(tableInfo: tableInfo): void {
        Array.from(this.playersIdInGame).forEach(pId => {
            this.InformPlayerAboutGameTable(pId, tableInfo);
        });
    }


    public InformPlayersAboutHeroPickTurnStart(shiftedHeroesWeight: Array<number>, heroesWeightLeft: Array<number>): void {
        const playerTurnId = this.GetPlayerIdWithTurnNumber(this.playerPickHeroTurn);

        Object.keys(this.players).forEach(pId => {
            if (this.players[+pId].playerId === playerTurnId)
                this.players[+pId].heroesWeightToPickFrom = heroesWeightLeft;

            this.players[+pId].InformAboutHeroPickTurnStart(
                shiftedHeroesWeight,
                +pId === playerTurnId ? heroesWeightLeft : undefined,
                playerTurnId
            );
        });
    }

    public InformPlayersAboutPlayerPickingHero(heroesWeightLeft: Array<number>): void {
        const playerTurnId = this.GetPlayerIdWithTurnNumber(this.playerPickHeroTurn);

        Object.keys(this.players).forEach(pId => {
            if (this.players[+pId].playerId === playerTurnId)
                this.players[+pId].heroesWeightToPickFrom = heroesWeightLeft;

            this.players[+pId].InformAboutPickHeroTurn(
                playerTurnId,
                +pId === playerTurnId ? heroesWeightLeft : undefined
            );
        });
    }


    public InformPlayersAboutPlayerHandChanged(playerId: number): void {
        const newHand = this.players[playerId].hand;
        const handLength = newHand.length;

        this.playersId.forEach(pId => {
            if (pId === playerId) this.players[pId].InformAboutPlayerHandChanged(playerId, handLength, newHand);
            else this.players[pId].InformAboutPlayerHandChanged(playerId, handLength);
        });
    }


    public InformPlayersAboutNextHeroInitialTurnStart(): void {
        const playerIdTurn = this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn);

        Array.from(this.playersIdInGame).forEach(pId => {
            this.players[pId].InformAboutInitialHeroTurn(
                this.playerHeroWeightTurn,
                playerIdTurn
            );
        });
    }

    public InformPlayersAboutHeroBuildTurnStart(): void {
        const playerIdTurn = this.GetPlayerIdWithHeroWeight(this.playerHeroWeightTurn);

        Array.from(this.playersIdInGame).forEach(pId => {
            this.players[pId].InformAboutBuildTurnStart(
                this.playerHeroWeightTurn,
                playerIdTurn
            );
        });
    }


    public InformPlayersAboutDistrictBuilt(playerId: number, cardInfo: cardInfo): void {
        Array.from(this.playersIdInGame).forEach(pId => {
            this.players[pId].InformAboutPlayerBuiltDistrict(playerId, cardInfo);
        });
    }

    public InformPlayersAboutDistrictDestroyed(playerId: number, cardInGameId: number): void {
        Array.from(this.playersIdInGame).forEach(pId => {
            this.players[pId].InformAboutPlayerDistrictDestroyed(playerId, cardInGameId);
        });
    }


    public InformPlayersAboutPlayerReceivedGold(playerId: number, count: number): void {
        Array.from(this.playersIdInGame).forEach(pId => {
            this.players[pId].InformAboutPlayerReceivedGold(playerId, count);
        });
    }

    public InformPlayersAboutPlayerReceivedCard(playerId: number, card: Card): void {
        Array.from(this.playersIdInGame).forEach(pId => {
            this.players[pId].InformAboutPlayerReceivedCard(playerId, playerId === pId ? card : undefined);
        });
    }

    public InformAboutDebuffAddedToHero(heroWeight: number, debuffType: heroDebuffsTypes, fromPlayerId?: number): void {
        Array.from(this.playersIdInGame).forEach(pId => {
            this.players[pId].InformAboutDebuffAddedToHero(heroWeight, debuffType, fromPlayerId);
        });
    }


    public InformPlayersAboutGameEnd(): void {
        const playersScore = Array.from(this.playersIdInGame).map(pId => {
            return this.players[pId].GetScore();
        });

        playersScore.sort((a, b) => b.score - a.score);

        for (let i = 0; i < playersScore.length; i++) {
            if (i === 0) playersScore[i].isWinner = true;
            playersScore[i].place = i + 1;
        }

        Array.from(this.playersIdInGame).forEach(pId => {
            this.players[pId].InformAboutGameEnd(playersScore)
        });
    }


    public InformPlayerAboutPreGameInfo(playerId: number): void {
        this.players[playerId].InformAboutPreGameInfo(
            Object.keys(this.players).map(pId => {
                return this.players[+pId].GetPreGameInfo();
            }),
            this.length
        );
    }

    public InformPlayerAboutGameTable(playerId: number, tableInfo: tableInfo): void {
        const player = this.players[playerId];

        const tableInfoWithPlayers: tableInfoWithPlayers = {
            "tableInfo": tableInfo,
            "players": Array.from(this.playersIdInGame).map(pId => {
                return this.players[pId].GetInfo(player.playerId === pId);
            })
        };

        player.InformAboutTable(tableInfoWithPlayers);
    }
}