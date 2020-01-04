import * as core from "express-serve-static-core";
import Joi from "joi";

import DB_Users from "../../models/user/db_users";

import {staticApiRequestValidationSchemas} from "./static.api.reqValidationsSchemas";
import emailTransporter from "../../mailer/transporter.account";
import transporterEmails from "../../mailer/transporter.emails";
import cryptoRandomString from "crypto-random-string";


export default class StaticApi {
    protected AppBindPostLoginUser(route: string, app: core.Express): void {
        app.post(route, async (req, res) => {
            const body: { email: string, password: string } = req.body;

            const {error} = Joi.validate(body, staticApiRequestValidationSchemas.userLoginSchema);
            if (!!error) return res.status(400).json({
                "verified": false,
                "error": error,
            });

            const user = await DB_Users.GetUserDataByEmailAndPassword(body.email, body.password);
            if (!user) return res.status(400).json({
                "verified": false,
                "error": "wrongPasswordOrEmail"
            });

            if (!user.isVerified) return res.status(400).json({
                "verified": false,
                "error": "verifyYourEmail"
            });

            res.status(200).json({
                "verified": true,
                "userData": {
                    "id": user.id,
                    "token": user.token,
                    "name": user.name,
                    "email": user.email,
                    "publicName": user.publicName,
                    "lvl": user.lvl,
                    "xp": user.xp,
                    "gold": user.gold,
                }
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

            const verificationLink = cryptoRandomString({length: 120, type: "url-safe"});
            await DB_Users.CreateNewUser({
                verificationLink,
                email: body.email,
                name: body.name,
                password: body.password,
                publicName: body.publicName
            });

            await emailTransporter.sendMail(transporterEmails.verificationUserEmail(
                body.email,
                `http://localhost:8000/api/users/actions/verify/${body.name}/${verificationLink}`
            ));

            res.status(200).send({
                "verified": true,
                "info": "check your email"
            });
        });
    }

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