import {initialGlobalLobbyConnection} from "./informGlobalLobbyMessages.types";

export default class GetGlobalLobbyMessage {
   public static InitialConnection(id: string, token: string): initialGlobalLobbyConnection {
      return {
         messageType: "userInitialConnection", id, token
      };
   }
}
