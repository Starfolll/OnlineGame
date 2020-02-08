export type userPublicData = {
   id: string;
   publicName: string;
   lvl: number;
   avatarUrlHash?: string;
}

export type userAccountData = {
   verified: boolean;
   id: string;
   token: string;
   name: string;
   publicName: string;
   email: string;
   lvl: number;
   xp: number;
   gold: number;
   xpToNextLvl: number;
   friends: Array<userPublicData>;
   invites: Array<userPublicData>;
   tableId?: string;
   avatarUrlHash?: string;
}

export const DECLARE_ACCOUNT = "DECLARE_ACCOUNT";
export const SIGN_OUT_ACCOUNT = "SIGN_OUT_ACCOUNT";
export const CHANGE_USER_ACCOUNT_AVATAR_HASH = "CHANGE_USER_ACCOUNT_AVATAR_HASH";
export const CHANGE_USER_ACCOUNT_PUBLIC_NAME = "CHANGE_USER_ACCOUNT_PUBLIC_NAME";
export const ACCEPT_USER_FRIEND_INVITE = "ACCEPT_USER_FRIEND_INVITE";
export const REJECT_USER_FRIEND_INVITE = "REJECT_USER_FRIEND_INVITE";


interface DeclareAccount {
   type: typeof DECLARE_ACCOUNT;
   account: userAccountData;
}

interface SignOutAccount {
   type: typeof SIGN_OUT_ACCOUNT;
}

interface ChangeUserAccountPublicName {
   type: typeof CHANGE_USER_ACCOUNT_PUBLIC_NAME;
   newName: string;
}

interface ChangeUserAccountAvatarHash {
   type: typeof CHANGE_USER_ACCOUNT_AVATAR_HASH;
   newHash: string;
}

interface AcceptUserFriendInvite {
   type: typeof ACCEPT_USER_FRIEND_INVITE;
   userData: userPublicData;
}

interface RejectUserFriendInvite {
   type: typeof REJECT_USER_FRIEND_INVITE;
   userData: userPublicData;
}

export type accountActionsTypes =
   DeclareAccount |
   SignOutAccount |
   ChangeUserAccountAvatarHash |
   ChangeUserAccountPublicName |
   AcceptUserFriendInvite |
   RejectUserFriendInvite;
