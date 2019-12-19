import {prisma} from "../../../generated/prisma-client";
import {userData} from "./user";

import cryptoRandomString from "crypto-random-string";

import logInfo from "../../consoleLogs/logInfo";
import logError from "../../consoleLogs/logError";

export default class DB_Users {
    public static async IsUserExists(
        user: {
            name?: undefined | string,
            email?: undefined | string,
            id?: undefined | string
        }
    ): Promise<boolean> {
        return !!(await prisma.user({
            name: user.name,
            email: user.email,
            id: user.id
        }));
    }


    public static async AddNewUser(user: {
        name: string,
        email: string,
        password: string,
        publicName: string,
        lvl?: number,
        xp?: number,
        gold?: number
    }): Promise<void> {
        const userDataUpdated = {
            ...user,
            token: cryptoRandomString({length: 60}),
            lvl: !!user.lvl ? user.lvl : 1,
            xp: !!user.xp ? user.xp : 0,
            gold: !!user.gold ? user.gold : 0
        };

        const res = await prisma.createUser(userDataUpdated);
        if (!res.id) logError(res);
        logInfo(`New user: ${res.name} | ${res.email}`);
    }

    public static async RemoveUser(userName: string): Promise<void> {
        const res = await prisma.deleteUser({name: userName});
        if (!res.id) logError(res);
    }


    public static async GetUserDataByEmailAndPassword(email: string, password: string): Promise<userData | null> {
        const user = await prisma.user({email: email});
        if (!user) return null;
        if (user.password !== password) return null;
        return user as userData;
    }

    public static async GetUserDataByNameAndToken(name: string, token: string): Promise<userData | null> {
        const user = await prisma.user({name: name});
        if (!user) return null;
        if (user.token !== token) return null;
        return user as userData;
    }
}