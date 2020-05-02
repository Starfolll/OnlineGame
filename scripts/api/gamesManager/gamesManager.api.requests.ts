import {tableData} from "../../models/table/table";
import dotenv from "dotenv";


dotenv.config();
export default class GamesManagerApiRequests {
   public static async CreateNewTable(usersIdInRoom: Array<string>): Promise<tableData> {
      const res = await fetch(`http://${process.env.USE_DOCKER === "true" ? "games-manager" : "localhost"}:8015/api/create-new-game-table`, {
         headers: {"Content-Type": "application/json"},
         method: "POST",
         body: JSON.stringify({
            usersId: usersIdInRoom
         })
      });
      return await res.json();
   }
}
