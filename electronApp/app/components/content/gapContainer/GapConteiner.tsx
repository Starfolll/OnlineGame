import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Box} from "@material-ui/core";


const useStyles = makeStyles(theme => ({
   container: {
      display: "grid",
   }
}));

export default function GapContainer(props: {
   style?: React.CSSProperties,
   gap?: string,
   padding?: string,
   children?: any
   flex?: boolean
}) {
   const classes = useStyles();
   const padding = !!props.padding ? props.padding : "10px";
   const gap = !!props.gap ? props.gap : "10px";

   return (
      <Box style={{padding: padding, gridGap: gap, ...props.style}} className={classes.container}>
         {props.children}
      </Box>
   );
};