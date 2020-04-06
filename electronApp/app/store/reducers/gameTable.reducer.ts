import {tableActionsTypes, tableInfoWithPlayers} from "../actions/table/table.actions.types";


export default function gameTableReducer(
   state: tableInfoWithPlayers | null = null,
   action: tableActionsTypes
): any {
   switch (action.type) {
      case "DECLARE_TABLE":
         return action.gameTable;

      default:
         return state;
   }
};
