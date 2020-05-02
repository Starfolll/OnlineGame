import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Box} from "@material-ui/core";


const useStyles = makeStyles(theme => ({
   root: {
      boxShadow: theme.shadows[4],
      borderRadius: "5px",
   }
}));

export default function SectionCover(props: {
   style?: React.CSSProperties,
   children?: any
}) {
   const classes = useStyles();

   return (
      <Box style={props.style} className={classes.root}>
         {props.children}
      </Box>
   )
}