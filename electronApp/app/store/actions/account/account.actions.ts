import {accountActionsTypes, userAccountData, userPublicData} from "./account.actions.types";

export const accountActionDeclareAccount = (account: userAccountData): accountActionsTypes => {
   return {
      type: "DECLARE_ACCOUNT",
      account
   };
};

export const accountActionSingOutAccount = (): accountActionsTypes => {
   return {
      type: "SIGN_OUT_ACCOUNT"
   };
};

export const accountActionChangeUserAccountAvatarHash = (newHash: string): accountActionsTypes => {
   return {
      type: "CHANGE_USER_ACCOUNT_AVATAR_HASH",
      newHash: newHash
   };
};

export const accountActionChangeUserPublicName = (newName: string): accountActionsTypes => {
   return {
      type: "CHANGE_USER_ACCOUNT_PUBLIC_NAME",
      newName
   };
};

export const accountActionAcceptUserFriendInvite = (userData: userPublicData): accountActionsTypes => {
   return {
      type: "ACCEPT_USER_FRIEND_INVITE",
      userData
   };
};

export const accountActionRejectUserFriendInvite = (userData: userPublicData): accountActionsTypes => {
   return {
      type: "REJECT_USER_FRIEND_INVITE",
      userData
   };
};

export const accountActionDeleteUserFromFriends = (friendId: string): accountActionsTypes => {
   return {
      type: "DELETE_USER_FROM_FRIENDS",
      friendId
   };
};

export const accountActionSetConnectedFriends = (friendsId: Array<string>): accountActionsTypes => {
   return {
      type: "SET_CONNECTED_FRIENDS", friendsId
   };
};

export const accountActionSetConnectedFriend = (friendId: string): accountActionsTypes => {
   return {
      type: "SET_CONNECTED_FRIEND", friendId
   };
};

export const accountActionSetDisconnectedFriends = (friendId: string): accountActionsTypes => {
   return {
      type: "SET_DISCONNECTED_FRIEND", friendId
   };
};

export const accountActionSetInviteToRoom = (roomId: string, userId: string): accountActionsTypes => {
   return {
      type: "SET_USER_ROOM_INVITE_ID", roomId, userId
   };
};

export const accountActionRemoveFriendRoomInvite = (friendId: string): accountActionsTypes => {
   return {
      type: "REMOVE_FRIEND_ROOM_INVITE", friendId
   };
};
