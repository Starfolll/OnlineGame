import {Button, Grid, Typography} from "@material-ui/core";
import React from "react";
import GapContainer from "../gapContainer/GapConteiner";
import SectionCover from "../sectionCover/SectionCover";


export default function SectionTitle(props: {
   children: any,
   style?: React.CSSProperties,
   buttons?: Array<{ title: string, onClick: Function }>,
   altColor?: boolean
}) {
   return (
      <SectionCover style={{background: props.altColor ? "white" : "black", ...props.style}}>
         <GapContainer padding={"5px"} gap={"5px"}>
            <Typography align={"center"} style={{color: props.altColor ? "black" : "white"}} variant={"subtitle1"}>
               {props.children}
            </Typography>
            {!!props.buttons && props.buttons.length > 0 ? <Grid container spacing={1}>
               {props.buttons?.map(b =>
                  <Grid item key={Math.random()}>
                     <Button onClick={() => b.onClick()} size={"small"} color={"secondary"} variant={"outlined"}>
                        {b.title}
                     </Button>
                  </Grid>
               )}
            </Grid> : ""}
         </GapContainer>
      </SectionCover>
   );
}
