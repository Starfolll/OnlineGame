import {tableActionsTypes, tableInfoWithPlayers} from "../actions/table/table.actions.types";


export default function tableReducer(
   state: tableInfoWithPlayers | null = null,
   action: tableActionsTypes
): any {
   switch (action.type) {
      case "DECLARE_TABLE":
         return action.tableDataWithPlayers;

      default:
         return state;
   }
};
