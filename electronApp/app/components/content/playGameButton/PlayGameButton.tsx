import {Button, Grid, Typography} from "@material-ui/core";
import React from "react";
import {useSelector} from "react-redux";
import {rootReducerTypes} from "../../../store/reducers";
import ElementTransition from "../elementTransition/ElementTransition";
import GapContainer from "../gapContainer/GapConteiner";
import SectionCover from "../sectionCover/SectionCover";


export default function PlayGameButton() {
   const account = useSelector((state: rootReducerTypes) => state.account);
   const globalLobby = useSelector((state: rootReducerTypes) => state.globalLobby);
   const room = useSelector((state: rootReducerTypes) => state.room);

   const startGame = () => {
      if (!!globalLobby && !room) globalLobby.lobbyActions.searchForPublicRoom();
      else if (!!room) globalLobby.lobbyActions.startGame();
   };

   const leaveRoom = () => {
      if (!!room) globalLobby.lobbyActions.leaveRoom();
   };

   return (
      <ElementTransition delay={0.5}>
         <SectionCover inverted style={{width: "350px"}}>
            <GapContainer padding={"5px"}>
               <Grid container>
                  {!room || (!!room && !room.roomData.isPublic
                     && room.roomData.maxUsersInRoom === room.usersInRoom.length &&
                     room.roomData.creatorId === account.id) ?
                     <Grid item xs>
                        <Button onClick={startGame} color={"primary"} size={"large"} fullWidth>
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
      </ElementTransition>
   );
}
