"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validationRegexPatterns = {
    signUp: {
        name: /^[-_.~A-Za-z0-9]+$/,
    }
};
const joiIdSchema = {
    id: joi_1.default.string().required(),
};
const joiEmailCredentialsSchema = {
    email: joi_1.default.string().min(6).max(255).email().required(),
    password: joi_1.default.string().min(8).max(255).required(),
};
const joiTokenCredentialsSchema = Object.assign(Object.assign({}, joiIdSchema), { token: joi_1.default.string().required() });
const joiPublicNameSchema = {
    publicName: joi_1.default.string().min(2).max(20).required(),
};
const joiNameSchema = {
    name: joi_1.default.string().min(2).max(255).required().regex(validationRegexPatterns.signUp.name)
};
exports.staticApiRequestValidationSchemas = {
    userLoginSchema: Object.assign({}, joiEmailCredentialsSchema),
    userSignUpSchema: Object.assign(Object.assign(Object.assign({}, joiEmailCredentialsSchema), joiPublicNameSchema), joiNameSchema),
    userSendFriendInviteSchema: Object.assign(Object.assign({}, joiTokenCredentialsSchema), joiNameSchema),
    userAcceptFriendsInviteSchema: Object.assign(Object.assign({}, joiTokenCredentialsSchema), { "friendId": joiIdSchema.id }),
    userRejectFriendInviteSchema: Object.assign(Object.assign({}, joiTokenCredentialsSchema), { "inviteUserId": joiIdSchema.id }),
    userDeleteFriendSchema: Object.assign(Object.assign({}, joiTokenCredentialsSchema), { "friendId": joiIdSchema.id }),
    userChangePublicNameSchema: Object.assign(Object.assign({}, joiTokenCredentialsSchema), joiPublicNameSchema),
    userUploadAvatarSchema: Object.assign({}, joiTokenCredentialsSchema)
};
