import {userData, userUniqueData} from "./user";

import cryptoRandomString from "crypto-random-string";
import bcrypt from "bcrypt";

import logInfo from "../../utils/consoleLogs/logInfo";
import logError from "../../utils/consoleLogs/logError";
import wrappedPrisma from "../wrappedPrisma";


export default class DB_Users {
   public static async CreateNewUser(user: {
      id?: string,
      isVerified?: boolean,
      verificationLink: string | null
      name: string,
      email: string,
      password: string,
      publicName: string,
      token?: string,
      avatarUrlHash?: string,
      lvl?: number,
      xp?: number,
      gold?: number
   }): Promise<userData> {
      const res = await wrappedPrisma.createUser({
         ...user,
         password: await bcrypt.hash(user.password, 10),
         token: user.token ?? cryptoRandomString({length: 60}),
         verificationLink: user.verificationLink ?? null,
         lvl: user.lvl ?? 1,
         xp: user.xp ?? 0,
         gold: user.gold ?? 0
      });

      if (!res.id) logError(res);
      logInfo(`New user: ${res.name} | ${res.email} | ${res.id} | ${res.token}`);

      return res;
   }

   public static async SetUserPublicName(user: userUniqueData, name: string): Promise<void> {
      const res = await wrappedPrisma.updateUser({
         where: user,
         data: {
            publicName: name
         }
      });
      if (!res.id) logError(res);
   }

   public static async ChangeUserPassword(user: userUniqueData, password: string): Promise<void> {
      const res = await wrappedPrisma.updateUser({
         where: user,
         data: {
            password: await bcrypt.hash(password, 11),
            changPasswordHash: null
         }
      });
      if (!res.id) logError(res);
   }

   public static async DeleteUser(user: userUniqueData): Promise<void> {
      const res = await wrappedPrisma.deleteUser(user);
      if (!res.id) logError(res);
   }


   public static async SetUserAvatarUrlHashToUser(user: userUniqueData, hash: string): Promise<void> {
      const res = await wrappedPrisma.updateUser({
         where: user,
         data: {
            avatarUrlHash: hash
         }
      });
      if (!res.id) logError(res);
   }

   public static async GetUserData(user: userUniqueData): Promise<userData | null> {
      return (await wrappedPrisma.user(user));
   }

   public static async GetUserDataByChangePasswordHash(hash: string): Promise<userData | null> {
      return (await wrappedPrisma.users({
         where: {
            changPasswordHash: hash
         }
      }))[0];
   }

   public static async SetChangePasswordHash(user: userUniqueData, hash: string): Promise<void> {
      const res = await wrappedPrisma.updateUser({
         where: user,
         data: {
            changPasswordHash: hash
         }
      });
      if (!res.id) logError(res);
   }

   public static async VerifyUser(user: userUniqueData): Promise<void> {
      const res = await wrappedPrisma.updateUser({
         where: user,
         data: {
            isVerified: true,
            verificationLink: null
         }
      });
      if (!res.id) logError(res);
   }

   public static async GetUserInvites(user: userUniqueData): Promise<Array<userData>> {
      return (await wrappedPrisma.users({
         where: {
            friendInvites_some: user,
         }
      }));
   }

   public static async GetUserFriends(user: userUniqueData): Promise<Array<userData>> {
      return (await wrappedPrisma.users({
         where: {
            friends_some: user,
         }
      }));
   }

   public static async DeleteUserInvite(user: userUniqueData, fromUser: userUniqueData): Promise<void> {
      const res = await wrappedPrisma.updateUser({
         where: user,
         data: {
            friendInvites: {
               disconnect: fromUser
            }
         }
      });
      if (!res.id) logError(res);
   }

   public static async AddInviteToUser(toUser: userUniqueData, fromUser: userUniqueData): Promise<void> {
      const res = await wrappedPrisma.updateUser({
         where: fromUser,
         data: {
            friendInvites: {
               connect: toUser
            }
         }
      });
      if (!res.id) logError(res);
   }

   public static async DisconnectFriendFromUser(user: userUniqueData, friend: userUniqueData): Promise<void> {
      const res1 = await wrappedPrisma.updateUser({
         where: user,
         data: {
            friends: {
               disconnect: friend
            }
         }
      });
      if (!res1.id) logError(res1);

      const res2 = await wrappedPrisma.updateUser({
         where: friend,
         data: {
            friends: {
               disconnect: user
            }
         }
      });
      if (!res2.id) logError(res2);
   }

   public static async AddFriendToUser(toUser: userUniqueData, fromUser: userUniqueData): Promise<void> {
      const res1 = await wrappedPrisma.updateUser({
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
      if (!res1.id) logError(res1);


      const res2 = await wrappedPrisma.updateUser({
         where: fromUser,
         data: {
            friends: {
               connect: toUser
            }
         }
      });
      if (!res2.id) logError(res2);
   }

   public static async GetUserDataByEmailAndPassword(email: string, password: string): Promise<userData | null> {
      const user = await wrappedPrisma.user({email: email});
      if (!user) return null;
      if (!(await bcrypt.compare(password, user.password))) return null;
      return user as userData;
   }

   public static async GetUserDataByIdAndToken(id: string, token: string): Promise<userData | null> {
      const user = await wrappedPrisma.user({id: id});
      if (!user) return null;
      if (user.token !== token) return null;
      return user as userData;
   }
}