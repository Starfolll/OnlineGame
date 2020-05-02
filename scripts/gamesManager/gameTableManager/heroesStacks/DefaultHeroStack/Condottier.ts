import {debuffWithMetadata, Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";
import {Players} from "../../../players/players";
import {HeroesStack} from "../heroesStack";
import {Deck} from "../../deck/deck";


type destroyDistrict = {
    messageType: string;
    playerId: string;
    districtInGameId: number;
}

const GetValidUserMassage = (message: any): destroyDistrict | undefined => {
    if (typeof message !== "object") return undefined;
    if (!message["messageType"] && message["messageType"] !== "districtDestroyed") return undefined;
    if (!message["playerId"] && typeof message["playerId"] !== "number") return undefined;
    if (!message["districtInGameId"] && typeof message["districtInGameId"] !== "number") return undefined;
    return message as destroyDistrict;
};


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

    public IsPlayerCanMakeAbilityMove(message: any, playerId: string, players: Players, heroes: HeroesStack, deck: Deck): boolean {
        const validMessage = GetValidUserMassage(message);
        if (!validMessage) return false;

        if (validMessage.playerId === "null") return true;
        const player = players.GetPlayerWithId(playerId);
        const playerToDestroy = players.GetPlayerWithId(validMessage.playerId);

        if (!this.IsPlayerCanUseAbility(player)) return false;
        if (!playerToDestroy) return false;
        if (!playerToDestroy.placedCards.some(c => c.gameId === validMessage.districtInGameId && player.HasEnoughGold(c.cost - 1))) return false;
        return playerToDestroy.placedCards.some(c => c.gameId === validMessage.districtInGameId);
    }

    public CastPlayerAbility(message: any, playerId: string, players: Players, heroes: HeroesStack, deck: Deck): void {
        const validMessage = GetValidUserMassage(message)!;
        if (validMessage.playerId === "null") return;

        players.GetPlayerWithId(validMessage.playerId).placedCards
            .forEach(c => {
                if (c.gameId === validMessage.districtInGameId) players.GivePlayerGold(playerId, -c.cost, false);
            });

        players.DestroyPlayerDistrict(validMessage.playerId, validMessage.districtInGameId);
        players.InformPlayersAboutDistrictDestroyed(validMessage.playerId, validMessage.districtInGameId);
    }
}