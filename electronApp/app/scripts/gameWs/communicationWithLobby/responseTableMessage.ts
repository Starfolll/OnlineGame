import {
   tableActionDeclareTable,
   tableActionEndGame,
   tableActionPlayerBuiltCard,
   tableActionPlayerReceivedCard,
   tableActionPlayerReceivedGold,
   tableActionRemoveCardFromHand,
   tableActionRevealPlayerHero,
   tableActionSetHeroesWeightToPickFrom,
   tableActionSetInitialTurnOptions,
   tableActionSetPlayerTurn,
   tableActionSetShiftedHeroes,
   tableActionsSetBuildLimit,
   tableActionsSetPlayerAbilityTurnType,
   tableActionsSetProposedCards
} from "../../../store/actions/table/table.actions";
import {
   cardInfo,
   heroAbilityTypes,
   playerEndGameScoreTable,
   tableWidthActions
} from "../../../store/actions/table/table.actions.types";
import {initialHeroTurnOptions} from "./informGameMessages.types";


export default class GameTableResponse {
   public static GameTableInfo(dispatch: Function, gameTable: tableWidthActions): void {
      dispatch(tableActionDeclareTable(gameTable));
   }

   public static HeroPickTurnStart(dispatch: Function, heroesShiftedWeight: Array<number>, playerIdTurn: string, heroesWeightLeft?: Array<number>): void {
      dispatch(tableActionSetPlayerTurn(playerIdTurn));
      dispatch(tableActionSetShiftedHeroes(heroesShiftedWeight));

      if (!!heroesWeightLeft) dispatch(tableActionSetHeroesWeightToPickFrom(heroesWeightLeft!));
   }

   public static PickHero(dispatch: Function, playerIdTurn: string, heroesWeightLeft?: Array<number>): void {
      dispatch(tableActionSetPlayerTurn(playerIdTurn));

      if (!!heroesWeightLeft) dispatch(tableActionSetHeroesWeightToPickFrom(heroesWeightLeft));
   }

   public static HeroInitialTurnStarted(dispatch: Function, playerId: string, heroId: number, actions?: Array<initialHeroTurnOptions>): void {
      dispatch(tableActionSetPlayerTurn(playerId));

      if (!!actions) dispatch(tableActionSetInitialTurnOptions(actions!));
      else dispatch(tableActionRevealPlayerHero(playerId, heroId));
   }

   public static PickOneOfProposedCards(dispatch: Function, cards: Array<cardInfo>): void {
      dispatch(tableActionsSetProposedCards(cards));
   }

   public static HeroBuildTurnStarted(dispatch: Function, playerId: string, buildLimit?: number): void {
      dispatch(tableActionSetPlayerTurn(playerId));

      if (!!buildLimit) dispatch(tableActionsSetBuildLimit(buildLimit));
   }

   public static HeroAbilityTurnStarted(dispatch: Function, heroAbilityType: heroAbilityTypes): void {
      dispatch(tableActionsSetPlayerAbilityTurnType(heroAbilityType));
   }

   public static PlayerBuiltDistrict(dispatch: Function, playerId: string, card: cardInfo): void {
      dispatch(tableActionRemoveCardFromHand(playerId, card));
      dispatch(tableActionPlayerBuiltCard(playerId, card));
   }

   public static PlayerReceivedGold(dispatch: Function, count: number, playerId: string): void {
      dispatch(tableActionPlayerReceivedGold(count, playerId));
   }

   public static PlayerReceivedCard(dispatch: Function, card: cardInfo, playerId: string): void {
      dispatch(tableActionPlayerReceivedCard(card, playerId));
   }

   public static GameEnd(dispatch: Function, scoreTable: Array<playerEndGameScoreTable>): void {
      dispatch(tableActionEndGame(scoreTable));
   }
}
