import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Box, Typography} from "@material-ui/core";
import ElementTransition from "../elementTransition/ElementTransition";


const useStyles = makeStyles(theme => ({
   root: {
      position: "relative"
   },
   popover: {
      position: "absolute",
      top: "50%",
      right: "-5px",
      textAlign: "center"
   },
   popoverContentContainer: {
      position: "relative"
   },
   popoverContent: {
      padding: theme.spacing(0.5),
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      background: theme.palette.error.main,
      position: "absolute",
      top: "0px",
      left: "0px",
      textAlign: "center",
      borderRadius: "0 500px 500px 500px",
      boxShadow: theme.shadows["4"],
   },
   popoverText:{
      color: "white"
   }
}));

export default function ArrowedPopover(props: {
   children?: any,
   hidden?: boolean
   title?: string | null
}) {
   const classes = useStyles();

   return (
      <ElementTransition>
         <Box className={classes.root}>
            {props.children}
            {!!props.title ? <Box className={classes.popover}>
               <Box className={classes.popoverContentContainer}>
                  <Box className={classes.popoverContent}>
                     <Typography className={classes.popoverText} noWrap>
                        {props.title}
                     </Typography>
                  </Box>
               </Box>
            </Box> : ""}
         </Box>
      </ElementTransition>
   );
};