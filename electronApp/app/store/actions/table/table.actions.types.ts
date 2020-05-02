import {initialHeroTurnOptions} from "../../../scripts/gameWs/communicationWithLobby/informGameMessages.types";
import {tableActions} from "../../../scripts/gameWs/communicationWithLobby/responseTableActions";
import {userPublicData} from "../account/account.actions.types";
import {chatMessageInfo} from "../globalLobby/globalLobby.actions.types";


const SERVER_MESSAGE_GAME_TABLE_INFO = "tableInfo";
const SERVER_MESSAGE_HERO_PICK_TURN_START = "heroPickTurnStart";
const SERVER_MESSAGE_PICK_HERO = "pickHero";
const SERVER_MESSAGE_HERO_INITIAL_TURN_START = "heroInitialTurnStarted";
const SERVER_MESSAGE_PICK_ONE_OF_PROPOSED_CARDS = "pickOneOfProposedCards";
const SERVER_MESSAGE_HERO_BUILD_TURN_STARTED = "heroBuildTurnStarted";
const SERVER_MESSAGE_PLAYER_BUILT_DISTRICT = "playerBuiltDistrict";
const SERVER_MESSAGE_PLAYER_RECEIVED_GOLD = "playerReceivedGold";
const SERVER_MESSAGE_PLAYER_RECEIVED_CARD = "playerReceivedCard";
const SERVER_MESSAGE_HERO_ABILITY_TURN_STARTED = "heroAbilityTurnStarted";
const SERVER_MESSAGE_GAME_END = "gameEnd";

export interface ServerMessageGameTableInfo {
   messageType: typeof SERVER_MESSAGE_GAME_TABLE_INFO;
   gameTable: tableInfoWithPlayers;
}

export interface ServerMessageHeroPickTurnStart {
   messageType: typeof SERVER_MESSAGE_HERO_PICK_TURN_START;
   heroesShiftedWeight: Array<number>;
   heroesWeightLeft: Array<number> | undefined;
   playerIdTurn: string;
}

export interface PickHero {
   messageType: typeof SERVER_MESSAGE_PICK_HERO;
   heroesWeightLeft?: Array<number>;
   playerIdTurn: string;
}

export interface ServerMessageHeroInitialTurnStarted {
   messageType: typeof SERVER_MESSAGE_HERO_INITIAL_TURN_START;
   playerId: string;
   heroId: number;
   options?: Array<initialHeroTurnOptions>;
}

export interface ServerMessagePickOneOfProposedCards {
   messageType: typeof SERVER_MESSAGE_PICK_ONE_OF_PROPOSED_CARDS;
   cards: Array<cardInfo>;
}

export interface ServerMessageHeroBuildTurnStarted {
   messageType: typeof SERVER_MESSAGE_HERO_BUILD_TURN_STARTED;
   buildLimit: number;
   playerId: string;
}

export interface ServerMessagePlayerReceivedGold {
   messageType: typeof SERVER_MESSAGE_PLAYER_RECEIVED_GOLD;
   count: number;
   playerId: string;
}

export interface ServerMessagePlayerReceivedCard {
   messageType: typeof SERVER_MESSAGE_PLAYER_RECEIVED_CARD;
   card: cardInfo;
   playerId: string;
}

export interface ServerMessagePlayerBuiltDistrict {
   messageType: typeof SERVER_MESSAGE_PLAYER_BUILT_DISTRICT;
   playerId: string;
   card: cardInfo;
}

export interface ServerMessageHeroAbilityTurnStarted {
   messageType: typeof SERVER_MESSAGE_HERO_ABILITY_TURN_STARTED;
   heroAbilityType: heroAbilityTypes;
   playerId: string;
}

export interface ServerMessageGameEnd {
   messageType: typeof SERVER_MESSAGE_GAME_END;
   scoreTable: Array<playerEndGameScoreTable>;
}

export type gameTableMessagesResponse =
   ServerMessageGameTableInfo |
   ServerMessageHeroPickTurnStart |
   PickHero |
   ServerMessageHeroInitialTurnStarted |
   ServerMessagePickOneOfProposedCards |
   ServerMessageHeroBuildTurnStarted |
   ServerMessagePlayerBuiltDistrict |
   ServerMessagePlayerReceivedGold |
   ServerMessagePlayerReceivedCard |
   ServerMessageHeroAbilityTurnStarted |
   ServerMessageGameEnd;


