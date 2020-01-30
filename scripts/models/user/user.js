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
const db_tables_1 = __importDefault(require("../table/db_tables"));
const db_users_1 = __importDefault(require("./db_users"));
const lvlFormulas_1 = __importDefault(require("../../utils/formulas/lvlFormulas"));
class User {
    constructor(data) {
        this.id = data.id;
        this.token = data.token;
        this.isVerified = data.isVerified;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.publicName = data.publicName;
        this.avatarUrlHash = data.avatarUrlHash;
        this.changPasswordHash = data.changPasswordHash;
        this.lvl = data.lvl;
        this.xp = data.xp;
        this.gold = data.gold;
    }
    GetUserOnLoginData() {
        return __awaiter(this, void 0, void 0, function* () {
            return Object.assign(Object.assign({}, this.GetUserPublicData()), { "token": this.token, "name": this.name, "xp": this.xp, "gold": this.gold, "email": this.email, "xpToNextLvl": lvlFormulas_1.default.xpToNextLvl(this.lvl), "friends": (yield this.GetUserFriends()).map(u => new User(u).GetUserPublicData()), "invites": (yield this.GetUserInvites()).map(u => new User(u).GetUserPublicData()), "tableId": yield this.GetUserTableId() });
        });
    }
    GetUserPublicData() {
        return {
            "id": this.id,
            "lvl": this.lvl,
            "publicName": this.publicName,
            "avatarUrlHash": this.avatarUrlHash
        };
    }
    SetUserAvatarUrlHash(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_users_1.default.SetUserAvatarUrlHashToUser({ id: this.id }, hash);
        });
    }
    ChangeUserPublicName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_users_1.default.SetUserPublicName({ id: this.id }, name);
        });
    }
    GetUserInvites() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_users_1.default.GetUserInvites({ id: this.id });
        });
    }
    GetUserFriends() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_users_1.default.GetUserFriends({ id: this.id });
        });
    }
    SendUserInvite(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_users_1.default.AddInviteToUser(user, { id: this.id });
        });
    }
    AcceptUserFriendInvite(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_users_1.default.AddFriendToUser(user, { id: this.id });
        });
    }
    RemoveUserFromFriends(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_users_1.default.DisconnectFriendFromUser(user, { id: this.id });
        });
    }
    RejectUserFriendInvite(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_users_1.default.DeleteUserInvite(user, { id: this.id });
        });
    }
    GetUserTableId() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_tables_1.default.GetUserTableId({ id: this.id });
        });
    }
}
exports.default = User;
