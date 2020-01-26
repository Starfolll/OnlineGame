import dotenv from "dotenv";

import logError from "./scripts/utils/consoleLogs/logError";
import GameManagerServerDev from "./scripts/run.gameManager.dev";
import GlobalLobbyManagerServerDev from "./scripts/run.lobbyManager.dev";
import StaticAndApiServeServerDev from "./scripts/run.staticAndApiServe.dev";

(async () => {
    dotenv.config();

    const isDev: boolean = process.env.BUILD_MODE === "dev";

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
            if (isDev) new GlobalLobbyManagerServerDev();
            break;

        case "--server-mode-static-and-api-serve":
            if (isDev) new StaticAndApiServeServerDev();
            break;
    }
})();