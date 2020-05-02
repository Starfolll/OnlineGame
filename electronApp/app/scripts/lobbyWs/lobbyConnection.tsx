import React from "react";
import {userAccountData} from "../../store/actions/account/account.actions.types";
import LobbyWSConnection from "./lobbyWsConnection";


export default class LobbyConnection {
   constructor(props: {
      wsUrl: string,
      account: userAccountData,
      dispatch: any
   }) {
      new LobbyWSConnection(props);
   }
}
