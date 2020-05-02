import {Grid} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CloseIcon from '@material-ui/icons/Close';
import MinimizeIcon from '@material-ui/icons/Minimize';
import * as React from "react";
import rendererWindowApi from "../../../../scripts/rendererIPC.types";
import ElementTransition from "../elementTransition/ElementTransition";


const useStyles = makeStyles(theme => ({
   frameContainer: {
      background: "black",
      borderRadius: "5px",
      padding: "3px",
      boxShadow: theme.shadows["4"]
   },
   frameDraggablePart: {
      "-webkit-app-region": "drag",
      height: "20px"
   },
   frameIconButton: {
      display: "grid",
      transition: "background 0.5s",
      background: "transparent",
      borderRadius: "5px",
      marginLeft: "5px",
      "&:hover": {
         background: "rgba(255,255,255,0.15)"
      },
   }
}));

export default function Frame(props: {
   children?: any,
}) {
   const classes = useStyles();

   const closeWindow = () => rendererWindowApi.closeWindow();
   const minimizeWindow = () => rendererWindowApi.minimizeWindow();

   return (
      <ElementTransition>
         <Grid item className={classes.frameContainer}>
            <Grid container alignItems={"center"}>
               <Grid className={classes.frameDraggablePart} xs item/>
               <Grid item>
                  <MinimizeIcon onClick={minimizeWindow} className={classes.frameIconButton} color={"primary"}/>
               </Grid>
               <Grid item>
                  <CloseIcon onClick={closeWindow} className={classes.frameIconButton} color={"error"}/>
               </Grid>
            </Grid>
         </Grid>
      </ElementTransition>
   );
}
