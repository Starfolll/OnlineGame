import React from "react";
import {userAccountData} from "../../store/actions/account/account.actions.types";
import GameWsConnection from "./gameWsConnecction";


export default class GameConnection {
   constructor(props: {
      wsUrl: string,
      account: userAccountData,
      dispatch: any,
      tableId: string
   }) {
      new GameWsConnection(props);
   }
}
