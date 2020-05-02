import {userPublicData} from "../account/account.actions.types";

export type extendedRoomData = {
   roomData: roomData;
   usersInRoom: Array<userPublicData>
}

export type roomData = {
   id: string;
   isPublic: boolean;
   maxUsersInRoom: number;
   creatorId?: string;
}


const DECLARE_ROOM = "DECLARE_ROOM";
const ADD_USER_TO_ROOM = "ADD_USER_TO_ROOM";
const REMOVE_USER_FROM_ROOM = "REMOVE_USER_FROM_ROOM";
const DELETE_ROOM = "DELETE_ROOM";
const INVITE_FRIEND_TO_ROOM = "INVITE_FRIEND_TO_ROOM";


interface DeclareRoom {
   type: typeof DECLARE_ROOM;
   room: extendedRoomData;
}

interface AddUserToRoom {
   type: typeof ADD_USER_TO_ROOM;
   user: userPublicData;
}

interface RemoveUserFromRoom {
   type: typeof REMOVE_USER_FROM_ROOM;
   userId: string;
}

interface DeleteRoom {
   type: typeof DELETE_ROOM;
}

interface InviteFriendToRoom {
   type: typeof INVITE_FRIEND_TO_ROOM;
   roomId: string;
   userId: string;
}


export type roomActionsTypes =
   DeclareRoom |
   AddUserToRoom |
   RemoveUserFromRoom |
   DeleteRoom |
   InviteFriendToRoom;
