import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Box} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";


const useStyles = makeStyles(theme => ({
   container: {

   },
   img: {
      maxWidth: "100%",
      width: "100%",
      height: "auto"
   },
   title: {
      margin: "auto",
   }
}));

export default function TitleImage(props: {
   imageUrl: string,
   title: string
}) {
   const classes = useStyles();

   return (
      <Box className={classes.container}>
         <Typography className={classes.title} align={"center"} variant={"h5"}>
            {props.title}
         </Typography>
         <img
            className={classes.img}
            src={props.imageUrl}
            alt={"image"}
         />
      </Box>
   );
};