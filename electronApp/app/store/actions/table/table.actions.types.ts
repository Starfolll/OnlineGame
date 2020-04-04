import {chatMessageInfo} from "../globalLobby/globalLobby.actions.types";


type turnsType =
   "waitingForPlayers" |
   "gameStarted" |
   "heroPickTurn" |
   "initialTurn" |
   "heroAbilityTurn" |
   "buildTurn";

export type cardClass =
   "yellow" |
   "red" |
   "purple" |
   "blue" |
   "green" |
   "all";

export type cardInfo = {
   id: number;
   name: string;
   cost: number;
   cardClass: cardClass;
   description: string;
   gameId: number;
}

export type playerInfo = {
   userId: string;
   name: string;

   isPlayerDisconnected: boolean;

   isKing: boolean;
   isHeroPickTurnMade: boolean;
   isInitialHeroTurnMade: boolean;
   isAbilityTurnMade: boolean;
   isBuildTurnMade: boolean;
   isMyTurn: boolean;

   heroPickTurnNumber: number | undefined;
   heroPickInitialTurnNumber: number | undefined;

   heroesWeightToPickFrom?: Array<number> | undefined;
   initialTurnOptionsToPickFrom?: Array<string> | undefined;
   initialTurnCardsToPickFrom?: Array<cardInfo> | undefined;
   abilityTurnType?: heroAbilityTypes | undefined;
   buildLimit?: number | undefined;

   hand?: Array<cardInfo>;
   pickedHeroWeight?: number | undefined;
   gold: number;
   placedCards: Array<cardInfo>;
   maxSameCardsAmount: number;
   cardsAmountInHand: number;
};

export type tableInfoWithPlayers = {
   tableInfo: tableInfo;
   players: Array<playerInfo>;
}

export type tableInfo = {
   isGameStarted: boolean;
   isGameEnd: boolean;

   heroes: Array<heroInfo>;
   shiftedHeroesWeight: Array<number>;

   currentTurnType: turnsType;

   cardsInDeck: number;

   chatMessages: Array<chatMessageInfo>;
};

export type heroAbilityTypes =
   "disableHero" |
   "robbHero" |
   "changeHand" |
   "destroyDistrict";

export type heroBuffsTypes =
   "untouchable" |
   "overBuild" |
   "instanceGold" |
   "instanceCard" |
   "king" |
   "goldForYellowDistricts" |
   "goldForBlueDistricts" |
   "goldForGreenDistricts" |
   "goldForRedDistricts";

export type heroDebuffsTypes =
   "killed" |
   "robbed";

export type debuffWithMetadata = {
   debuffType: heroDebuffsTypes,
   fromPlayerId: string,
   additionData?: any
}

export type heroInfo = {
   id: number;
   name: string;
   weight: number;
   description: string;
   ability: heroAbilityTypes | undefined;
   buffs: Array<heroBuffsTypes>;
   debuffs: Array<debuffWithMetadata>;
}


const DECLARE_TABLE = "DECLARE_TABLE";

interface DeclareTable {
   type: typeof DECLARE_TABLE;
   tableDataWithPlayers: tableInfoWithPlayers;
}

export type tableActionsTypes = DeclareTable;