export type turnsType =
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
   user: userPublicData;

   connected: boolean;

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

export type tableWidthActions = {
   table: tableInfoWithPlayers;
   actions: tableActions;
}

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

   endGameScoreTable?: Array<playerEndGameScoreTable>;
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

export type playerEndGameScoreTable = {
   playerId: string;
   score: number;
   isWinner: boolean;
   place: number;
}

const DECLARE_TABLE = "DECLARE_TABLE";
const SET_PLAYER_TURN = "SET_PLAYER_TURN";
const SET_SHIFTED_HEROES = "SET_SHIFTED_HEROES";
const SET_HEROES_WEIGHT_TO_PICK_FROM = "SET_HEROES_WEIGHT_TO_PICK_FROM";
const SET_INITIAL_TURN_OPTIONS = "SET_INITIAL_TURN_OPTIONS";
const SET_PROPOSED_CARD = "SET_PROPOSED_CARD";
const SET_BUILD_LIMIT = "SET_BUILD_LIMIT";
const REVEAL_PLAYER_HERO = "REVEAL_PLAYER_HERO";
const REMOVE_CARD_FROM_HAND = "REMOVE_CARD_FROM_HAND";
const PLAYER_BUILT_CARD = "PLAYER_BUILT_CARD";
const SET_HERO_ABILITY_TURN_TYPE = "SET_HERO_ABILITY_TURN_TYPE";
const PLAYER_RECEIVED_GOLD = "PLAYER_RECEIVED_GOLD";
const PLAYER_RECEIVED_CARD = "PLAYER_RECEIVED_CARD";
const GAME_END = "GAME_END";
const DELETE_TABLE_DATA = "DELETE_TABLE_DATA";

interface DeclareTable {
   type: typeof DECLARE_TABLE;
   gameTable: tableWidthActions;
}

interface SetPlayerTurn {
   type: typeof SET_PLAYER_TURN;
   playerId: string;
}

interface SetShiftedHeroes {
   type: typeof SET_SHIFTED_HEROES;
   heroes: Array<number>;
}

interface SetHeroesWeightToPickFrom {
   type: typeof SET_HEROES_WEIGHT_TO_PICK_FROM;
   heroes: Array<number> | undefined;
}

interface SetInitialTurnOptions {
   type: typeof SET_INITIAL_TURN_OPTIONS;
   actions: Array<initialHeroTurnOptions> | undefined;
}

interface SetProposedCard {
   type: typeof SET_PROPOSED_CARD;
   cards: Array<cardInfo> | undefined;
}

interface SetBuildLimit {
   type: typeof SET_BUILD_LIMIT;
   buildLimit: number | undefined;
}

interface SetHeroAbilityTurnType {
   type: typeof SET_HERO_ABILITY_TURN_TYPE;
   heroAbilityType: heroAbilityTypes | undefined;
}

interface RevealPlayerHero {
   type: typeof REVEAL_PLAYER_HERO;
   heroId: number;
   playerId: string;
}

interface RemoveCardFromHand {
   type: typeof REMOVE_CARD_FROM_HAND;
   playerId: string;
   card: cardInfo;
}

interface PlayerBuiltCard {
   type: typeof PLAYER_BUILT_CARD;
   playerId: string;
   card: cardInfo;
}

interface PlayerReceivedGold {
   type: typeof PLAYER_RECEIVED_GOLD;
   count: number;
   playerId: string;
}

interface PlayerReceivedCard {
   type: typeof PLAYER_RECEIVED_CARD;
   card: cardInfo;
   playerId: string;
}

interface GameEnd {
   type: typeof GAME_END;
   scoreTable: Array<playerEndGameScoreTable>;
}

interface DeleteTableData {
   type: typeof DELETE_TABLE_DATA;
}

export type tableActionsTypes =
   DeclareTable |
   SetPlayerTurn |
   SetShiftedHeroes |
   SetHeroesWeightToPickFrom |
   SetInitialTurnOptions |
   SetProposedCard |
   SetBuildLimit |
   RevealPlayerHero |
   RemoveCardFromHand |
   PlayerBuiltCard |
   SetHeroAbilityTurnType |
   PlayerReceivedGold |
   PlayerReceivedCard |
   GameEnd |
   DeleteTableData;
