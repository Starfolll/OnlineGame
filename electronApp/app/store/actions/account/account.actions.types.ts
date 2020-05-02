export type userPublicData = {
   id: string;
   publicName: string;
   lvl: number;
   avatarUrlHash?: string;
   isConnected?: boolean;
   roomInviteId?: string;
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

const DECLARE_ACCOUNT = "DECLARE_ACCOUNT";
const SIGN_OUT_ACCOUNT = "SIGN_OUT_ACCOUNT";
const CHANGE_USER_ACCOUNT_AVATAR_HASH = "CHANGE_USER_ACCOUNT_AVATAR_HASH";
const CHANGE_USER_ACCOUNT_PUBLIC_NAME = "CHANGE_USER_ACCOUNT_PUBLIC_NAME";
const ACCEPT_USER_FRIEND_INVITE = "ACCEPT_USER_FRIEND_INVITE";
const REJECT_USER_FRIEND_INVITE = "REJECT_USER_FRIEND_INVITE";
const DELETE_USER_FROM_FRIENDS = "DELETE_USER_FROM_FRIENDS";
const SET_CONNECTED_FRIENDS = "SET_CONNECTED_FRIENDS";
const SET_CONNECTED_FRIEND = "SET_CONNECTED_FRIEND";
const SET_DISCONNECTED_FRIEND = "SET_DISCONNECTED_FRIEND";
const SET_USER_ROOM_INVITE_ID = "SET_USER_ROOM_INVITE_ID";
const REMOVE_FRIEND_ROOM_INVITE = "REMOVE_FRIEND_ROOM_INVITE";


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

interface DeleteUserFromFriends {
   type: typeof DELETE_USER_FROM_FRIENDS;
   friendId: string;
}

interface SetConnectedFriends {
   type: typeof SET_CONNECTED_FRIENDS;
   friendsId: Array<string>;
}

interface SetConnectedFriend {
   type: typeof SET_CONNECTED_FRIEND;
   friendId: string;
}

interface SetDisconnectedFriend {
   type: typeof SET_DISCONNECTED_FRIEND;
   friendId: string;
}

interface SetUserRoomInviteId {
   type: typeof SET_USER_ROOM_INVITE_ID;
   roomId: string;
   userId: string;
}

interface RemoveFriendRoomInvite {
   type: typeof REMOVE_FRIEND_ROOM_INVITE;
   friendId: string;
}


export type accountActionsTypes =
   DeclareAccount |
   SignOutAccount |
   ChangeUserAccountAvatarHash |
   ChangeUserAccountPublicName |
   AcceptUserFriendInvite |
   RejectUserFriendInvite |
   DeleteUserFromFriends |
   SetConnectedFriends |
   SetConnectedFriend |
   SetDisconnectedFriend |
   SetUserRoomInviteId |
   RemoveFriendRoomInvite;
