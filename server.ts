import {runDevelopmentBuild} from "./scripts/run.dev";
import {runProductionBuild} from "./scripts/run.prod";
import {runUpdate} from "./scripts/run.update";

(async () => {
    const webPort: number = +process.env.npm_package_config_webPort!;
    const gameWSPort: number = +process.env.npm_package_config_gameWSPort!;
    const globalLobbyWSPort: number = +process.env.npm_package_config_globalLobbyWSPort!;

    const isDev: boolean = process.argv.some(arg => arg === "--dev");
    const update: boolean = process.argv.some(arg => arg === "--update");

    if (update) {
        await runUpdate();
        return;
    }

    if (isDev) await runDevelopmentBuild(webPort, gameWSPort, globalLobbyWSPort);
    else await runProductionBuild(webPort, gameWSPort);
})();