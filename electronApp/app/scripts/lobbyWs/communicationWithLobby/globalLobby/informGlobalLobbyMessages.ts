import {initialConnection} from "./informGlobalLobbyMessages.types";

export default class GetGlobalLobbyMessage {
   public static InitialConnection(id: string, token: string): initialConnection {
      return {
         messageType: "userInitialConnection", id, token
      };
   }
}
