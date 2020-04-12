import {Grid} from "@material-ui/core";
import React from "react";
import ElementTransition from "../elementTransition/ElementTransition";
import GameTableStatsSection from "./tableSectinos/gameTabelInfoSection";
import GameTableHandSection from "./tableSectinos/gameTableHandSection";
import GameTablePlayersSection from "./tableSectinos/gameTablePlayersSection";


export default function GameTableContainer() {
   return (
      <ElementTransition>
         <Grid container spacing={2}>
            <Grid item>
               <GameTablePlayersSection/>
            </Grid>
            <Grid item>
               <GameTableStatsSection/>
            </Grid>
         </Grid>

         <GameTableHandSection/>

      </ElementTransition>
   );
}
