"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const db_users_1 = __importDefault(require("../../models/user/db_users"));
const static_api_reqValidationsSchemas_1 = require("./static.api.reqValidationsSchemas");
const transporter_account_1 = __importDefault(require("../../mailer/transporter.account"));
const transporter_emails_1 = __importDefault(require("../../mailer/transporter.emails"));
const crypto_random_string_1 = __importDefault(require("crypto-random-string"));
const user_1 = __importDefault(require("../../models/user/user"));
const dotenv_1 = __importDefault(require("dotenv"));
const uniqid_1 = __importDefault(require("uniqid"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
class StaticApi {
    constructor(apiConfigs) {
        this.usersInvitesLimit = +process.env.PUBLIC_WEB_AND_API_USERS_INVITES_LIMIT;
        this.usersFriendsLimit = +process.env.PUBLIC_WEB_AND_API_USERS_FRIENDS_LIMIT;
        this.automaticValidateUsers = process.env.AUTOMATIC_VALIDATE_USERS === "true";
        this.avatarStoragePath = apiConfigs.avatarStoragePass;
    }
    AppBindPostLoginUser(route, app) {
        app.post(route, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { error } = joi_1.default.validate(body, static_api_reqValidationsSchemas_1.staticApiRequestValidationSchemas.userLoginSchema);
            if (!!error)
                return res.status(400).json({
                    "verified": false,
                    "error": error,
                });
            const userData = yield db_users_1.default.GetUserDataByEmailAndPassword(body.email, body.password);
            if (!userData)
                return res.status(400).json({
                    "verified": false,
                    "error": "Wrong password or email"
                });
            if (!userData.isVerified)
                return res.status(400).json({
                    "verified": false,
                    "error": "Verify four email"
                });
            res.status(200).json({
                "verified": true,
                "userData": yield (new user_1.default(userData)).GetUserOnLoginData()
            });
        }));
    }
    AppBindPostSignUpUser(route, app) {
        app.post(route, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { error } = joi_1.default.validate(body, static_api_reqValidationsSchemas_1.staticApiRequestValidationSchemas.userSignUpSchema);
            if (!!error)
                return res.status(400).json({
                    "verified": false,
                    "error": error,
                });
            const usersWithEmail = yield db_users_1.default.GetUserData({ email: body.email });
            const usersWithName = yield db_users_1.default.GetUserData({ name: body.name });
            if (!!usersWithEmail || usersWithName)
                return res.status(400).json({
                    "verified": false,
                    "error": {
                        "isEmailUsed": !!usersWithEmail,
                        "isNameUsed": !!usersWithName
                    }
                });
            const verificationLink = !this.automaticValidateUsers ? crypto_random_string_1.default({ length: 120, type: "url-safe" }) : null;
            yield db_users_1.default.CreateNewUser({
                verificationLink,
                isVerified: this.automaticValidateUsers,
                email: body.email,
                name: body.name,
                password: body.password,
                publicName: body.publicName
            });
            if (!this.automaticValidateUsers)
                yield transporter_account_1.default.sendMail(transporter_emails_1.default.verificationUserEmail(body.email, `http://localhost:8000/api/users/actions/verify/${body.name}/${verificationLink}`));
            res.status(200).send({
                "verified": true,
                "info": !this.automaticValidateUsers ? "Check your email" : "Welcome"
            });
        }));
    }
    AppBindPostSendFriendInvite(route, app) {
        app.post(route, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { error } = joi_1.default.validate(body, static_api_reqValidationsSchemas_1.staticApiRequestValidationSchemas.userSendFriendInviteSchema);
            if (!!error)
                return res.status(400).json({
                    "sent": false,
                    "error": error,
                });
            const userData = yield db_users_1.default.GetUserDataByIdAndToken(body.id, body.token);
            if (!userData || !userData.isVerified || userData.name === body.name)
                return res.status(400).json({
                    "sent": false,
                    "error": "invalid data"
                });
            const userToInviteData = yield db_users_1.default.GetUserData({ name: body.name });
            if (!userToInviteData || !userToInviteData.isVerified)
                return res.status(400).json({
                    "sent": false,
                    "error": "invalid data"
                });
            const userToInvite = new user_1.default(userToInviteData);
            if ((yield userToInvite.GetUserFriends()).some(u => u.id === body.id))
                return res.status(400).json({
                    "sent": false,
                    "error": "you are already friends with that user"
                });
            if ((yield userToInvite.GetUserInvites()).length >= this.usersInvitesLimit)
                return res.status(400).json({
                    "sent": false,
                    "error": "invite list full"
                });
            const user = new user_1.default(userData);
            if ((yield user.GetUserInvites()).some(i => i.id === userToInvite.id))
                return res.status(400).json({
                    "sent": false,
                    "error": "you already have invite from this user"
                });
            yield user.SendUserInvite({ id: userToInviteData.id });
            res.status(200).send({
                "sent": true
            });
        }));
    }
    AppBindPostAcceptUserFriendInvite(route, app) {
        app.post(route, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { error } = joi_1.default.validate(body, static_api_reqValidationsSchemas_1.staticApiRequestValidationSchemas.userAcceptFriendsInviteSchema);
            if (!!error)
                return res.status(400).json({
                    "accepted": false,
                    "error": error,
                });
            const userData = yield db_users_1.default.GetUserDataByIdAndToken(body.id, body.token);
            if (!userData || !userData.isVerified)
                return res.status(400).json({
                    "accepted": false,
                    "error": "invalid data"
                });
            const user = new user_1.default(userData);
            const userInvites = yield user.GetUserInvites();
            if (userInvites.length >= this.usersFriendsLimit || !userInvites.some(f => f.id === body.friendId))
                return res.status(400).json({
                    "accepted": false,
                    "error": "invalid data"
                });
            yield user.AcceptUserFriendInvite({ id: body.friendId });
            res.status(200).json({
                "accepted": true
            });
        }));
    }
    AppBindPostRejectUserFriendInvite(route, app) {
        app.post(route, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { error } = joi_1.default.validate(body, static_api_reqValidationsSchemas_1.staticApiRequestValidationSchemas.userRejectFriendInviteSchema);
            if (!!error)
                return res.status(400).json({
                    "rejected": false,
                    "error": error,
                });
            const userData = yield db_users_1.default.GetUserDataByIdAndToken(body.id, body.token);
            if (!userData || !userData.isVerified)
                return res.status(400).json({
                    "rejected": false,
                    "error": "invalid data"
                });
            const user = new user_1.default(userData);
            const userInvites = yield user.GetUserInvites();
            if (!userInvites.some(i => i.id === body.inviteUserId))
                return res.status(400).json({
                    "rejected": false,
                    "error": "invalid data"
                });
            yield user.RejectUserFriendInvite({ id: body.inviteUserId });
            res.send({
                "rejected": true
            });
        }));
    }
    AppBindPostDeleteUserFromFriendsList(route, app) {
        app.post(route, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { error } = joi_1.default.validate(body, static_api_reqValidationsSchemas_1.staticApiRequestValidationSchemas.userDeleteFriendSchema);
            if (!!error)
                return res.status(400).json({
                    "deleted": false,
                    "error": error,
                });
            const userData = yield db_users_1.default.GetUserDataByIdAndToken(body.id, body.token);
            if (!userData || !userData.isVerified)
                return res.status(400).json({
                    "deleted": false,
                    "error": "invalid data"
                });
            const user = new user_1.default(userData);
            const userFriends = yield user.GetUserFriends();
            if (!userFriends.some(f => f.id === body.friendId))
                return res.status(400).json({
                    "deleted": false,
                    "error": "invalid data"
                });
            yield user.RemoveUserFromFriends({ id: body.friendId });
            res.status(200).json({
                "deleted": true
            });
        }));
    }
    AppBindPostChangeUserPublicName(route, app) {
        app.post(route, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { error } = joi_1.default.validate(body, static_api_reqValidationsSchemas_1.staticApiRequestValidationSchemas.userChangePublicNameSchema);
            if (!!error)
                return res.status(400).json({
                    "changed": false,
                    "error": error,
                });
            const userData = yield db_users_1.default.GetUserDataByIdAndToken(body.id, body.token);
            if (!userData || !userData.isVerified)
                return res.status(400).json({
                    "changed": false,
                    "error": "invalid data"
                });
            const user = new user_1.default(userData);
            yield user.ChangeUserPublicName(body.publicName);
            res.status(200).json({
                "changed": true
            });
        }));
    }
    AppBindPostUploadAvatar(route, avatarFieldName, app) {
        app.post(route, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const file = !!req.files ? req.files[avatarFieldName] : undefined;
            const body = req.body;
            const { error } = joi_1.default.validate(body, static_api_reqValidationsSchemas_1.staticApiRequestValidationSchemas.userUploadAvatarSchema);
            if (!!error)
                return res.status(400).json({
                    "uploaded": false,
                    "error": error,
                });
            if (!file || !("size" in file) || !("mimetype" in file) ||
                !["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype) ||
                file.size > 20000000)
                return res.status(400).json({
                    "uploaded": false,
                    "error": "something went wrong...",
                });
            const userData = yield db_users_1.default.GetUserDataByIdAndToken(body.id, body.token);
            if (!userData || !userData.isVerified)
                return res.status(400).json({
                    "uploaded": false,
                    "error": "wrong credentials or user unverified",
                });
            const user = new user_1.default(userData);
            const hash = uniqid_1.default(`${Math.random() * 1000000000 | 0}`);
            yield user.SetUserAvatarUrlHash(hash);
            if (!!user.avatarUrlHash)
                fs_1.default.unlinkSync(`${this.avatarStoragePath}/${user.avatarUrlHash}.png`);
            yield file.mv(`${this.avatarStoragePath}/${hash}.png`);
            res.status(200).json({
                "uploaded": true,
                "hash": hash
            });
        }));
    }
    AppBindGetVerifyUser(route, app, paramUserName, paramVerificationLink) {
        app.get(route, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userName = req.params[paramUserName];
            const userVerificationLink = req.params[paramVerificationLink];
            const user = yield db_users_1.default.GetUserData({ name: userName });
            if (!user || user.isVerified || userVerificationLink !== user.verificationLink)
                return res.status(400).send("No such user or user is verified");
            yield db_users_1.default.VerifyUser({ name: userName });
            res.status(200).send("Welcome");
        }));
    }
}
exports.default = StaticApi;
