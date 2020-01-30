import Joi from "joi";

const validationRegexPatterns = {
   signUp: {
      name: /^[-_.~A-Za-z0-9]+$/,
   }
};

const joiPasswordSchema = {
   password: Joi.string().min(8).max(255).required(),
};

const joiEmailSchema = {
   email: Joi.string().min(6).max(255).email().required(),
};

const joiIdSchema = {
   id: Joi.string().required(),
};

const joiEmailCredentialsSchema = {
   ...joiEmailSchema,
   ...joiPasswordSchema
};

const joiTokenCredentialsSchema = {
   ...joiIdSchema,
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
      "friendId": joiIdSchema.id
   },
   userRejectFriendInviteSchema: {
      ...joiTokenCredentialsSchema,
      "inviteUserId": joiIdSchema.id
   },
   userDeleteFriendSchema: {
      ...joiTokenCredentialsSchema,
      "friendId": joiIdSchema.id
   },
   userChangePublicNameSchema: {
      ...joiTokenCredentialsSchema,
      ...joiPublicNameSchema
   },
   userUploadAvatarSchema: {
      ...joiTokenCredentialsSchema
   },
   userChangePasswordRequest: {
      ...joiEmailSchema
   },
   userChangePassword: {
      "hash": Joi.string().required(),
      ...joiPasswordSchema
   }
};