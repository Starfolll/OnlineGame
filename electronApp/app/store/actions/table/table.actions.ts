import {tableActionsTypes, tableInfoWithPlayers} from "./table.actions.types";


export const tableActionsDeclareTable = (gameTable: tableInfoWithPlayers): tableActionsTypes => {
   return {
      type: "DECLARE_TABLE", gameTable
   };
};
