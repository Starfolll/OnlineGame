import React from "react";
import {useSelector} from "react-redux";
import {rootReducerTypes} from "../../../../store/reducers";


export default function GameTableStatsSection() {
   const tableInfo = useSelector((state: rootReducerTypes) => state.gameTable.tableInfo);

   return (
      <div>
         {JSON.stringify(tableInfo)}
      </div>
   )
}
