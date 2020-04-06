import {tableActionsDeclareTable} from "../../../store/actions/table/table.actions";
import {tableInfoWithPlayers} from "../../../store/actions/table/table.actions.types";


export default class GameTableResponse {
   public static GameTableInfo(dispatch: Function, gameTable: tableInfoWithPlayers): void {
      dispatch(tableActionsDeclareTable(gameTable));
   }
}
