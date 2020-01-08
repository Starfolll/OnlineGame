import express from "express";

import serverWebPage, {sendWebPage} from "./router/static/webPage.route";
import usersAvatar from "./router/static/usersAvatar";
import logInfo from "./utils/consoleLogs/logInfo";
import logLink from "./utils/consoleLogs/logLink";
import {StartLoggingSystemStatsTimeout} from "./utils/consoleLogs/logSystemInfo";
import StaticApi from "./api/static/static.api";
import * as core from "express-serve-static-core";


export default class StaticAndApiServeServerDev extends StaticApi {
    private webPort: number | undefined;
    private publicApp: core.Express | undefined;


    constructor() {
        super();
        (async () => {
            logInfo("Mode: STATIC AND API SERVE");
            logInfo(`Server version: ${process.env.npm_package_version}`);
            StartLoggingSystemStatsTimeout(120000 * 3);

            logLink(`http://localhost:4466`, "Prisma playground");
            logLink(`http://localhost:4466/_admin`, "Prisma admin panel");

            this.webPort = +process.env.PUBLIC_WEB_AND_API_PORT!;

            this.publicApp = express();
            this.publicApp.use(express.json());

            this.AppBindPostLoginUser("/api/users/actions/login", this.publicApp);
            this.AppBindPostSignUpUser("/api/users/actions/signUp", this.publicApp);
            this.AppBindPostSendFriendInvite("/api/users/actions/sendFriendInvite", this.publicApp);
            this.AppBindPostChangeUserPublicName("/api/users/actions/changePublicName", this.publicApp);
            this.AppBindPostAcceptUserFriendInvite("/api/users/actions/acceptInvite", this.publicApp);
            this.AppBindPostRejectUserFriendInvite("/api/users/actions/rejectInvite", this.publicApp);
            this.AppBindPostDeleteUserFromFriendsList("/api/users/actions/deleteFriend", this.publicApp);

            this.AppBindGetVerifyUser(
                "/api/users/actions/verify/:name/:verificationLink/",
                this.publicApp,
                "name",
                "verificationLink"
            );

            this.publicApp.use("/api/users/avatars/", usersAvatar);
            this.publicApp.use("/", serverWebPage);
            sendWebPage("/*", this.publicApp);

            this.publicApp.listen(this.webPort);
            logInfo(`Web listening at port ${this.webPort}`);
            logLink(`http://localhost:${this.webPort}/`, "Web");
        })();
    }
}