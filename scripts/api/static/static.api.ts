import * as core from "express-serve-static-core";
import Joi from "joi";
import DB_Users from "../../models/user/db_users";
import {staticApiRequestValidationSchemas} from "./static.api.reqValidationsSchemas";
import emailTransporter from "../../mailer/transporter.account";
import transporterEmails from "../../mailer/transporter.emails";
import cryptoRandomString from "crypto-random-string";
import User from "../../models/user/user";
import dotenv from "dotenv";
import {UploadedFile} from "express-fileupload";
import uniqid from "uniqid"
import fs from "fs";


dotenv.config();
export default class StaticApi {
   protected readonly usersInvitesLimit: number = +process.env.PUBLIC_WEB_AND_API_USERS_INVITES_LIMIT!;
   protected readonly usersFriendsLimit: number = +process.env.PUBLIC_WEB_AND_API_USERS_FRIENDS_LIMIT!;
   protected readonly automaticValidateUsers: boolean = process.env.AUTOMATIC_VALIDATE_USERS! === "true";

   private readonly avatarStoragePath: string;

   constructor(apiConfigs: {
      avatarStoragePass: string
   }) {
      this.avatarStoragePath = apiConfigs.avatarStoragePass;
   }


   //post
   protected AppBindPostLoginUser(route: string, app: core.Express): void {
      app.post(route, async (req, res) => {
         const body: { email: string, password: string } = req.body;

         const {error} = Joi.validate(body, staticApiRequestValidationSchemas.userLoginSchema);
         if (!!error) return res.status(400).json({
            "verified": false,
            "error": error,
         });

         const userData = await DB_Users.GetUserDataByEmailAndPassword(body.email, body.password);
         if (!userData) return res.status(400).json({
            "verified": false,
            "error": "Wrong password or email"
         });

         if (!userData.isVerified) return res.status(400).json({
            "verified": false,
            "error": "Verify four email"
         });

         res.status(200).json({
            "verified": true,
            "userData": await (new User(userData)).GetUserOnLoginData()
         })
      });
   }

   protected AppBindPostSignUpUser(route: string, app: core.Express): void {
      app.post(route, async (req, res) => {
         const body: {
            email: string,
            password: string,
            publicName: string,
            name: string
         } = req.body;

         const {error} = Joi.validate(body, staticApiRequestValidationSchemas.userSignUpSchema);
         if (!!error) return res.status(400).json({
            "verified": false,
            "error": error,
         });

         const usersWithEmail = await DB_Users.GetUserData({email: body.email});
         const usersWithName = await DB_Users.GetUserData({name: body.name});
         if (!!usersWithEmail || usersWithName) return res.status(400).json({
            "verified": false,
            "error": {
               "isEmailUsed": !!usersWithEmail,
               "isNameUsed": !!usersWithName
            }
         });

         const verificationLink: string | null =
            !this.automaticValidateUsers ? cryptoRandomString({length: 120, type: "url-safe"}) : null;
         await DB_Users.CreateNewUser({
            verificationLink,
            isVerified: this.automaticValidateUsers,
            email: body.email,
            name: body.name,
            password: body.password,
            publicName: body.publicName
         });

         if (!this.automaticValidateUsers) await emailTransporter.sendMail(transporterEmails.verificationUserEmail(
            body.email,
            `http://localhost:8000/api/users/actions/verify/${body.name}/${verificationLink}`
         ));

         res.status(200).send({
            "verified": true,
            "info": !this.automaticValidateUsers ? "Check your email" : "Welcome"
         });
      });
   }

