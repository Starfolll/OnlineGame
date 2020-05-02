import {Grid} from "@material-ui/core";
import React from "react";
import GapContainer from "../gapContainer/GapConteiner";


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
