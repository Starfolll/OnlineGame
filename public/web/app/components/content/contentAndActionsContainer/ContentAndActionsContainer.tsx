import React from "react";
import GapContainer from "../gapContainer/GapConteiner";
import {Grid} from "@material-ui/core";


export default function ContentAndActionsContainer(props: {
   content?: any
   actions?: any
}) {
   return (
      <div>
         <GapContainer gap={"5px"} padding={"5px"}>
            <Grid container justify={"space-between"}>
               {/*content*/}
               <Grid item xs>
                  {props.content}
               </Grid>

               {/*actions*/}
               <Grid item>
                  {props.actions}
               </Grid>
            </Grid>
         </GapContainer>
      </div>
   );
}