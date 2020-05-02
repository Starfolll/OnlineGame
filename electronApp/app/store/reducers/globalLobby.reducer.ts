import {globalLobbyActionsTypes, lobbyDataWithActions} from "../actions/globalLobby/globalLobby.actions.types";


export default function globalLobbyReducer(
   state: lobbyDataWithActions | null = null,
   action: globalLobbyActionsTypes
): any {
   switch (action.type) {
      case "DECLARE_GLOBAL_LOBBY":
         return action.lobbyData;

      case "ADD_CHAT_MESSAGE":
         if (!!state) state.lobbyData.chat.push(action.message);
         return Object.assign({}, state);

      case "DELETE_GLOBAL_LOBBY_DATA":
         return null;

      default:
         return state;
   }
};
