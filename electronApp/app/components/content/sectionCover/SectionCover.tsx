import {Box} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import GapContainer from "../gapContainer/GapConteiner";
import SectionTitle from "../sectionTitle/SectionTitle";


const useStyles = makeStyles(theme => ({
   root: {
      boxShadow: theme.shadows[4],
      borderRadius: "5px",
   }
}));

export default function SectionCover(props: {
   style?: React.CSSProperties,
   title?: any,
   children?: any,
   inverted?: boolean,
   className?: string
}) {
   const classes = useStyles();
   const inverted = props.inverted ?? false;

   return (
      <Box>
         <Box
            style={{background: inverted ? "black" : "inherit", ...props.style}}
            className={`${classes.root} ${props.className}`}
         >
            {!!props.title ?
               <GapContainer padding={"5px"}>
                  <SectionTitle>
                     {props.title}
                  </SectionTitle>
               </GapContainer> : ""
            }
            {props.children}
         </Box>
      </Box>
   );
}
