import {runDevelopmentBuild} from "./scripts/run.dev";
import {runProductionBuild} from "./scripts/run.prod";

(async () => {
    const webPort: number = +process.env.npm_package_config_webPort!;
    const gameWSPort: number = +process.env.npm_package_config_gameWSPort!;
    const isDev: any = process.argv.some(arg => arg === "--dev");

    if (isDev) await runDevelopmentBuild(webPort, gameWSPort);
    else await runProductionBuild(webPort, gameWSPort);
})();
