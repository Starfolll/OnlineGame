export type userPublicData = {
   id: string;
   publicName: string;
   lvl: number;
}

export type userAccountData = {
   verified: boolean;
   id: string;
   token: string;
   name: string;
   publicName: string;
   lvl: number;
   xp: number;
   gold: number;
   friends?: Array<userPublicData>;
   invites?: Array<userPublicData>;
   tableId?: string;
}

export const DECLARE_ACCOUNT = "DECLARE_ACCOUNT";
export const SIGN_OUT_ACCOUNT = "SIGN_OUT_ACCOUNT";
export const CHANGE_USER_ACCOUNT_PUBLIC_NAME = "CHANGE_USER_ACCOUNT_PUBLIC_NAME";

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

export type accountActionsTypes = DeclareAccount | SignOutAccount | ChangeUserAccountPublicName;