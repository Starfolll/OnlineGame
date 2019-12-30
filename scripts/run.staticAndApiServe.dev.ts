import express from "express";

import webPageRoute from "./router/static/webPage.route";
import usersAvatar from "./router/static/usersAvatar";
import logInfo from "./utils/consoleLogs/logInfo";
import logLink from "./utils/consoleLogs/logLink";
import {StartLoggingSystemStatsTimeout} from "./utils/consoleLogs/logSystemInfo";


export default class StaticAndApiServeServerDev {
    private webPort: number | undefined;

    constructor() {
        (async () => {
            // console.clear();
            // logLetters("hi!");
            // logLetters("dev +_+");
            // console.log();

            // console.log();
            logInfo("Mode: STATIC AND API SERVE");
            logInfo(`Server version: ${process.env.npm_package_version}`);
            StartLoggingSystemStatsTimeout(120000 * 3);
            // console.log();

            logLink(`http://localhost:4466`, "Prisma playground");
            logLink(`http://localhost:4466/_admin`, "Prisma admin panel");
            // console.log();

            this.webPort = +process.env.PUBLIC_WEB_AND_API_PORT!;

            const app = express();

            app.use("/", webPageRoute);
            app.use("/usersAvatars", usersAvatar);

            app.listen(this.webPort);
            logInfo(`Web listening at port ${this.webPort}`);
            // console.log();
        })();
    }
}