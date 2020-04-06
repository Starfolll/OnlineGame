import React from "react";
import {useSelector} from "react-redux";
import {playerInfo} from "../../../../store/actions/table/table.actions.types";
import {rootReducerTypes} from "../../../../store/reducers";


export default function GameTableHandSection() {
   const account = useSelector((state: rootReducerTypes) => state.account);
   const me: playerInfo = useSelector(
      (state: rootReducerTypes) =>
         state.gameTable.players.filter((u: playerInfo) => u.user.id === account.id)[0]);

   const hand = me.hand;

   return (
      <div>
         {JSON.stringify(hand)}
      </div>
   );
}
