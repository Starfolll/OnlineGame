import {accountActionsTypes, userAccountData, userPublicData} from "../actions/account/account.actions.types";

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
         return null;

      case "REJECT_USER_FRIEND_INVITE":
         if (!!state) return {
            ...state,
            invites: state.invites.filter(f => action.userData.id !== f.id),
         } as userAccountData;
         return null;

      case "DELETE_USER_FROM_FRIENDS":
         if (!!state) state.friends = state.friends.filter(f => f.id !== action.friendId);
         return Object.assign({}, state);

      case "SET_CONNECTED_FRIENDS":
         if (!!state) state.friends = state.friends.map(f => ({
            ...f,
            isConnected: action.friendsId.some(fId => f.id === fId)
         }));
         return Object.assign({}, state);

      case "SET_CONNECTED_FRIEND":
         if (!!state) state.friends = state.friends.map(f => f.id === action.friendId ? {...f, isConnected: true} : f);
         return Object.assign({}, state);

      case "SET_DISCONNECTED_FRIEND":
         if (!!state) state.friends = state.friends.map(f => f.id === action.friendId ? {
            ...f,
            isConnected: undefined
         } : f);
         return Object.assign({}, state);

      case "SET_USER_ROOM_INVITE_ID":
         if (!!state) state.friends = state.friends.map(f => f.id === action.userId ? {
            ...f,
            roomInviteId: action.roomId
         } as userPublicData : f);
         console.log(state);
         return Object.assign({}, state);

      case "REMOVE_FRIEND_ROOM_INVITE":
         if (!!state) state.friends = state.friends.map(f => f.id === action.friendId ? {
            ...f,
            roomInviteId: undefined
         } as userPublicData : f);
         return Object.assign({}, state);

      default:
         return state;
   }
};
