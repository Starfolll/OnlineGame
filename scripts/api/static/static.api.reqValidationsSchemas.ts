import Joi from "joi";

const validationPatterns = {
    signUp: {
        name: /^[-_.~A-Za-z0-9]+$/,
    }
};

export const staticApiRequestValidationSchemas = {
    userLoginSchema: {
        email: Joi.string().max(255).required().email(),
        password: Joi.string().max(255).required()
    },
    userSignUpSchema: {
        email: Joi.string().min(6).max(255).email().required(),
        password: Joi.string().min(8).max(255).required(),
        publicName: Joi.string().min(2).max(20).required(),
        name: Joi.string().min(2).max(255).required().regex(validationPatterns.signUp.name)
    },
    userSendFriendInviteSchema: {
        id: Joi.string().required(),
        token: Joi.string().required(),
        name: Joi.string().required()
    },
    userAcceptFriendsInviteSchema: {
        id: Joi.string().required(),
        token: Joi.string().required(),
        friendId: Joi.string().required()
    },
    userRejectFriendInviteSchema: {
        id: Joi.string().required(),
        token: Joi.string().required(),
        inviteUserId: Joi.string().required()
    },
    userDeleteFriendSchema: {
        id: Joi.string().required(),
        token: Joi.string().required(),
        friendId: Joi.string().required()
    }
};