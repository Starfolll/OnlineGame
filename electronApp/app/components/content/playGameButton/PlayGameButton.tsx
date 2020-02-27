import {Button, Grid, Typography} from "@material-ui/core";
import React from "react";
import {useSelector} from "react-redux";
import {rootReducerTypes} from "../../../store/reducers";
import ElementTransition from "../elementTransition/ElementTransition";
import GapContainer from "../gapContainer/GapConteiner";
import SectionCover from "../sectionCover/SectionCover";


export default function PlayGameButton() {
   const globalLobby = useSelector((state: rootReducerTypes) => state.globalLobby);
   const room = useSelector((state: rootReducerTypes) => state.room);

   const searchForPublicRoom = () => {
      if (!!globalLobby) globalLobby.lobbyActions.searchForPublicRoom();
   };

   const leaveRoom = () => {
      if (!!room) globalLobby.lobbyActions.leaveRoom();
   };

   return (
      <ElementTransition delay={0.5}>
         <GapContainer
            padding={"40px"}
            gap={"5px"}
            style={{width: "350px"}}
         >
            <SectionCover inverted>
               <GapContainer padding={"5px"}>
                  <Grid container>
                     {!room || (!!room && !room.roomData.isPublic) ?
                        <Grid item xs>
                           <Button onClick={searchForPublicRoom} color={"primary"} size={"large"} fullWidth>
                              PLAY
                           </Button>
                        </Grid> : ""
                     }
                     {!!room ?
                        <Grid item xs={!!room && room.roomData.isPublic}>
                           <Typography color={"error"}>
                              <Button onClick={leaveRoom} color={"inherit"} size={"large"} fullWidth>
                                 EXIT
                              </Button>
                           </Typography>
                        </Grid> : ""
                     }
                  </Grid>
               </GapContainer>
            </SectionCover>
         </GapContainer>
      </ElementTransition>
   );
}
