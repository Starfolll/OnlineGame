import {tableData} from "../../models/table/table";
import {Decks} from "../../gamesManager/gameTableManager/deck/decks";
import {HeroesStacks} from "../../gamesManager/gameTableManager/heroesStacks/heroesStacks";
import {GamesManager} from "../../gamesManager/gamesManager";
import * as core from "express-serve-static-core";

export default class GamesManagerApi {
    protected AppBindPostCreateNewGameTable(route: string, app: core.Express, gamesManager: GamesManager): void {
        app.post(route, async (req, res) => {
            const data = req.body;
            const usersId = data.usersId;

            res.json(await this.CreateNewGameTable({usersId: usersId}, gamesManager));
        });
    }

    private async CreateNewGameTable(tableUsers: { usersId: Array<string> }, gamesManager: GamesManager): Promise<tableData> {
        return (await gamesManager!.CreateNewTable(
            tableUsers,
            Decks.defaultDeck,
            HeroesStacks.defaultStack
        ));
    }
}