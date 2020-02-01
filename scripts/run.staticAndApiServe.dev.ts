import express from "express";

import serverWebPage, {sendWebPage} from "./router/static/webPage.route";
import usersAvatar from "./router/static/usersAvatar";
import logInfo from "./utils/consoleLogs/logInfo";
import logLink from "./utils/consoleLogs/logLink";
import StaticApi from "./api/static/static.api";
import * as core from "express-serve-static-core";
import dirPath from "./router/dirPaths";
import fileUpload from "express-fileupload";


export default class StaticAndApiServeServerDev extends StaticApi {
   private readonly webPort: number | undefined;
   private readonly publicApp: core.Express | undefined;

   constructor() {
      super({
         avatarStoragePass: dirPath.userAvatarsFolder
      });

      logInfo("Mode: STATIC AND API SERVE");
      logInfo(`Server version: ${process.env.npm_package_version}`);

      logLink(`http://localhost:4466`, "Prisma playground");
      logLink(`http://localhost:4466/_admin`, "Prisma admin panel");

      this.webPort = +process.env.PUBLIC_WEB_AND_API_PORT!;

      this.publicApp = express();
      this.publicApp.use(express.json());
      this.publicApp.use(express.urlencoded({extended: true}));
      this.publicApp.use(fileUpload({
         abortOnLimit: true,
         limits: {fileSize: 50 * 1024 * 1024},
      }));

      this.AppBindPostLoginUser("/api/users/actions/login", this.publicApp);
      this.AppBindPostSignUpUser("/api/users/actions/signUp", this.publicApp);
      this.AppBindPostSendFriendInvite("/api/users/actions/sendFriendInvite", this.publicApp);
      this.AppBindPostChangeUserPublicName("/api/users/actions/changePublicName", this.publicApp);
      this.AppBindPostAcceptUserFriendInvite("/api/users/actions/acceptInvite", this.publicApp);
      this.AppBindPostRejectUserFriendInvite("/api/users/actions/rejectInvite", this.publicApp);
      this.AppBindPostDeleteUserFromFriendsList("/api/users/actions/deleteFriend", this.publicApp);

      this.AppBindPostUploadAvatar("/api/users/actions/uploadAvatar", "avatar", this.publicApp);

      this.AppBindPostChangePasswordRequest("/api/users/actions/changePasswordRequest", this.publicApp);
      this.AppBindPostChangePassword("/api/users/actions/changePassword", this.publicApp);

      this.AppBindGetVerifyUser("/api/users/actions/verify/:name/:verificationLink/", this.publicApp, ("name"), ("verificationLink"));

      this.publicApp.use("/api/users/avatars/", usersAvatar);
      this.publicApp.use("/", serverWebPage);

      sendWebPage("/*", this.publicApp);

      this.publicApp.listen(this.webPort);

      logInfo(`Web listening at port ${this.webPort}`);
      logLink(`http://localhost:${this.webPort}/`, "Web");
   }
}