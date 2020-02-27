import {Box, Button, Dialog, Fab, Grid, Typography} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import rendererWindowApi from "../../../../scripts/rendererIPC.types";
import GapContainer from "../gapContainer/GapConteiner";


export default function ExitFab() {
   const [open, setOpen] = React.useState(false);

   return (
      <Box>
         <Fab onClick={() => setOpen(true)} size={"medium"}
              style={{background: "black"}}>
            <CloseIcon color={"error"}/>
         </Fab>
         <Dialog onClose={() => setOpen(false)} open={open}>
            <GapContainer style={{background: "black", width: "400px"}} padding={"20px"} gap={"20px"}>
               <Typography align={"center"} variant={"h6"} style={{color: "white"}}>
                  Really want to exit?
               </Typography>
               <Grid container>
                  <Grid item xs>
                     <Button onClick={() => rendererWindowApi.closeWindow()} fullWidth color={"secondary"}>
                        <Typography variant={"body1"} color={"secondary"}>
                           YES
                        </Typography>
                     </Button>
                  </Grid>
                  <Grid item xs>
                     <Button onClick={() => setOpen(false)} fullWidth color={"primary"}>
                        <Typography variant={"body1"} color={"primary"}>
                           NO
                        </Typography>
                     </Button>
                  </Grid>
               </Grid>
            </GapContainer>
         </Dialog>
      </Box>
   );
}
