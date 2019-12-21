import {runDevelopmentBuild} from "./scripts/run.dev";
import {runProductionBuild} from "./scripts/run.prod";
import {runUpdate} from "./scripts/run.update";

import dotenv from "dotenv";

(async () => {
    const env = dotenv.config();

    const webPort: number = +process.env.WEB_PORT!;
    const gameWSPort: number = +process.env.GAME_WS_Port!;
    const globalLobbyWSPort: number = +process.env.GLOBAL_LOBBY_WS_PORT!;

    const isDev: boolean = process.argv.some(arg => arg === "--dev");
    const update: boolean = process.argv.some(arg => arg === "--update");

    if (update) {
        await runUpdate();
        return;
    }

    if (isDev) await runDevelopmentBuild(webPort, gameWSPort, globalLobbyWSPort);
    else await runProductionBuild(webPort, gameWSPort);
})();