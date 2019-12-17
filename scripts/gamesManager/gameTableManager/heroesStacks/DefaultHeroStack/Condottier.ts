import {debuffWithMetadata, Hero} from "../hero";
import {heroAbilityTypes} from "../heroAbilityTypes";
import {heroBuffsTypes} from "../heroBuffsTypes";
import {Players} from "../../../player/players";
import {HeroesStack} from "../heroesStack";
import {Deck} from "../../deck/deck";


type districtDestroyed = {
    messageType: string;
    playerIdWhichDistrictDestroyed: number;
    districtInGameId: number;
}

const GetValidUserMassage = (message: any): districtDestroyed | undefined => {
    if (typeof message !== "object") return undefined;
    if (!message["messageType"] && message["messageType"] !== "districtDestroyed") return undefined;
    if (!message["playerIdWhichDistrictDestroyed"] && typeof message["playerIdWhichDistrictDestroyed"] !== "number") return undefined;
    if (!message["districtInGameId"] && typeof message["districtInGameId"] !== "number") return undefined;
    return message as districtDestroyed;
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

    public IsPlayerCanMakeAbilityMove(message: any, playerId: number, players: Players, heroes: HeroesStack, deck: Deck): boolean {
        const validMessage = GetValidUserMassage(message);
        if (!validMessage) return false;

        const player = players.GetPlayerWithId(playerId);
        const playerToDestroy = players.GetPlayerWithId(validMessage.playerIdWhichDistrictDestroyed);

        if (!playerToDestroy) return false;
        if (!this.IsPlayerCanUseAbility(player)) return false;
        if (!playerToDestroy.placedCards.some(c => c.gameId === validMessage.districtInGameId && player.HasEnoughGold(c.cost - 1))) return false;
        return playerToDestroy.placedCards.some(c => c.gameId === validMessage.districtInGameId);
    }

    public CastPlayerAbility(message: any, playerId: number, players: Players, heroes: HeroesStack, deck: Deck): void {
        const validMessage = GetValidUserMassage(message)!;

        players.GetPlayerWithId(validMessage.playerIdWhichDistrictDestroyed).placedCards
            .forEach(c => {
                if (c.gameId === playerId) players.GivePlayerGold(playerId, -c.cost);
            });

        players.DestroyPlayerDistrict(validMessage.playerIdWhichDistrictDestroyed, validMessage.districtInGameId);
        players.InformPlayersAboutDistrictDestroyed(validMessage.playerIdWhichDistrictDestroyed, validMessage.districtInGameId);
    }
}