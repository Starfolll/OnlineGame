import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import {Box} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import UserProfileAvatar from "../userProfileAvatar/UserProfileAvatar";


const useStyles = makeStyles(theme => ({
   navBar: {
      background: "rgb(0,0,0)",
      color: "deepskyblue",
      padding: theme.spacing(1.5),
   },
   name: {
      fontSize: 32,
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      textShadow: "0 0 5px deepskyblue"
   }
}));

export default function NavBar() {
   const classes = useStyles();

   return (
      <Box boxShadow={3} className={classes.navBar}>
         <Grid container spacing={2} direction="row" alignItems="center">
            <Grid item xs>
               <Typography className={classes.name}>
                  CITADEL X
               </Typography>
            </Grid>
            <Grid item>
               <UserProfileAvatar
                  name={"name"}
               />
            </Grid>
         </Grid>
      </Box>
   );
}