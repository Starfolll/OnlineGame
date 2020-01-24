import React from "react";
import {Grid, Typography} from "@material-ui/core";
import SectionCover from "../content/sectionCover/SectionCover";
import GapContainer from "../content/gapContainer/GapConteiner";
import ElementTransition from "../content/elementTransition/ElementTransition";


export default function Page404(props: any) {
   return (
      <ElementTransition>
         <Grid container justify={"center"}>
            <Grid item xs={5}>
               <SectionCover style={{
                  borderTopRightRadius: "0",
                  borderTopLeftRadius: "0",
                  background: "black",
                  color: "white",
                  textAlign: "center"
               }}>
                  <GapContainer padding={"15px"}>
                     <Typography color={"error"} variant={"h6"}>
                        Page not found <br/>
                        404
                     </Typography>
                  </GapContainer>
               </SectionCover>
            </Grid>
         </Grid>
      </ElementTransition>
   );
}