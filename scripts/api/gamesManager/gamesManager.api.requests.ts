import {tableData} from "../../models/table/table";

export default class GamesManagerApiRequests {
    public static async CreateNewTable(usersIdInRoom: Array<string>): Promise<tableData> {
        const res = await fetch("http://games-manager:8015/api/create-new-game-table", {
            headers: {"Content-Type": "application/json"},
            method: "POST",
            body: JSON.stringify({
                usersId: usersIdInRoom
            })
        });
        return await res.json();
    }
}