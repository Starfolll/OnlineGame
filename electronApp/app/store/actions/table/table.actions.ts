import {tableActionsTypes, tableInfoWithPlayers} from "./table.actions.types";


export const tableActionsDeclareTable = (tableDataWithPlayers: tableInfoWithPlayers): tableActionsTypes => {
   return {
      type: "DECLARE_TABLE", tableDataWithPlayers
   };
};
