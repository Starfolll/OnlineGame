"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webPage_route_1 = __importStar(require("./router/static/webPage.route"));
const usersAvatar_1 = __importDefault(require("./router/static/usersAvatar"));
const logInfo_1 = __importDefault(require("./utils/consoleLogs/logInfo"));
const logLink_1 = __importDefault(require("./utils/consoleLogs/logLink"));
const static_api_1 = __importDefault(require("./api/static/static.api"));
const dirPaths_1 = __importDefault(require("./router/dirPaths"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
class StaticAndApiServeServerDev extends static_api_1.default {
    constructor() {
        super({
            avatarStoragePass: dirPaths_1.default.userAvatarsFolder
        });
        logInfo_1.default("Mode: STATIC AND API SERVE");
        logInfo_1.default(`Server version: ${process.env.npm_package_version}`);
        logLink_1.default(`http://localhost:4466`, "Prisma playground");
        logLink_1.default(`http://localhost:4466/_admin`, "Prisma admin panel");
        this.webPort = +process.env.PUBLIC_WEB_AND_API_PORT;
        this.publicApp = express_1.default();
        this.publicApp.use(express_1.default.json());
        this.publicApp.use(express_1.default.urlencoded({ extended: true }));
        this.publicApp.use(express_fileupload_1.default({
            abortOnLimit: true,
            limits: { fileSize: 50 * 1024 * 1024 },
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
        this.publicApp.use("/api/users/avatars/", usersAvatar_1.default);
        this.publicApp.use("/", webPage_route_1.default);
        webPage_route_1.sendWebPage("*", this.publicApp);
        this.publicApp.listen(this.webPort);
        logInfo_1.default(`Web listening at port ${this.webPort}`);
        logLink_1.default(`http://localhost:${this.webPort}/`, "Web");
    }
}
exports.default = StaticAndApiServeServerDev;
