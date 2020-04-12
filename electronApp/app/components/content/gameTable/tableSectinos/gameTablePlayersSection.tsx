import React from "react";
import {useSelector} from "react-redux";
import {playerInfo} from "../../../../store/actions/table/table.actions.types";
import {rootReducerTypes} from "../../../../store/reducers";
import GapContainer from "../../gapContainer/GapConteiner";
import PlayerSection from "./sectionsComponents/playerSectoin";


export default function GameTablePlayersSection() {
   const players = useSelector((state: rootReducerTypes) => state.gameTable.players);

   return (
      <GapContainer>
         {players.map((p: playerInfo) => <PlayerSection key={p.user.id} player={p}/>)}
      </GapContainer>
   );
}
