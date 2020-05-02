import {userPublicData} from "../account/account.actions.types";
import {extendedRoomData, roomActionsTypes} from "./room.actions.types";


export const roomActionsDeclareRoom = (room: extendedRoomData): roomActionsTypes => {
   return {
      type: "DECLARE_ROOM", room
   };
};

export const roomActionsAddUserToRoom = (user: userPublicData): roomActionsTypes => {
   return {
      type: "ADD_USER_TO_ROOM", user
   };
};

export const roomActionsRemoveUserFromRoom = (userId: string): roomActionsTypes => {
   return {
      type: "REMOVE_USER_FROM_ROOM", userId
   };
};

export const roomActionsDeleteRoom = (): roomActionsTypes => {
   return {
      type: "DELETE_ROOM"
   };
};
