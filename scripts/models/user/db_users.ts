import {userData, userUniqueData} from "./user";

import cryptoRandomString from "crypto-random-string";
import bcrypt from "bcrypt";

import logInfo from "../../utils/consoleLogs/logInfo";
import logError from "../../utils/consoleLogs/logError";
import dockerPrisma from "../dockerPrisma";


export default class DB_Users {
    public static async IsUserExists(
        user: {
            name?: undefined | string,
            email?: undefined | string,
            id?: undefined | string
        }
    ): Promise<boolean> {
        return !!(await dockerPrisma.user({
            name: user.name,
            email: user.email,
            id: user.id
        }));
    }


    public static async CreateNewUser(user: {
        id?: string
        name: string,
        email: string,
        password: string,
        publicName: string,
        token?: string,
        lvl?: number,
        xp?: number,
        gold?: number
    }): Promise<userData> {
        const res = await dockerPrisma.createUser({
            ...user,
            password: await bcrypt.hash(user.password, 10),
            token: user.token || cryptoRandomString({length: 60}),
            lvl: user.lvl || 1,
            xp: user.xp || 0,
            gold: user.gold || 0
        });

        if (!res.id) logError(res);
        logInfo(`New user: ${res.name} | ${res.email} | ${res.id} | ${res.token}`);

        return res;
    }

    public static async DeleteUser(user: userUniqueData): Promise<void> {
        const res = await dockerPrisma.deleteUser(user);
        if (!res.id) logError(res);
    }


    public static async GetUserData(user: userUniqueData): Promise<userData | null> {
        return (await dockerPrisma.user(user));
    }

    public static async GetUserDataByEmailAndPassword(email: string, password: string): Promise<userData | null> {
        const user = await dockerPrisma.user({email: email});
        if (!user) return null;
        if (!(await bcrypt.compare(password, user.password))) return null;
        return user as userData;
    }

    public static async GetUserDataByIdAndToken(id: string, token: string): Promise<userData | null> {
        const user = await dockerPrisma.user({id: id});
        if (!user) return null;
        if (user.token !== token) return null;
        return user as userData;
    }
}