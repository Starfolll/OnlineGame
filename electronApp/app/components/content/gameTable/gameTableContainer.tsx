import {Dialog} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import LobbyConnection from "../../../scripts/lobbyWs/lobbyConnection";
import {tableActionDeleteTableData} from "../../../store/actions/table/table.actions";
import {playerEndGameScoreTable, playerInfo} from "../../../store/actions/table/table.actions.types";
import {rootReducerTypes} from "../../../store/reducers";
import ElementTransition from "../elementTransition/ElementTransition";
import GapContainer from "../gapContainer/GapConteiner";
import SectionCover from "../sectionCover/SectionCover";
import UserAccountAvatar from "../userAccountAvatar/UserAccountAvatar";
import GameTableInfoSection from "./tableSectinos/gameTabelInfoSection";
import GameTableHandSection from "./tableSectinos/gameTableHandSection";
import GameTablePlayersSection from "./tableSectinos/gameTablePlayersSection";


export default function GameTableContainer() {
   const playersScoreTable = useSelector((state: rootReducerTypes) => state.gameTable.table.tableInfo.endGameScoreTable);
   const players = useSelector((state: rootReducerTypes) => state.gameTable.table.players);
   const account = useSelector((state: rootReducerTypes) => state.account);
   const dispatch = useDispatch();

   const leaveGame = async () => {
      dispatch(tableActionDeleteTableData());
      new LobbyConnection({account, wsUrl: `ws://localhost:8081`, dispatch});
   };

   return (
      <ElementTransition>
         <GapContainer
            padding={"5px"} gap={"10px"}
            style={{height: "calc(100% + 16px)", gridTemplateRows: "auto 1fr"}}
         >
            <GameTablePlayersSection/>
            <GameTableInfoSection/>
         </GapContainer>

         <GameTableHandSection/>

         <Dialog open={!!playersScoreTable}>
            {!!playersScoreTable ? <GapContainer>
               <Grid container spacing={3}>
                  {playersScoreTable
                     .sort((p: playerEndGameScoreTable, n: playerEndGameScoreTable) => n.place - p.place)
                     .map((s: playerEndGameScoreTable) => {
                        const player = players.filter((p: playerInfo) => p.user.id === s.playerId)[0];
                        return (
                           <Grid item key={s.playerId}>
                              <SectionCover>
                                 <GapContainer>
                                    <UserAccountAvatar {...player.user}/>
                                    <div>Place : {s.place}</div>
                                    <div>Score : {s.score}</div>
                                 </GapContainer>
                              </SectionCover>
                           </Grid>
                        );
                     })
                  }
               </Grid>

               <Button onClick={leaveGame}>Continue</Button>
            </GapContainer> : ""}
         </Dialog>
      </ElementTransition>
   );
}
