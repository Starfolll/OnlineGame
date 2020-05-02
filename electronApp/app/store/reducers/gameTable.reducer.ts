import {cardInfo, playerInfo, tableActionsTypes, tableWidthActions} from "../actions/table/table.actions.types";


export default function gameTableReducer(
   state: tableWidthActions | null = null,
   action: tableActionsTypes
): any {
   switch (action.type) {
      case "DECLARE_TABLE":
         return action.gameTable;

      case "SET_PLAYER_TURN":
         if (!!state) state.table.players = state.table.players.map((p: playerInfo) => ({
            ...p,
            isMyTurn: p.user.id === action.playerId
         }));
         return Object.assign({}, state);

      case "SET_HEROES_WEIGHT_TO_PICK_FROM":
         if (!!state)
            for (let i = 0; i < state.table.players.length; i++)
               if (state.table.players[i].isMyTurn)
                  state.table.players[i].heroesWeightToPickFrom = action.heroes;
         return Object.assign({}, state);

      case "SET_SHIFTED_HEROES":
         if (!!state)
            state.table.tableInfo.shiftedHeroesWeight = action.heroes;
         return Object.assign({}, state);

      case "SET_INITIAL_TURN_OPTIONS":
         if (!!state)
            for (let i = 0; i < state.table.players.length; i++)
               if (state.table.players[i].isMyTurn)
                  state.table.players[i].initialTurnOptionsToPickFrom = action.actions;
         return Object.assign({}, state);

      case "SET_PROPOSED_CARD":
         if (!!state)
            for (let i = 0; i < state.table.players.length; i++)
               if (state.table.players[i].isMyTurn)
                  state.table.players[i].initialTurnCardsToPickFrom = action.cards;
         return Object.assign({}, state);

      case "SET_BUILD_LIMIT":
         if (!!state)
            for (let i = 0; i < state.table.players.length; i++)
               if (state.table.players[i].isMyTurn)
                  state.table.players[i].buildLimit = action.buildLimit;
         return Object.assign({}, state);

      case "SET_HERO_ABILITY_TURN_TYPE":
         if (!!state)
            for (let i = 0; i < state.table.players.length; i++)
               if (state.table.players[i].isMyTurn)
                  state.table.players[i].abilityTurnType = action.heroAbilityType;
         return Object.assign({}, state);

      case "REVEAL_PLAYER_HERO":
         if (!!state)
            for (let i = 0; i < state.table.players.length; i++)
               if (state.table.players[i].user.id === action.playerId)
                  state.table.players[i].pickedHeroWeight = action.heroId;
         return Object.assign({}, state);

      case "REMOVE_CARD_FROM_HAND":
         if (!!state)
            for (let i = 0; i < state.table.players.length; i++)
               if (state.table.players[i].user.id === action.playerId)
                  if (!!state.table.players[i].hand)
                     state.table.players[i].hand = state.table.players[i].hand!
                        .filter((c: cardInfo) => c.gameId !== action.card.gameId);
         return Object.assign({}, state);

      case "PLAYER_BUILT_CARD":
         if (!!state)
            for (let i = 0; i < state.table.players.length; i++)
               if (state.table.players[i].user.id === action.playerId) {
                  state.table.players[i].placedCards.push(action.card);
                  if (!!state.table.players[i].buildLimit && !(--state.table.players[i].buildLimit! + 1))
                     delete state.table.players[i].buildLimit;
               }
         return Object.assign({}, state);

      case "PLAYER_RECEIVED_GOLD":
         if (!!state)
            for (let i = 0; i < state.table.players.length; i++)
               if (state.table.players[i].user.id === action.playerId)
                  state.table.players[i].gold += action.count;
         return Object.assign({}, state);

      case "PLAYER_RECEIVED_CARD":
         if (!!state)
            for (let i = 0; i < state.table.players.length; i++)
               if (state.table.players[i].user.id === action.playerId) {
                  if (!!state.table.players[i].hand) state.table.players[i].hand!.push(action.card);
                  state.table.players[i].cardsAmountInHand++;
               }
         return Object.assign({}, state);

      case "GAME_END":
         if (!!state) state.table.tableInfo.endGameScoreTable = action.scoreTable;
         return Object.assign({}, state);

      case "DELETE_TABLE_DATA":
         return null;

      default:
         return state;
   }
};
