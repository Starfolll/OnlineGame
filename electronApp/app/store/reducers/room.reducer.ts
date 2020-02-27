import {extendedRoomData, roomActionsTypes} from "../actions/room/room.actions.types";


export default function roomReducer(
   state: extendedRoomData | null = null,
   action: roomActionsTypes
): any {
   switch (action.type) {
      case "DECLARE_ROOM":
         return action.room;

      case "ADD_USER_TO_ROOM":
         if (!!state) state.usersInRoom.push(action.user);
         return !!state ? Object.assign({}, state) : state;

      case "REMOVE_USER_FROM_ROOM":
         if (state) state.usersInRoom = state.usersInRoom.filter(u => u.id !== action.userId);
         return !!state ? Object.assign({}, state) : state;

      case "DELETE_ROOM":
         return null;

      default:
         return state;
   }
};