   protected AppBindPostSendFriendInvite(route: string, app: core.Express): void {
      app.post(route, async (req, res) => {
         const body: {
            id: string;
            token: string;
            name: string;
         } = req.body;

         const {error} = Joi.validate(body, staticApiRequestValidationSchemas.userSendFriendInviteSchema);
         if (!!error) return res.status(400).json({
            "sent": false,
            "error": error,
         });

         const userData = await DB_Users.GetUserDataByIdAndToken(body.id, body.token);
         if (!userData || !userData.isVerified || userData.name === body.name) return res.status(400).json({
            "sent": false,
            "error": "invalid data"
         });

         const userToInviteData = await DB_Users.GetUserData({name: body.name});
         if (!userToInviteData || !userToInviteData.isVerified) return res.status(400).json({
            "sent": false,
            "error": "invalid data"
         });


         const userToInvite = new User(userToInviteData);
         if ((await userToInvite.GetUserFriends()).some(u => u.id === body.id)) return res.status(400).json({
            "sent": false,
            "error": "you are already friends with that user"
         });

         if ((await userToInvite.GetUserInvites()).length >= this.usersInvitesLimit) return res.status(400).json({
            "sent": false,
            "error": "invite list full"
         });

         const user = new User(userData);
         if ((await user.GetUserInvites()).some(i => i.id === userToInvite.id)) return res.status(400).json({
            "sent": false,
            "error": "you already have invite from this user"
         });

         await user.SendUserInvite({id: userToInviteData.id});

         res.status(200).send({
            "sent": true
         });
      });
   }

   protected AppBindPostAcceptUserFriendInvite(route: string, app: core.Express): void {
      app.post(route, async (req, res) => {
         const body: {
            id: string;
            token: string;
            friendId: string;
         } = req.body;

         const {error} = Joi.validate(body, staticApiRequestValidationSchemas.userAcceptFriendsInviteSchema);
         if (!!error) return res.status(400).json({
            "accepted": false,
            "error": error,
         });

         const userData = await DB_Users.GetUserDataByIdAndToken(body.id, body.token);
         if (!userData || !userData.isVerified) return res.status(400).json({
            "accepted": false,
            "error": "invalid data"
         });

         const user = new User(userData);
         const userInvites = await user.GetUserInvites();
         if (userInvites.length >= this.usersFriendsLimit || !userInvites.some(f => f.id === body.friendId)) return res.status(400).json({
            "accepted": false,
            "error": "invalid data"
         });

         await user.AcceptUserFriendInvite({id: body.friendId});

         res.status(200).json({
            "accepted": true
         });
      });
   }

   protected AppBindPostRejectUserFriendInvite(route: string, app: core.Express): void {
      app.post(route, async (req, res) => {
         const body: {
            id: string,
            token: string,
            inviteUserId: string
         } = req.body;

         const {error} = Joi.validate(body, staticApiRequestValidationSchemas.userRejectFriendInviteSchema);
         if (!!error) return res.status(400).json({
            "rejected": false,
            "error": error,
         });

         const userData = await DB_Users.GetUserDataByIdAndToken(body.id, body.token);
         if (!userData || !userData.isVerified) return res.status(400).json({
            "rejected": false,
            "error": "invalid data"
         });

         const user = new User(userData);
         const userInvites = await user.GetUserInvites();
         if (!userInvites.some(i => i.id === body.inviteUserId)) return res.status(400).json({
            "rejected": false,
            "error": "invalid data"
         });

         await user.RejectUserFriendInvite({id: body.inviteUserId});

         res.send({
            "rejected": true
         });
      });
   }

   protected AppBindPostDeleteUserFromFriendsList(route: string, app: core.Express): void {
      app.post(route, async (req, res) => {
         const body: {
            id: string,
            token: string,
            friendId: string
         } = req.body;

         const {error} = Joi.validate(body, staticApiRequestValidationSchemas.userDeleteFriendSchema);
         if (!!error) return res.status(400).json({
            "deleted": false,
            "error": error,
         });

         const userData = await DB_Users.GetUserDataByIdAndToken(body.id, body.token);
         if (!userData || !userData.isVerified) return res.status(400).json({
            "deleted": false,
            "error": "invalid data"
         });

         const user = new User(userData);
         const userFriends = await user.GetUserFriends();
         if (!userFriends.some(f => f.id === body.friendId)) return res.status(400).json({
            "deleted": false,
            "error": "invalid data"
         });

         await user.RemoveUserFromFriends({id: body.friendId});

         res.status(200).json({
            "deleted": true
         });
      });
   }

   protected AppBindPostChangeUserPublicName(route: string, app: core.Express): void {
      app.post(route, async (req, res) => {
         const body: {
            id: string,
            token: string,
            publicName: string
         } = req.body;

         const {error} = Joi.validate(body, staticApiRequestValidationSchemas.userChangePublicNameSchema);
         if (!!error) return res.status(400).json({
            "changed": false,
            "error": error,
         });

         const userData = await DB_Users.GetUserDataByIdAndToken(body.id, body.token);
         if (!userData || !userData.isVerified) return res.status(400).json({
            "changed": false,
            "error": "invalid data"
         });

         const user = new User(userData);
         await user.ChangeUserPublicName(body.publicName);

         res.status(200).json({
            "changed": true
         });
      });
   }

