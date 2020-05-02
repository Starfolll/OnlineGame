import {Grid} from "@material-ui/core";
import React from "react";
import {useSelector} from "react-redux";
import {playerInfo} from "../../../../store/actions/table/table.actions.types";
import {rootReducerTypes} from "../../../../store/reducers";
import PlayerSection from "./sectionsComponents/playerSectoin";


export default function GameTablePlayersSection() {
   const players = useSelector((state: rootReducerTypes) => state.gameTable.table.players);

   return (
      <Grid container spacing={2}>
         {players
            .sort((p1: playerInfo, p2: playerInfo) => p2.heroPickTurnNumber! - p1.heroPickTurnNumber!)
            .map((p: playerInfo) => <Grid item key={p.user.id}>
               <PlayerSection player={p}/>
            </Grid>)}
      </Grid>
   );
}
