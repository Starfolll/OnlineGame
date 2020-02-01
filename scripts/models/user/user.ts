import DB_Tables from "../table/db_tables";
import DB_Users from "./db_users";
import lvlFormulas from "../../utils/formulas/lvlFormulas";

export type userUniqueData = {
   id?: string;
   name?: string;
   email?: string;
   changPasswordHash?: string;
}

export type userData = {
   id: string;
   isVerified: boolean;
   token: string;
   name: string;
   email: string;
   password: string;
   publicName: string;
   verificationLink?: string;
   changPasswordHash?: string;
   avatarUrlHash?: string;
   createdAt: string;
   updatedAt: string;
   lvl: number;
   xp: number;
   gold: number;
   friends?: Array<userData>;
   invites?: Array<userData>;
}

export type userPublicData = {
   id: string;
   publicName: string;
   avatarUrlHash?: string;
   lvl: number;
}

export type userOnLoginData = {
   id: string;
   token: string;
   name: string;
   publicName: string;
   lvl: number;
   xp: number;
   gold: number;
   xpToNextLvl: number;
   friends?: Array<userPublicData>;
   invites?: Array<userPublicData>;
   tableId?: string;
}

export default class User {
   public readonly id: string;
   public readonly token: string;

   public readonly isVerified: boolean;

   public readonly name: string;
   public readonly email: string;
   public readonly password: string;

   public readonly publicName: string;
   public readonly avatarUrlHash: string | undefined;
   public readonly changPasswordHash: string | undefined;

   public readonly lvl: number;
   public readonly xp: number;
   public readonly gold: number;


   constructor(data: userData) {
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

   public async GetUserOnLoginData(): Promise<userOnLoginData> {
      return {
         ...this.GetUserPublicData(),
         "token": this.token,
         "name": this.name,
         "xp": this.xp,
         "gold": this.gold,
         "xpToNextLvl": lvlFormulas.xpToNextLvl(this.lvl),
         "friends": (await this.GetUserFriends()).map(u => new User(u).GetUserPublicData()),
         "invites": (await this.GetUserInvites()).map(u => new User(u).GetUserPublicData()),
         "tableId": await this.GetUserTableId()
      }
   }

   public GetUserPublicData(): userPublicData {
      return {
         "id": this.id,
         "lvl": this.lvl,
         "publicName": this.publicName,
         "avatarUrlHash": this.avatarUrlHash
      }
   }


   // database promises
   public async SetUserAvatarUrlHash(hash: string): Promise<void> {
      await DB_Users.SetUserAvatarUrlHashToUser({id: this.id}, hash);
   }

   public async ChangeUserPublicName(name: string): Promise<void> {
      await DB_Users.SetUserPublicName({id: this.id}, name);
   }

   public async GetUserInvites(): Promise<Array<userData>> {
      return await DB_Users.GetUserInvites({id: this.id});
   }

   public async GetUserFriends(): Promise<Array<userData>> {
      return await DB_Users.GetUserFriends({id: this.id});
   }

   public async SendUserInvite(user: userUniqueData): Promise<void> {
      await DB_Users.AddInviteToUser(user, {id: this.id});
   }

   public async AcceptUserFriendInvite(user: userUniqueData): Promise<void> {
      await DB_Users.AddFriendToUser(user, {id: this.id});
   }

   public async RemoveUserFromFriends(user: userUniqueData): Promise<void> {
      await DB_Users.DisconnectFriendFromUser(user, {id: this.id});
   }

   public async RejectUserFriendInvite(user: userUniqueData): Promise<void> {
      await DB_Users.DeleteUserInvite(user, {id: this.id});
   }

   public async GetUserTableId(): Promise<string | undefined> {
      return await DB_Tables.GetUserTableId({id: this.id});
   }
}