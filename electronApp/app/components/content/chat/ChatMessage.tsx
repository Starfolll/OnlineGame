import {Grid, Typography} from "@material-ui/core";
import React from "react";
import {chatMessageInfo} from "../../../store/actions/globalLobby/globalLobby.actions.types";
import GapContainer from "../gapContainer/GapConteiner";


export default function ChatMessage(props: {
   message: chatMessageInfo
}) {
   return (
      <GapContainer padding={"5px"}>
         <Grid container spacing={2}>
            {!props.message.isServerMessage ?
               <Grid item>
                  <Typography variant={"body1"} color={"primary"}>
                     {props.message.user.publicName}
                  </Typography>
               </Grid> : ""
            }
            <Grid item xs>
               <Typography
                  style={{background: "rgba(0,0,0,0.03)", borderRadius: "5px", padding: "3px 5px 3px 5px"}}
                  variant={"body1"}
               >
                  {props.message.message}
               </Typography>
            </Grid>
         </Grid>
      </GapContainer>
   );
}
