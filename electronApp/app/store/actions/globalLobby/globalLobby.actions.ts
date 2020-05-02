import {chatMessageInfo, globalLobbyActionsTypes, lobbyDataWithActions} from "./globalLobby.actions.types";


export const globalLobbyActionsDeclareGlobalLobby = (lobbyData: lobbyDataWithActions): globalLobbyActionsTypes => {
   return {
      type: "DECLARE_GLOBAL_LOBBY",
      lobbyData
   };
};

export const globalLobbyActionsAddGlobalLobbyMessage = (message: chatMessageInfo): globalLobbyActionsTypes => {
   return {
      type: "ADD_CHAT_MESSAGE",
      message
   };
};

export const globalLobbyDeleteLobbyData = (): globalLobbyActionsTypes => ({
   type: "DELETE_GLOBAL_LOBBY_DATA"
});
