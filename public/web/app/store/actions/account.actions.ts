import {
   accountActionsTypes,
   CHANGE_USER_ACCOUNT_AVATAR_HASH,
   CHANGE_USER_ACCOUNT_PUBLIC_NAME,
   SIGN_OUT_ACCOUNT,
   userAccountData
} from "./account.actions.types"

export const accountActionDeclareAccount = (account: userAccountData): accountActionsTypes => {
   return {
      type: "DECLARE_ACCOUNT",
      account
   }
};

export const accountActionSingOutAccount = (): accountActionsTypes => {
   return {
      type: "SIGN_OUT_ACCOUNT"
   }
};

export const accountActionChangeUserAccountAvatarHash = (newHash: string): accountActionsTypes => {
   return {
      type: "CHANGE_USER_ACCOUNT_AVATAR_HASH",
      newHash: newHash
   }
};

export const accountActionChangeUserPublicName = (newName: string): accountActionsTypes => {
   return {
      type: CHANGE_USER_ACCOUNT_PUBLIC_NAME,
      newName
   }
};