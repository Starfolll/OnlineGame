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
const crypto_random_string_1 = __importDefault(require("crypto-random-string"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const logInfo_1 = __importDefault(require("../../utils/consoleLogs/logInfo"));
const logError_1 = __importDefault(require("../../utils/consoleLogs/logError"));
const wrappedPrisma_1 = __importDefault(require("../wrappedPrisma"));
class DB_Users {
    static CreateNewUser(user) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield wrappedPrisma_1.default.createUser(Object.assign(Object.assign({}, user), { password: yield bcrypt_1.default.hash(user.password, 10), token: (_a = user.token, (_a !== null && _a !== void 0 ? _a : crypto_random_string_1.default({ length: 60 }))), verificationLink: (_b = user.verificationLink, (_b !== null && _b !== void 0 ? _b : null)), lvl: (_c = user.lvl, (_c !== null && _c !== void 0 ? _c : 1)), xp: (_d = user.xp, (_d !== null && _d !== void 0 ? _d : 0)), gold: (_e = user.gold, (_e !== null && _e !== void 0 ? _e : 0)) }));
            if (!res.id)
                logError_1.default(res);
            logInfo_1.default(`New user: ${res.name} | ${res.email} | ${res.id} | ${res.token}`);
            return res;
        });
    }
    static SetUserPublicName(user, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield wrappedPrisma_1.default.updateUser({
                where: user,
                data: {
                    publicName: name
                }
            });
            if (!res.id)
                logError_1.default(res);
        });
    }
    static DeleteUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield wrappedPrisma_1.default.deleteUser(user);
            if (!res.id)
                logError_1.default(res);
        });
    }
    static SetUserAvatarUrlHashToUser(user, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield wrappedPrisma_1.default.updateUser({
                where: user,
                data: {
                    avatarUrlHash: hash
                }
            });
            if (!res.id)
                logError_1.default(res);
        });
    }
    static GetUserData(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield wrappedPrisma_1.default.user(user));
        });
    }
    static VerifyUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield wrappedPrisma_1.default.updateUser({
                where: user,
                data: {
                    isVerified: true,
                    verificationLink: null
                }
            });
            if (!res.id)
                logError_1.default(res);
        });
    }
    static GetUserInvites(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield wrappedPrisma_1.default.users({
                where: {
                    friendInvites_some: user,
                }
            }));
        });
    }
    static GetUserFriends(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield wrappedPrisma_1.default.users({
                where: {
                    friends_some: user,
                }
            }));
        });
    }
    static DeleteUserInvite(user, fromUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield wrappedPrisma_1.default.updateUser({
                where: user,
                data: {
                    friendInvites: {
                        disconnect: fromUser
                    }
                }
            });
            if (!res.id)
                logError_1.default(res);
        });
    }
    static AddInviteToUser(toUser, fromUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield wrappedPrisma_1.default.updateUser({
                where: fromUser,
                data: {
                    friendInvites: {
                        connect: toUser
                    }
                }
            });
            if (!res.id)
                logError_1.default(res);
        });
    }
    static DisconnectFriendFromUser(user, friend) {
        return __awaiter(this, void 0, void 0, function* () {
            const res1 = yield wrappedPrisma_1.default.updateUser({
                where: user,
                data: {
                    friends: {
                        disconnect: friend
                    }
                }
            });
            if (!res1.id)
                logError_1.default(res1);
            const res2 = yield wrappedPrisma_1.default.updateUser({
                where: friend,
                data: {
                    friends: {
                        disconnect: user
                    }
                }
            });
            if (!res2.id)
                logError_1.default(res2);
        });
    }
    static AddFriendToUser(toUser, fromUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const res1 = yield wrappedPrisma_1.default.updateUser({
                where: toUser,
                data: {
                    friends: {
                        connect: fromUser
                    },
                    friendInvites: {
                        disconnect: fromUser
                    }
                }
            });
            if (!res1.id)
                logError_1.default(res1);
            const res2 = yield wrappedPrisma_1.default.updateUser({
                where: fromUser,
                data: {
                    friends: {
                        connect: toUser
                    }
                }
            });
            if (!res2.id)
                logError_1.default(res2);
        });
    }
    static GetUserDataByEmailAndPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield wrappedPrisma_1.default.user({ email: email });
            if (!user)
                return null;
            if (!(yield bcrypt_1.default.compare(password, user.password)))
                return null;
            return user;
        });
    }
    static GetUserDataByIdAndToken(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield wrappedPrisma_1.default.user({ id: id });
            if (!user)
                return null;
            if (user.token !== token)
                return null;
            return user;
        });
    }
}
exports.default = DB_Users;
