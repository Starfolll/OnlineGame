import {accountActionsTypes, userAccountData} from "../actions/account.actions.types";

export default function accountReducer(
   state: userAccountData | null = null,
   action: accountActionsTypes
): any {
   switch (action.type) {
      case "DECLARE_ACCOUNT":
         return action.account;

      case "SIGN_OUT_ACCOUNT":
         return null;

      case "CHANGE_USER_ACCOUNT_PUBLIC_NAME":
         return {...state, publicName: action.newName} as userAccountData;

      case "CHANGE_USER_ACCOUNT_AVATAR_HASH":
         return {...state, avatarUrlHash: action.newHash} as userAccountData;

      default:
         return state;
   }
};