import {initialGameConnection} from "./informGameMessages.types";

export default class GetGameMessage {
   public static InitialConnection(id: string, token: string, tableId: string): initialGameConnection {
      return {
         messageType: "playerInitialConnection", id, token, tableId
      };
   }
}
