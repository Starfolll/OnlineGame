import WebSocket from "ws";
import express from "express";
import * as core from "express-serve-static-core";
import logInfo from "./utils/consoleLogs/logInfo";

import {GamesManager} from "./gamesManager/gamesManager";
import wrappedPrisma from "./models/wrappedPrisma";
import GamesManagerApi from "./api/gamesManager/gamesManager.api";


export default class GameManagerServerDev extends GamesManagerApi {
   private gamesManager: GamesManager | undefined;
   private privateApiApp: core.Express | undefined;

   private publicGameWSPort: number | undefined;
   private privateApiPort: number | undefined;

   constructor() {
      super();

      (async () => {
         logInfo("Mode: GAME MANAGER");
         logInfo(`Server version: ${process.env.npm_package_version}`);

         await wrappedPrisma.deleteManyTables();

         this.privateApiPort = +process.env.PRIVATE_GAME_API_PORT!;
         this.publicGameWSPort = +process.env.PUBLIC_GAME_WS_PORT!;

         this.privateApiApp = express();
         this.gamesManager = new GamesManager(
            new WebSocket.Server({
               port: this.publicGameWSPort
            })
         );

         this.privateApiApp.use(express.json());
         this.AppBindPostCreateNewGameTable("/api/create-new-game-table", this.privateApiApp, this.gamesManager);

         this.privateApiApp.listen(this.privateApiPort);
         logInfo(`Games manager API listening at port ${this.privateApiPort}`);
         logInfo(`Games manager WS listening at port ${this.publicGameWSPort}`);
      })();
   }
}