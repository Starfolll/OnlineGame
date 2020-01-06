import Joi from "joi";

const validationRegexPatterns = {
    signUp: {
        name: /^[-_.~A-Za-z0-9]+$/,
    }
};

const joiEmailCredentialsSchema = {
    email: Joi.string().min(6).max(255).email().required(),
    password: Joi.string().min(8).max(255).required(),
};

const joiTokenCredentialsSchema = {
    id: Joi.string().required(),
    token: Joi.string().required(),
};

const joiPublicNameSchema = {
    publicName: Joi.string().min(2).max(20).required(),
};

const joiNameSchema = {
    name: Joi.string().min(2).max(255).required().regex(validationRegexPatterns.signUp.name)
};

export const staticApiRequestValidationSchemas = {
    userLoginSchema: {
        ...joiEmailCredentialsSchema
    },
    userSignUpSchema: {
        ...joiEmailCredentialsSchema,
        ...joiPublicNameSchema,
        ...joiNameSchema
    },
    userSendFriendInviteSchema: {
        ...joiTokenCredentialsSchema,
        ...joiNameSchema
    },
    userAcceptFriendsInviteSchema: {
        ...joiTokenCredentialsSchema,
        friendId: Joi.string().required()
    },
    userRejectFriendInviteSchema: {
        ...joiTokenCredentialsSchema,
        inviteUserId: Joi.string().required()
    },
    userDeleteFriendSchema: {
        ...joiTokenCredentialsSchema,
        friendId: Joi.string().required()
    },
    userChangePublicNameSchema: {
        ...joiTokenCredentialsSchema,
        ...joiPublicNameSchema
    }
};