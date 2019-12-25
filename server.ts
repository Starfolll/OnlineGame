import dotenv from "dotenv";
import {runUpdate} from "./scripts/run.update";

import logError from "./scripts/utils/consoleLogs/logError";
import logInfo from "./scripts/utils/consoleLogs/logInfo";
import GameManagerServerDev from "./scripts/run.gameManager.dev";

(async () => {
    logInfo("booting server");
    dotenv.config();

    const webPort: number = +process.env.WEB_PORT!;
    const gameWSPort: number = +process.env.GAME_WS_Port!;
    const globalLobbyWSPort: number = +process.env.GLOBAL_LOBBY_WS_PORT!;

    const isDev: boolean = process.argv.some(arg => arg === "--dev");
    const update: boolean = process.argv.some(arg => arg === "--update");

    if (update) {
        await runUpdate();
        return;
    }

    let serverMode: string | undefined = "";
    for (const arg of process.argv) {
        const isArgIsServerMode =
            arg === "--server-mode-games-manager" ||
            arg === "--server-mode-lobby-manager" ||
            arg === "--server-mode-static-and-api-serve";

        if (isArgIsServerMode)
            if (!!serverMode) {
                logError("More than one server mode");
                return;
            } else serverMode = arg;
    }

    if (!serverMode) {
        logError("No server mode set");
        return;
    }

    switch (serverMode) {
        case "--server-mode-games-manager":
            if (isDev) new GameManagerServerDev();
            break;

        case "--server-mode-lobby-manager":
            break;

        case "--server-mode-static-and-api-serve":
            break;
    }
})();