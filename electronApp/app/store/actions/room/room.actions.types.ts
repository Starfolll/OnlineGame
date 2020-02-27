import {userPublicData} from "../account/account.actions.types";

export type extendedRoomData = {
   roomData: roomData;
   usersInRoom: Array<userPublicData>
}

export type roomData = {
   id: string;
   isPublic: boolean;
   maxUsersInRoom: number;
   creator?: userPublicData;
}


const DECLARE_ROOM = "DECLARE_ROOM";
const ADD_USER_TO_ROOM = "ADD_USER_TO_ROOM";
const REMOVE_USER_FROM_ROOM = "REMOVE_USER_FROM_ROOM";
const DELETE_ROOM = "DELETE_ROOM";


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

export type roomActionsTypes =
   DeclareRoom |
   AddUserToRoom |
   RemoveUserFromRoom |
   DeleteRoom;
