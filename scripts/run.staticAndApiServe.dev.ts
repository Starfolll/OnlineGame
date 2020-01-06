import express from "express";

import webPageRoute from "./router/static/webPage.route";
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
            this.publicApp.use("/", webPageRoute);
            this.publicApp.use("/api/users/avatars/", usersAvatar);

            this.AppBindPostLoginUser("/api/users/actions/login", this.publicApp);
            this.AppBindPostSignUpUser("/api/users/actions/signUp", this.publicApp);
            this.AppBindPostSendFriendInvite("/api/users/actions/sendInvite", this.publicApp);
            this.AppBindPostAcceptUserFriendInvite("/api/users/actions/acceptInvite", this.publicApp);
            this.AppBindPostRejectUserFriendInvite("/api/users/actions/rejectInvite", this.publicApp);
            this.AppBindPostDeleteUserFromFriendsList("/api/users/actions/deleteFriend", this.publicApp);

            this.AppBindGetVerifyUser(
                "/api/users/actions/verify/:name/:verificationLink/",
                this.publicApp,
                "name",
                "verificationLink"
            );

            this.publicApp.listen(this.webPort);
            logInfo(`Web listening at port ${this.webPort}`);

            // api test //
            //
            // await fetch(`http://localhost:${this.webPort}/api/users/actions/signUp`, {
            //     method: "POST",
            //     headers: {"Content-Type": "application/json"},
            //     body: JSON.stringify({
            //         email: "andrey.kovyarov@gmail.com",
            //         password: "1234567890",
            //         name: "andrey",
            //         publicName: "Starfolll"
            //     })
            // })
            //     .then(res => res.json())
            //     .then(data => console.log(JSON.stringify(data, null, 2)));
            //
            // await fetch(`http://localhost:${this.webPort}/api/users/actions/signUp`, {
            //     method: "POST",
            //     headers: {"Content-Type": "application/json"},
            //     body: JSON.stringify({
            //         email: "admin.admin1@gmail.com",
            //         password: "1234567890",
            //         name: "admin1",
            //         publicName: "admin"
            //     })
            // })
            //     .then(res => res.json())
            //     .then(data => console.log(JSON.stringify(data, null, 2)));
            // //
            // await fetch(`http://localhost:${this.webPort}/api/users/actions/sendInvite`, {
            //     method: "POST",
            //     headers: {"Content-Type": "application/json"},
            //     body: JSON.stringify({
            //         email: "andrey.kovyarov@gmail.com",
            //         password: "1234567890"
            //     })
            // })
            //     .then(res => res.json())
            //     .then(data => console.log(JSON.stringify(data, null, 2)));
            // //
            // await fetch(`http://localhost:${this.webPort}/api/users/actions/login`, {
            //     method: "POST",
            //     headers: {"Content-Type": "application/json"},
            //     body: JSON.stringify({
            //         email: "andrey.kovyarov@gmail.com",
            //         password: "1234567890"
            //     })
            // })
            //     .then(res => res.json())
            //     .then(data => console.log(JSON.stringify(data, null, 2)));
            // //
            // await fetch(`http://localhost:${this.webPort}/api/users/actions/verify/admin1/15gDYRYMsg6wgtYbZr41K6ye2sCVniLY6odZemFOVcFrxJ8Wjuu15JGQ7-wJhLlH~iyIcRh_d6d_gw4NC-7PsOrb9T5iJVhzD9YD6oCs4si0rohRYhba72i0/`)
            //     .then(res => res.text())
            //     .then(data => console.log(data));
            //
            // await fetch(`http://localhost:${this.webPort}/api/users/actions/login`, {
            //     method: "POST",
            //     headers: {"Content-Type": "application/json"},
            //     body: JSON.stringify({
            //         email: "admin1@admin.com",
            //         password: "1234567890"
            //     })
            // })
            //     .then(res => res.json())
            //     .then(data => console.log(JSON.stringify(data, null, 2)));
        })();
    }
}