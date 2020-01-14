import {Box} from "@material-ui/core";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";


const useStyles = makeStyles(theme => ({
   containerGrid: {
      display: "grid",
      alignItems: "center",
      justifyItems: "center"
   },
   container: {
      borderRadius: "50%",
      width: "50px",
      height: "50px",
      background: "gray",
   },
   levelContainer: {
      borderRadius: "50%",
      width: "calc(100% - 6px)",
      height: "calc(100% - 6px)",
      background: "blue",
   },
   container2: {
      borderRadius: "50%",
      width: "calc(100% - 6px)",
      height: "calc(100% - 6px)",
      background: "green",
   },
   image: {
      width: "100%",
      height: "100%"
   }
}));

export default function Avatar(props) {
   const classes = useStyles();

   const src = props.src;

   return (
      <Box className={[classes.container, classes.containerGrid]}>
         <Box className={[classes.levelContainer, classes.containerGrid]}>
            <Box className={[classes.container2, classes.containerGrid]}>
               <img className={classes.image} alt={"user avatar"} src={src}/>
            </Box>
         </Box>
      </Box>
   )
}