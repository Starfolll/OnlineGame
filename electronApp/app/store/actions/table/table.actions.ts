import {initialHeroTurnOptions} from "../../../scripts/gameWs/communicationWithLobby/informGameMessages.types";
import {
   cardInfo,
   heroAbilityTypes,
   playerEndGameScoreTable,
   tableActionsTypes,
   tableWidthActions
} from "./table.actions.types";


export const tableActionDeclareTable = (gameTable: tableWidthActions): tableActionsTypes => ({
   type: "DECLARE_TABLE", gameTable
});

export const tableActionSetPlayerTurn = (playerId: string): tableActionsTypes => ({
   type: "SET_PLAYER_TURN", playerId
});

export const tableActionSetShiftedHeroes = (heroes: Array<number>): tableActionsTypes => ({
   type: "SET_SHIFTED_HEROES", heroes
});

export const tableActionSetHeroesWeightToPickFrom = (heroes: Array<number> | undefined): tableActionsTypes => ({
   type: "SET_HEROES_WEIGHT_TO_PICK_FROM", heroes
});

export const tableActionSetInitialTurnOptions = (actions: Array<initialHeroTurnOptions> | undefined): tableActionsTypes => ({
   type: "SET_INITIAL_TURN_OPTIONS", actions
});

export const tableActionsSetProposedCards = (cards: Array<cardInfo> | undefined): tableActionsTypes => ({
   type: "SET_PROPOSED_CARD", cards
});

export const tableActionsSetBuildLimit = (buildLimit: number | undefined): tableActionsTypes => ({
   type: "SET_BUILD_LIMIT", buildLimit
});

export const tableActionsSetPlayerAbilityTurnType = (heroAbilityType: heroAbilityTypes | undefined): tableActionsTypes => ({
   type: "SET_HERO_ABILITY_TURN_TYPE", heroAbilityType
});

export const tableActionRevealPlayerHero = (playerId: string, heroId: number): tableActionsTypes => ({
   type: "REVEAL_PLAYER_HERO", playerId, heroId
});

export const tableActionRemoveCardFromHand = (playerId: string, card: cardInfo): tableActionsTypes => ({
   type: "REMOVE_CARD_FROM_HAND", playerId, card
});

export const tableActionPlayerBuiltCard = (playerId: string, card: cardInfo): tableActionsTypes => ({
   type: "PLAYER_BUILT_CARD", playerId, card
});

export const tableActionPlayerReceivedGold = (count: number, playerId: string): tableActionsTypes => ({
   type: "PLAYER_RECEIVED_GOLD", count, playerId
});

export const tableActionPlayerReceivedCard = (card: cardInfo, playerId: string): tableActionsTypes => ({
   type: "PLAYER_RECEIVED_CARD", card, playerId
});

export const tableActionEndGame = (scoreTable: Array<playerEndGameScoreTable>): tableActionsTypes => ({
   type: "GAME_END", scoreTable
});

export const tableActionDeleteTableData = (): tableActionsTypes => ({
   type: "DELETE_TABLE_DATA"
});
