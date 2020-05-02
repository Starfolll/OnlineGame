import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Box} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import NavigationButtonsBar from "../navigationButtonsBar/ButtonNavigationBar";
import RedirectLink from "../redirectLink/RedirectLink";


const useStyles = makeStyles(theme => ({
   navBar: {
      background: "rgb(0,0,0)",
      color: theme.palette.primary.main,
      padding: theme.spacing(1.5),
   },
   name: {
      fontSize: 32,
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3)
   }
}));

export default function NavBar(props: {
   name: string,
   navigationButtons: Array<{ title: string, link: string }>,
   accountNavigation: React.ReactNode
}) {
   const classes = useStyles();

   return (
      <Box boxShadow={3} className={classes.navBar}>
         <Grid style={{height: "56px"}} container spacing={2} direction="row" alignItems="center">
            <Grid item>
               <Box className={classes.name}>
                  {props.name}
               </Box>
            </Grid>
            <Grid item xs>
               <NavigationButtonsBar>
                  {props.navigationButtons.map((item) =>
                     <RedirectLink
                        key={`${Math.random()}`}
                        style={{color: "white"}}
                        title={item.title}
                        link={item.link}
                     />
                  )}
               </NavigationButtonsBar>
            </Grid>
            <Grid item>
               {props.accountNavigation}
            </Grid>
         </Grid>
      </Box>
   );
}