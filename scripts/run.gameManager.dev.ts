import WebSocket from "ws";
import express from "express";
import * as core from "express-serve-static-core";
import logInfo from "./utils/consoleLogs/logInfo";

import {GamesManager} from "./gamesManager/gamesManager";
import {StartLoggingSystemStatsTimeout} from "./utils/consoleLogs/logSystemInfo";
import {Decks} from "./gamesManager/gameTableManager/deck/decks";
import {HeroesStacks} from "./gamesManager/gameTableManager/heroesStacks/heroesStacks";
import logLink from "./utils/consoleLogs/logLink";
import dockerPrisma from "./models/dockerPrisma";


export default class GameManagerServerDev {
    private gamesManager: GamesManager | undefined;
    private privateApiApp: core.Express | undefined;

    private publicGameWSPort: number | undefined;
    private privateApiPort: number | undefined;

    constructor() {
        (async () => {
            // console.clear();
            // logLetters("hi!");
            // logLetters("dev +_+");
            // console.log();

            // console.log();
            logInfo("Mode: GAME MANAGER");
            logInfo(`Server version: ${process.env.npm_package_version}`);
            StartLoggingSystemStatsTimeout(120000 * 3);
            // console.log();

            logLink(`http://localhost:4466`, "Prisma playground");
            logLink(`http://localhost:4466/_admin`, "Prisma admin panel");
            // console.log();

            await dockerPrisma.deleteManyTables();

            this.privateApiPort = +process.env.PRIVATE_GAME_API_PORT!;
            this.publicGameWSPort = +process.env.PUBLIC_GAME_WS_PORT!;

            this.privateApiApp = express();
            this.gamesManager = new GamesManager(
                new WebSocket.Server({
                    port: this.publicGameWSPort
                })
            );

            this.privateApiApp.use(express.json());
            this.AppBindPostCreateNewGameTable();

            this.privateApiApp.listen(this.privateApiPort);
            logInfo(`Games manager API listening at port ${this.privateApiPort}`);
            logInfo(`Games manager WS listening at port ${this.publicGameWSPort}`);
            // console.log();
        })();
    }

    private AppBindPostCreateNewGameTable(): void {
        this.privateApiApp!.post("/api/create-new-game-table", async (req, res) => {
            const data = req.body;
            const usersId = data.usersId;

            const tableId = await this.CreateNewGameTable({usersId: usersId});
            res.json({tableId: tableId});
        });
    }

    private async CreateNewGameTable(tableUsers: { usersId: Array<string> }): Promise<string> {
        return (await this.gamesManager!.CreateNewTable(
            tableUsers,
            Decks.defaultDeck,
            HeroesStacks.defaultStack
        )).id;
    }
}