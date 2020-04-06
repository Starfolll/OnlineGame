import React from "react";
import {useSelector} from "react-redux";
import {playerInfo} from "../../../../store/actions/table/table.actions.types";
import {rootReducerTypes} from "../../../../store/reducers";
import GapContainer from "../../gapContainer/GapConteiner";
import PlayerContainer from "./sectionsComponents/playersSection/playerContainer";


export default function GameTablePlayersSection() {
   const players = useSelector((state: rootReducerTypes) => state.gameTable.players);
   
   return (
      <GapContainer>
         {players.map((p: playerInfo) => <PlayerContainer player={p}/>)}
      </GapContainer>
   );
}
