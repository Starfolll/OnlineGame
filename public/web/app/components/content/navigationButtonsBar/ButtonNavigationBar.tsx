import {Grid} from "@material-ui/core";
import React from "react";


export default function NavigationButtonsBar(props: any) {
   return (
      <Grid container spacing={2}>
         {props.children.map((item: React.ReactNode) => <Grid item key={Math.random().toString()}>
            {item}
         </Grid>)}
      </Grid>
   );
};