   //change password
   protected AppBindPostChangePasswordRequest(route: string, app: core.Express): void {
      app.post(route, async (req, res) => {
         const body: {
            email: string
         } = req.body;

         const {error} = Joi.validate(body, staticApiRequestValidationSchemas.userChangePasswordRequest);
         if (!!error) return res.status(400).json({
            "sent": false,
            "error": error,
         });

         const userData = await DB_Users.GetUserData({email: body.email});
         if (!userData || !userData.isVerified) return res.status(200).json({
            "sent": true,
            "email": body.email
         });

         const changePasswordHash = !!userData.changPasswordHash ? userData.changPasswordHash :
            `${userData.id}-${cryptoRandomString({
               length: 60,
               type: "url-safe"
            })}-${uniqid()}-${cryptoRandomString({
               length: 60,
               type: "url-safe"
            })}`;

         await DB_Users.SetChangePasswordHash({id: userData.id}, changePasswordHash);
         await emailTransporter.sendMail(transporterEmails.changeUserPasswordRequest(
            body.email,
            `http://localhost:8000/changePassword/${changePasswordHash}`
         ));

         res.status(200).json({
            "sent": true,
            "email": body.email
         });
      });
   }

   protected AppBindPostChangePassword(route: string, app: core.Express): void {
      app.post(route, async (req, res) => {
         const body: {
            hash: string,
            password: string
         } = req.body;

         const {error} = Joi.validate(body, staticApiRequestValidationSchemas.userChangePassword);
         if (!!error) return res.status(400).json({
            "changed": false,
            "error": error,
         });

         const userData = await DB_Users.GetUserDataByChangePasswordHash(body.hash);
         if (!userData || !userData.isVerified) return res.status(200).json({
            "changed": false
         });

         await DB_Users.ChangeUserPassword({id: userData.id}, body.password);

         return res.status(200).json({
            "changed": true,
         });
      });
   };


   // upload avatar
   protected AppBindPostUploadAvatar(route: string, avatarFieldName: string, app: core.Express): void {
      app.post(route, async (req, res) => {
         const file: UploadedFile | UploadedFile[] | undefined = !!req.files ? req.files[avatarFieldName] : undefined;
         const body: {
            id: string,
            token: string
         } = req.body;

         const {error} = Joi.validate(body, staticApiRequestValidationSchemas.userUploadAvatarSchema);
         if (!!error) return res.status(400).json({
            "uploaded": false,
            "error": error,
         });

         if (!file || !("size" in file) || !("mimetype" in file) ||
            !["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype) ||
            file.size > 20000000
         )
            return res.status(400).json({
               "uploaded": false,
               "error": "something went wrong...",
            });

         const userData = await DB_Users.GetUserDataByIdAndToken(body.id, body.token);
         if (!userData || !userData.isVerified) return res.status(400).json({
            "uploaded": false,
            "error": "wrong credentials or user unverified",
         });

         const user = new User(userData);
         const hash = uniqid(`${Math.random() * 1000000000 | 0}`);

         await user.SetUserAvatarUrlHash(hash);
         if (!!user.avatarUrlHash) fs.unlinkSync(`${this.avatarStoragePath}/${user.avatarUrlHash}.png`);
         await file.mv(`${this.avatarStoragePath}/${hash}.png`);

         res.status(200).json({
            "uploaded": true,
            "hash": hash
         });
      });
   }

   //get
   protected AppBindGetVerifyUser(route: string, app: core.Express, paramUserName: string, paramVerificationLink: string): void {
      app.get(route, async (req, res) => {
         const userName = req.params[paramUserName];
         const userVerificationLink = req.params[paramVerificationLink];

         const user = await DB_Users.GetUserData({name: userName});

         if (!user || user.isVerified || userVerificationLink !== user.verificationLink)
            return res.status(400).send("No such user or user is verified");

         await DB_Users.VerifyUser({name: userName});

         res.status(200).send("Welcome");
      });
   }
}