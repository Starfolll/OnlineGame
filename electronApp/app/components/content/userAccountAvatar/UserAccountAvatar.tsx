import {Badge, Button, Divider, Typography} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import React from "react";
import {useSelector} from "react-redux";
import {urlsPath} from "../../../env/env";
import {rootReducerTypes} from "../../../store/reducers";
import AvatarWithPopover from "../avatarWithPopover/AvatarWithPopover";
import GapContainer from "../gapContainer/GapConteiner";


export default function UserAccountAvatar(props: {
   avatarUrlHash: string | undefined,
   publicName: string,
   friend?: boolean,
   online?: boolean,
   me?: boolean
}) {
   const roomData = useSelector((state: rootReducerTypes) => state.room);
   const avatarUrl = !props.avatarUrlHash ? urlsPath.getDefaultAvatar() : urlsPath.getUserAvatar(props.avatarUrlHash);
   const friend = props.friend ?? false;
   const userPopover = props.me ?? false;

   return (
      <Badge color={"primary"} variant={"dot"} invisible={!props.online} overlap={"circle"}>
         <AvatarWithPopover usePopover={!userPopover} avatarSrc={avatarUrl}>
            {friend ?
               <GapContainer style={{width: "300px"}} padding={"5px"} gap={"5px"}>
                  <Typography variant={"body1"} align={"center"} color={"secondary"}>
                     {props.publicName}
                  </Typography>
                  <Divider/>
                  {!!roomData && !roomData.roomData.isPublic && props.online ?
                     <Button size={"small"} style={{justifyContent: "normal"}} startIcon={<AddIcon/>}>
                        Add to room
                     </Button> : ""
                  }
               </GapContainer>
               :
               <GapContainer style={{width: "200px"}} padding={"5px"} gap={"5px"}>
                  nf
               </GapContainer>
            }
         </AvatarWithPopover>
      </Badge>
   );
}
