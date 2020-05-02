import React from "react";
import SectionCover from "../sectionCover/SectionCover";
import GapContainer from "../gapContainer/GapConteiner";
import {Avatar, Box, Grid, Typography} from "@material-ui/core";
import {urlsPath} from "../../../env/env";


export default function MediumAccountProfileSection(props: {
   avatarUrlHash: string | undefined,
   publicName: string;
   lvl: number;
}) {
   const avatarUrl = !props.avatarUrlHash ? urlsPath.getDefaultAvatar() : urlsPath.getUserAvatar(props.avatarUrlHash);

   return (
      <SectionCover>
         <GapContainer padding={"5px"}>
            <Grid container>
               <Grid item>
                  <GapContainer padding={"5px"}>
                     <Avatar
                        src={avatarUrl}
                        style={{width: "55px", height: "55px"}}
                     />
                  </GapContainer>
               </Grid>
               <Grid item xs>
                  <GapContainer style={{marginLeft: "10px"}}>
                     <Box style={{display: "flex", justifyContent: "space-between"}}>
                        <Typography color={"secondary"} variant={"subtitle1"}>
                           {props.publicName}
                        </Typography>
                        <Typography style={{color: "black", display: "flex"}} variant={"body1"}>
                           Lvl : {props.lvl}
                        </Typography>
                     </Box>
                  </GapContainer>
               </Grid>
            </Grid>
         </GapContainer>
      </SectionCover>
   );
}