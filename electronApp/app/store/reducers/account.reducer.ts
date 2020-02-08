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

      case "ACCEPT_USER_FRIEND_INVITE":
         if (!!state) return {
            ...state,
            invites: state.invites.filter(f => action.userData.id !== f.id),
            friends: [...state.friends, action.userData]
         } as userAccountData;
         else return null;

      case "REJECT_USER_FRIEND_INVITE":
         if (!!state) return {
            ...state,
            invites: state.invites.filter(f => action.userData.id !== f.id),
         } as userAccountData;
         else return null;

      default:
         return state;
   }
};
