import {Box, Typography} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import rendererWindowApi from "../../../../scripts/rendererIPC.types";


const useStyles = makeStyles(theme => ({
   container: {
      position: "fixed",
      bottom: "5px",
      left: "10px"
   }
}));

export default function AppVersion() {
   const classes = useStyles();

   const appVersion = rendererWindowApi.appVersion;

   return (
      <Box className={classes.container}>
         <Typography variant={"body1"} style={{color: "rgba(0,0,0,0.7)"}}>
            v : {appVersion}
         </Typography>
      </Box>
   );
}
